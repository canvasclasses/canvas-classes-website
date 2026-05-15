'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/app/utils/supabase/server';
import {
  PRIVACY_VERSION,
  TERMS_VERSION,
} from '@/lib/legal/versions';

type Result = { ok: true } | { ok: false; error: string };

export async function acceptConsent(): Promise<Result> {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, error: 'Authentication service not configured' };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: 'Not authenticated' };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      privacy_version: PRIVACY_VERSION,
      terms_version: TERMS_VERSION,
      consent_accepted_at: new Date().toISOString(),
    },
  });

  if (updateError) {
    console.error('acceptConsent failed:', updateError.message);
    return { ok: false, error: 'Failed to record consent' };
  }

  revalidatePath('/', 'layout');
  return { ok: true };
}
