import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath, revalidateTag } from 'next/cache';
import connectToDatabase from '@canvas/data/db/mongodb';
import { QuestionV2 } from '@canvas/data/models/Question.v2';
import { Chapter } from '@canvas/data/models/Chapter';
import { AuditLog } from '@canvas/data/models/AuditLog';
import { canEditQuestion, canDeleteQuestion } from '@canvas/data/rbac';
import { trackServer } from '@canvas/core/analytics/mixpanel.server';
import { revalidateStudentPaths, questionPagePaths } from './revalidate-bridge';
import type { ServiceDeps } from './types';

// ── Transient-DB resilience ──────────────────────────────────────────────────
// A MongoDB socket can drop mid-request (Atlas idle-disconnect, laptop
// sleep/wake, a network blip, or a Next dev recompile). connectToDatabase()
// guarantees a good connection at the START of a request, but an individual
// operation issued after a mid-request drop throws immediately (bufferCommands
// is false). Without a retry, that one blip surfaces to the operator as a
// scary "Failed to update question" even though nothing is wrong with the data.
function isTransientDbError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const name = err.name || '';
  const msg = err.message || '';
  return (
    /Mongo(Network|ServerSelection|NotConnected|PoolCleared|Topology)|ServerSelection|PoolCleared/i.test(name) ||
    /ECONNRESET|ETIMEDOUT|EPIPE|socket|topology was destroyed|connection.*(closed|reset)|server selection timed out|not connected|pool was (cleared|closed)/i.test(msg)
  );
}

// Run a DB operation, retrying a few times on transient connection errors and
// re-establishing the connection between attempts. Non-transient errors (bad
// data, validation) throw immediately — we only paper over infrastructure
// blips, never real failures.
async function retryDbOp<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (!isTransientDbError(e) || i === attempts - 1) throw e;
      try { await connectToDatabase(); } catch { /* next attempt will rethrow */ }
      await new Promise(r => setTimeout(r, 150 * (i + 1)));
    }
  }
  throw lastErr;
}

// GET - Fetch single question by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  deps: ServiceDeps,
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const question = await QuestionV2.findOne({
      _id: id,
      deleted_at: null
    }).lean();

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    // Strip solution for unauthenticated PUBLIC requests only. Authenticated
    // users get the full doc; so does localhost dev (which authenticates via the
    // bypass, not a Supabase session — mirroring PATCH/DELETE below). Without the
    // localhost branch, the admin editor's failed-save recovery GET would return
    // a solution-less doc on local dev and blank the solution in the UI.
    const user = await deps.getAuthenticatedUser(request);
    const isLocalDev = await deps.isLocalhostDev();
    const questionObj = question as Record<string, unknown>;
    const responseData = (user || isLocalDev) ? question : (() => { const { solution: _, ...rest } = questionObj; return rest; })();

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

// PATCH - Update question
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  deps: ServiceDeps,
) {
  // Hoisted so the catch can decide whether to surface error detail to the
  // operator (localhost dev or an authenticated admin) — students never see it.
  let user: Awaited<ReturnType<ServiceDeps['getAuthenticatedUser']>> = null;
  let isLocalDev = false;
  try {
    // Require authentication for all write operations
    user = await deps.getAuthenticatedUser(request);
    isLocalDev = await deps.isLocalhostDev();
    if (!user && !isLocalDev) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { id } = await params;

    // Get existing question (retry transient connection blips)
    const existingQuestion = await retryDbOp(() => QuestionV2.findOne({
      _id: id,
      deleted_at: null
    }));

    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check RBAC: Can user edit this question?
    if (user && !isLocalDev) {
      const hasPermission = await canEditQuestion(user.email!, existingQuestion.metadata.chapter_id);
      if (!hasPermission) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: You do not have permission to edit questions in this subject' },
          { status: 403 }
        );
      }
    }

    // Convert Mongoose document to plain object to avoid internal properties corrupting $set
    const existing = existingQuestion.toObject();

    interface Change {
      field: string;
      old_value: unknown;
      new_value: unknown;
    }
    // Track changes for audit log
    const changes: Change[] = [];

    // Update fields
    const updates: Record<string, unknown> = {
      updated_at: new Date(),
      updated_by: user?.email ?? 'local-dev'
    };

    if (body.type && body.type !== existing.type) {
      changes.push({
        field: 'type',
        old_value: existing.type,
        new_value: body.type
      });
      updates.type = body.type;
    }

    if (body.question_text) {
      changes.push({
        field: 'question_text.markdown',
        old_value: existing.question_text.markdown,
        new_value: body.question_text.markdown
      });
      updates.question_text = {
        ...existing.question_text,
        ...body.question_text,
        latex_validated: false
      };
    }

    if (body.solution) {
      // Handle null/undefined solution object safely
      const existingSolution = existing.solution || { text_markdown: '', latex_validated: false };
      changes.push({
        field: 'solution.text_markdown',
        old_value: existingSolution.text_markdown || '',
        new_value: body.solution.text_markdown || ''
      });
      updates.solution = {
        ...existingSolution,
        ...body.solution,
        latex_validated: false
      };
    }

    if (body.options) {
      changes.push({
        field: 'options',
        old_value: JSON.stringify(existing.options),
        new_value: JSON.stringify(body.options)
      });
      updates.options = body.options;
    }

    if (body.answer) {
      changes.push({
        field: 'answer',
        old_value: JSON.stringify(existing.answer),
        new_value: JSON.stringify(body.answer)
      });
      updates.answer = body.answer;
    }

    if (body.metadata) {
      changes.push({
        field: 'metadata',
        old_value: JSON.stringify(existing.metadata),
        new_value: JSON.stringify(body.metadata)
      });
      const merged = {
        ...existing.metadata,
        ...body.metadata
      } as Record<string, unknown>;

      // Phase 2 (2026-05-07): legacy field auto-sync retired. The admin UI now
      // always sends `applicableExams`; legacy `examBoard` is no longer
      // populated on PATCH. Reads fall back to examBoard via the bridge in
      // actions.ts only for older docs. Phase 4 will drop legacy fields.

      // Demo-question quality gate. Flipping is_demo_question to true requires
      // a real solution: ≥200 chars of solution.text_markdown and
      // latex_validated=true. This prevents low-quality questions from leaking
      // into the side-by-side practice panel (which is effectively a Crucible
      // demo for handwritten-notes readers).
      const wasDemo = (existing.metadata as Record<string, unknown>)?.is_demo_question === true;
      const willBeDemo = merged.is_demo_question === true;
      if (!wasDemo && willBeDemo) {
        const sol = (existing.solution ?? {}) as { text_markdown?: string; latex_validated?: boolean };
        const solText = (sol.text_markdown ?? '').trim();
        if (solText.length < 200 || sol.latex_validated !== true) {
          // Generic error — internal state (current char count, validation
          // flag) intentionally not echoed back per §8.5. The admin UI knows
          // the constraint and can self-diagnose by looking at the question
          // editor.
          return NextResponse.json(
            {
              success: false,
              error: 'Cannot mark as demo: solution must be at least 200 characters and latex-validated.',
            },
            { status: 400 }
          );
        }
      }

      updates.metadata = merged;
    }

    if (body.svg_scales !== undefined) {
      updates.svg_scales = { ...(existing.svg_scales ?? {}), ...body.svg_scales };
    }

    // Flag operations
    if (body.add_flag) {
      // Append a new internal admin flag — always tagged source:'admin'
      const newFlag = {
        type: body.add_flag.type,
        note: body.add_flag.note ?? '',
        source: 'admin' as const,
        flagged_at: new Date(),
        resolved: false,
      };
      updates.flags = [...(existing.flags ?? []), newFlag];
      changes.push({ field: 'flags', old_value: 'none', new_value: newFlag.type });
    }

    if (body.resolve_flags !== undefined) {
      // Mark all flags resolved
      interface Flag {
        resolved?: boolean;
        resolved_at?: Date;
        [key: string]: unknown;
      }
      updates.flags = (existing.flags ?? []).map((f: unknown) => {
        const flag = f as Flag;
        return {
          ...flag,
          resolved: true,
          resolved_at: new Date(),
        };
      });
      changes.push({ field: 'flags', old_value: 'flagged', new_value: 'resolved' });
    }

    if (body.clear_flags) {
      updates.flags = [];
      changes.push({ field: 'flags', old_value: JSON.stringify(existing.flags), new_value: '[]' });
    }

    if (body.status && body.status !== existing.status) {
      changes.push({
        field: 'status',
        old_value: existing.status,
        new_value: body.status
      });
      updates.status = body.status;

      // Update chapter stats (optional — chapter may not exist in MongoDB; taxonomy is code-based)
      try {
        const oldStatus = existing.status;
        const newStatus = body.status;
        const statsUpdate: Record<string, number> = {};
        if (oldStatus === 'draft') statsUpdate['stats.draft_questions'] = -1;
        if (oldStatus === 'published') statsUpdate['stats.published_questions'] = -1;
        if (newStatus === 'draft') statsUpdate['stats.draft_questions'] = 1;
        if (newStatus === 'published') statsUpdate['stats.published_questions'] = 1;
        await Chapter.findByIdAndUpdate(existing.metadata.chapter_id, { $inc: statsUpdate });
      } catch (_chapterErr) {
        // Chapter may not exist in MongoDB — safe to ignore
      }
    }

    // Increment version
    updates.version = (existing.version as number) + 1;

    // Update question — no runValidators to avoid rejecting docs with stale enum
    // values. Idempotent ($set), so a transient-blip retry is safe.
    const updatedQuestion = await retryDbOp(() => QuestionV2.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ));

    if (!updatedQuestion) {
      return NextResponse.json(
        { success: false, error: 'Update failed - question not found' },
        { status: 404 }
      );
    }

    // ── Post-write side effects are NON-FATAL ───────────────────────────────
    // The question is already persisted. Audit-logging, analytics, and cache
    // revalidation must never turn a successful save into a reported failure —
    // a transient blip on any of them previously surfaced as a scary
    // "Failed to update question" while the edit had actually saved. They are
    // best-effort; a failure here is logged, not propagated.
    try {
      // Create audit log
      if (changes.length > 0) {
        const auditLog = new AuditLog({
          _id: uuidv4(),
          entity_type: 'question',
          entity_id: id,
          action: 'update',
          changes,
          user_id: user?.id ?? 'local-dev',
          user_email: user?.email ?? 'local-dev',
          timestamp: new Date(),
          can_rollback: true,
          rollback_data: existingQuestion.toObject()
        });

        await auditLog.save();
      }

      await trackServer(user?.id ?? 'local_dev', 'admin_action', {
        type: 'edit',
        entity: 'question',
        entity_id: id,
      });

      // Bust the questions cache so the edit is visible to students immediately
      revalidateTag('questions');

      // Refresh the student-facing question page (and its chapter page).
      // revalidateTag above only reaches the deployment this service runs in —
      // when that's the admin app, the student app's ISR cache is refreshed via
      // the HTTP bridge instead (revalidate-bridge.ts, cache redesign Phase 1).
      await revalidateStudentPaths(
        questionPagePaths(id, [
          (updatedQuestion.metadata as { chapter_id?: string })?.chapter_id,
        ])
      );

      // If this is (or was) a demo question, also bust the notes-quicktest cache
      // so the side-by-side practice panel reflects the change. Covers: flag flip
      // either direction, and edits to question_text / options / solution on a
      // doc that's currently flagged demo.
      const wasDemoFinal = (existingQuestion.metadata as Record<string, unknown>)?.is_demo_question === true;
      const isDemoFinal = (updatedQuestion.metadata as Record<string, unknown>)?.is_demo_question === true;
      if (wasDemoFinal || isDemoFinal) {
        const chapterId = (updatedQuestion.metadata as { chapter_id?: string })?.chapter_id;
        if (chapterId) {
          revalidatePath(`/api/v2/notes-quicktest/${chapterId}`);
          revalidateTag(`notes-quicktest:${chapterId}`);
        }
      }
    } catch (sideEffectErr) {
      // The write succeeded — do NOT fail the request. Log loudly for ops.
      console.error('[PATCH question] post-write side effect failed (write already committed):', sideEffectErr);
    }

    return NextResponse.json({
      success: true,
      data: updatedQuestion,
      message: 'Question updated successfully'
    });

  } catch (error: unknown) {
    console.error('Error updating question:', error);
    // Surface the real cause to the operator (localhost dev or an authenticated
    // admin) so an intermittent failure is diagnosable instead of a grey zone.
    // Students never reach this write (RBAC blocks them) and never get detail
    // — keeps §8.5 (no internals to public clients). The admin editor already
    // renders this `details` field in its failure dialog.
    const showDetail = isLocalDev || !!(user && deps.isAdmin(user.email));
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    const transient = isTransientDbError(error);
    return NextResponse.json(
      {
        success: false,
        error: transient
          ? 'Temporary database hiccup — your edit was NOT saved. Please try again.'
          : 'Failed to update question',
        ...(showDetail ? { details: detail, transient } : {}),
      },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
  deps: ServiceDeps,
) {
  try {
    // Require authentication for delete
    const user = await deps.getAuthenticatedUser(request);
    const isLocalDev = await deps.isLocalhostDev();
    if (!user && !isLocalDev) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { id } = await params;

    const question = await QuestionV2.findOne({
      _id: id,
      deleted_at: null
    });

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check RBAC: Can user delete this question?
    if (user && !isLocalDev) {
      const hasPermission = await canDeleteQuestion(user.email!, question.metadata.chapter_id);
      if (!hasPermission) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: Only super admins can delete questions' },
          { status: 403 }
        );
      }
    }

    // Soft delete — use updateOne to bypass pre-save middleware (avoids 'next is not a function' in Next.js App Router)
    const deletedAt = new Date();
    await QuestionV2.updateOne(
      { _id: id },
      { $set: { deleted_at: deletedAt, deleted_by: user?.email ?? 'local-dev', updated_at: deletedAt } }
    );

    // Update chapter stats (optional - don't fail delete if chapter doesn't exist in MongoDB)
    try {
      const statsUpdate: Record<string, number> = { 'stats.total_questions': -1 };
      if (question.status === 'draft') statsUpdate['stats.draft_questions'] = -1;
      if (question.status === 'published') statsUpdate['stats.published_questions'] = -1;
      await Chapter.findByIdAndUpdate(question.metadata.chapter_id, { $inc: statsUpdate });
    } catch (chapterError) {
      // Chapter may not exist in MongoDB (taxonomy is code-based) — safe to ignore
    }

    // Create audit log (optional - don't fail delete if audit log fails)
    try {
      const auditLog = new AuditLog({
        _id: uuidv4(),
        entity_type: 'question',
        entity_id: id,
        action: 'delete',
        changes: [{ field: 'deleted_at', old_value: null, new_value: deletedAt }],
        user_id: user?.id ?? 'local-dev',
        user_email: user?.email ?? 'local-dev',
        timestamp: deletedAt,
        can_rollback: true,
        rollback_data: question.toObject()
      });
      await auditLog.save();
    } catch (auditError) {
      console.warn('Audit log failed (non-fatal):', auditError);
    }

    await trackServer(user?.id ?? 'local_dev', 'admin_action', {
      type: 'delete',
      entity: 'question',
      entity_id: id,
    });

    // Bust the questions cache so the deletion is visible to students immediately
    revalidateTag('questions');

    // Drop the student-facing pages too (never throws — see revalidate-bridge.ts).
    await revalidateStudentPaths(
      questionPagePaths(id, [
        (question.metadata as { chapter_id?: string })?.chapter_id,
      ])
    );

    return NextResponse.json({
      success: true,
      message: 'Question deleted successfully'
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error deleting question:', errorMessage);
    console.error('Stack:', errorStack);
    return NextResponse.json(
      { success: false, error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
