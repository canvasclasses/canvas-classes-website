'use client';

import { useCallback, useEffect, useState } from 'react';
import { Shield, UserPlus, Trash2, Save, X, AlertCircle, Pencil, ExternalLink } from 'lucide-react';
import { GrantEditor } from './GrantEditor';
import type { Grant, Subject } from '../hooks/usePermissions';

// Build a deep link to this project's Supabase Auth → Users page. Falls back
// to the generic dashboard if the public URL doesn't match the supabase.co
// pattern (e.g. localhost dev).
function getSupabaseUsersUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return 'https://supabase.com/dashboard';
  const match = url.match(/^https?:\/\/([^.]+)\.supabase\.co/);
  if (!match) return 'https://supabase.com/dashboard';
  return `https://supabase.com/dashboard/project/${match[1]}/auth/users`;
}

interface UserAccessDoc {
  _id: string;
  email: string;
  grants: Grant[];
  granted_by: string;
  granted_at: string;
  last_accessed_at?: string;
  is_active: boolean;
  notes?: string;
}

interface StaffAccessManagerProps {
  currentUserEmail: string;
}

interface ModalState {
  mode: 'add' | 'edit';
  email: string;
  grants: Grant[];
  notes: string;
}

function formatGrant(g: Grant): string {
  const subj = g.subject.charAt(0).toUpperCase() + g.subject.slice(1);
  const ch = g.chapters === 'all' ? 'all' : `${g.chapters.length} ch`;
  const lvl = g.level === 'edit' ? '✎' : '👁';
  return `${subj} · ${ch} · ${lvl}`;
}

export default function StaffAccessManager({ currentUserEmail }: StaffAccessManagerProps) {
  const [users, setUsers] = useState<UserAccessDoc[]>([]);
  const [superAdmins, setSuperAdmins] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [permsRes, listRes] = await Promise.all([
        fetch('/api/v2/admin/permissions'),
        fetch('/api/v2/admin/user-access'),
      ]);
      if (!permsRes.ok) throw new Error('Failed to load permissions');
      if (!listRes.ok) throw new Error('Failed to load staff list');
      const perms = (await permsRes.json()) as { superAdmins: string[] };
      const list = (await listRes.json()) as { userAccess: UserAccessDoc[] };
      setSuperAdmins(perms.superAdmins ?? []);
      setUsers(list.userAccess ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openAdd = () => {
    setError(null);
    setSuccess(null);
    setModal({
      mode: 'add',
      email: '',
      grants: [{ subject: 'chemistry', chapters: 'all', level: 'view' }],
      notes: '',
    });
  };

  const openEdit = (u: UserAccessDoc) => {
    setError(null);
    setSuccess(null);
    setModal({
      mode: 'edit',
      email: u.email,
      grants: u.grants,
      notes: u.notes ?? '',
    });
  };

  const saveModal = async () => {
    if (!modal) return;
    setError(null);
    try {
      const res = await fetch('/api/v2/admin/user-access', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: modal.email,
          grants: modal.grants,
          notes: modal.notes,
        }),
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: unknown };
        const msg = typeof j.error === 'string' ? j.error : 'Failed to save';
        throw new Error(msg);
      }
      setSuccess('Staff access saved');
      setModal(null);
      await fetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const removeUser = async (email: string) => {
    if (!confirm(`Remove access for ${email}?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/v2/admin/user-access?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: unknown };
        const msg = typeof j.error === 'string' ? j.error : 'Failed to remove';
        throw new Error(msg);
      }
      setSuccess('Access removed');
      await fetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const updateGrant = (idx: number, next: Grant) => {
    if (!modal) return;
    const grants = modal.grants.slice();
    grants[idx] = next;
    setModal({ ...modal, grants });
  };

  const removeGrant = (idx: number) => {
    if (!modal) return;
    const grants = modal.grants.slice();
    grants.splice(idx, 1);
    setModal({ ...modal, grants });
  };

  const addGrant = () => {
    if (!modal) return;
    const used = new Set(modal.grants.map((g) => g.subject));
    const available: Subject[] = (['chemistry', 'physics', 'mathematics', 'biology'] as Subject[]).filter(
      (s) => !used.has(s),
    );
    if (available.length === 0) {
      setError('All subjects already granted.');
      return;
    }
    setModal({
      ...modal,
      grants: [...modal.grants, { subject: available[0], chapters: 'all', level: 'view' }],
    });
  };

  const subjectsInUse: Subject[] = modal ? modal.grants.map((g) => g.subject) : [];

  return (
    <div className="space-y-8">
      {(error || success) && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
            error
              ? 'border-red-500/40 bg-red-500/10 text-red-300'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <span>{error ?? success}</span>
        </div>
      )}

      <section>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-300">
          <Shield className="h-4 w-4" /> Super admins (env)
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0B0F15] p-4">
          {superAdmins.length === 0 ? (
            <div className="text-sm text-white/50">No super admins configured.</div>
          ) : (
            <ul className="space-y-1 text-sm text-white/80">
              {superAdmins.map((e) => (
                <li key={e} className="font-mono">{e}</li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-white/40">
            To add or remove a super admin, update the{' '}
            <code className="text-orange-300/80">SUPER_ADMIN_EMAILS</code>{' '}
            environment variable in Vercel.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/80">Staff</h2>
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-2 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-sm font-bold text-black hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" /> Add staff
          </button>
        </div>

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-[#0B0F15] p-6 text-sm text-white/50">
            Loading…
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#0B0F15] p-6 text-sm text-white/50">
            No staff yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B0F15]">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-widest text-white/40">
                <tr>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Access</th>
                  <th className="px-4 py-2">Added</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.email.toLowerCase() === currentUserEmail.toLowerCase();
                  return (
                    <tr key={u._id} className="border-t border-white/5 text-white/80">
                      <td className="px-4 py-3 font-mono text-xs">{u.email}</td>
                      <td className="px-4 py-3">
                        {u.grants.length === 0 ? (
                          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/40">
                            no grants
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            {u.grants.map((g, i) => (
                              <div key={i} className="text-xs">{formatGrant(g)}</div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-white/50">
                        {new Date(u.granted_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(u)}
                            disabled={isSelf}
                            title={isSelf ? 'You cannot edit your own access' : 'Edit'}
                            className="rounded-md border border-white/10 p-1.5 text-white/70 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeUser(u.email)}
                            disabled={isSelf}
                            title={isSelf ? 'You cannot remove your own access' : 'Remove'}
                            className="rounded-md border border-white/10 p-1.5 text-white/70 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-[#0B0F15] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <h3 className="text-lg font-semibold">
                {modal.mode === 'add' ? 'Add staff member' : 'Edit staff access'}
              </h3>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-md p-1 text-white/40 hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={modal.email}
                  onChange={(e) => setModal({ ...modal, email: e.target.value })}
                  disabled={modal.mode === 'edit'}
                  placeholder="someone@canvasclasses.in"
                  className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:bg-white/10 focus:outline-none disabled:opacity-60"
                />
                {modal.mode === 'add' && (
                  <p className="mt-1.5 text-xs text-white/40">
                    Make sure this person has a Supabase account before they try to log in.{' '}
                    <a
                      href={getSupabaseUsersUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-orange-300/80 hover:text-orange-300"
                    >
                      Open Supabase users
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-1">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={modal.notes}
                  onChange={(e) => setModal({ ...modal, notes: e.target.value })}
                  placeholder="e.g. Chemistry intern, training period"
                  maxLength={500}
                  className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div>
                <div className="mb-2 text-xs uppercase tracking-widest text-white/40">Grants</div>
                <div className="space-y-3">
                  {modal.grants.map((g, i) => (
                    <GrantEditor
                      key={i}
                      grant={g}
                      disabledSubjects={subjectsInUse.filter((_, j) => j !== i)}
                      onChange={(next) => updateGrant(i, next)}
                      onRemove={() => removeGrant(i)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addGrant}
                  className="mt-3 text-sm text-orange-300 hover:text-orange-200"
                >
                  + Add another grant
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/5 px-6 py-4">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveModal}
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-sm font-bold text-black hover:opacity-90"
              >
                <Save className="h-4 w-4" /> Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
