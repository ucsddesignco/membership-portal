'use client'

import { supabase } from '@/lib/supabaseClient'

export default function AttendanceLoginPage() {
  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/attendance/dashboard`,
        queryParams: {
          hd: 'ucsd.edu',
        },
      },
    })
  }

  return (
    <div>
      <h1>Log in to view your points!</h1>
      <button onClick={handleGoogleLogin}>
        Sign in with UCSD Google Account
      </button>
    </div>
  )
}