'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

// Only for local Supabase dev: lets you sign in as seeded email/password users.
// Both env references are inlined at build time, so this is false in production builds.
export const isLocalSupabaseDev =
  process.env.NODE_ENV === 'development' &&
  /127\.0\.0\.1|localhost/.test(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '');

export default function DevPasswordLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Reload so the page's existing auth init runs with the new session
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 text-sm">
      <p className="text-xs text-neutral-400">Local dev sign-in</p>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border border-neutral-600 bg-transparent px-2 py-1"
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border border-neutral-600 bg-transparent px-2 py-1"
      />
      <button
        type="submit"
        disabled={loading}
        className="border border-neutral-600 px-2 py-1 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
      {errorMsg && <p className="text-xs">{errorMsg}</p>}
    </form>
  );
}
