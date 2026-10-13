'use client'

import { supabase } from '@/lib/supabaseClient'
import Footer from '../attendance/Footer'

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
        <svg
          aria-hidden="true"
          className="absolute right-[12%] top-[24%] h-[22px] w-[22px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path d="M5 3l14 8-6 2-3 6z" />
        </svg>
        <svg
          aria-hidden="true"
          className="absolute left-[12%] top-[41%] h-[22px] w-[22px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path d="M3 11l18-8-8 18-2-8z" />
        </svg>

        <section className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
          <h1 className="text-[26px] font-bold leading-tight">
            Log in to view your points!
          </h1>

          <button
            onClick={handleGoogleLogin}
            className="mt-10 rounded-full bg-white px-6 py-3 text-[13px] font-medium text-black"
          >
            Sign in with UCSD Google Account
          </button>

          <p className="mt-6 max-w-[220px] text-[11px] leading-snug text-white/60">
            Scanning in for an event? Use the QR code at the event instead.
          </p>
        </section>

        <Footer>Exchange points for merchandise in the future!</Footer>
      </div>
    </main>
  );
}