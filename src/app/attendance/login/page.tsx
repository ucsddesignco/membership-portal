'use client'

import { supabase } from '@/lib/supabaseClient'
import DevPasswordLogin, { isLocalSupabaseDev } from '../e/[slug]/DevPasswordLogin'

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
    <main className="min-h-dvh bg-black text-white">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[390px] flex-col items-center px-6 pb-10 pt-6">
        <img
          src="/arrow2.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] top-[14%] h-auto w-[38px]"
        />
        <img
          src="/arrow1.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[8%] top-[60%] h-auto w-[38px]"
        />

        <section className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
          <h1 className="text-3xl font-extrabold leading-tight">
            Log in to view your total points!
          </h1>

          <button
            onClick={handleGoogleLogin}
            className="mt-4 flex w-full items-center justify-center bg-white py-4 text-center text-sm text-black hover:bg-neutral-200"
          >
            Sign in with UCSD Google Account
          </button>

          {isLocalSupabaseDev && <DevPasswordLogin redirectTo="/attendance/dashboard" />}

          <p className="mt-6 max-w-[220px] text-xs leading-relaxed text-white/60">
            Scanning in for an event? Use the QR code at the event instead.
          </p>
        </section>

        <p className="max-w-[170px] text-center text-xs leading-relaxed text-neutral-400">
          Exchange points for merchandise in the future!
        </p>
      </div>
    </main>
  );
}