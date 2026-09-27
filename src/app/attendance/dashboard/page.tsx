'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const [fullName, setFullName] = useState('')
  const [totalPoints, setTotalPoints] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/attendance/login'
        return
      }

      if (!user.email?.endsWith('@ucsd.edu')) {
        await supabase.auth.signOut()
        window.location.href = '/attendance/login'
        return
      }

      const firstName =
        user.user_metadata.given_name ??
        user.user_metadata.full_name?.split(' ')[0] ??
        user.email

      setFullName(firstName)

      // Create the profile row on first login, no-op on repeat logins
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name ?? user.email,
      })

      // Sum up their points from checkins
      const { data: checkins } = await supabase
        .from('checkins')
        .select('points_awarded')
        .eq('user_id', user.id)

      const total = checkins?.reduce((sum, row) => sum + row.points_awarded, 0) ?? 0
      setTotalPoints(total)
      setLoading(false)
    }

    init()
  }, [])

  if (loading) {
    return (
      <main className="min-h-dvh bg-black text-white">
        <div className="flex min-h-dvh items-center justify-center">
          <p className="text-[11px]">Loading...</p>
        </div>
      </main>
    )
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
            Hello {fullName}!
          </h1>
          <p className="mt-10 text-[11px]">You have:</p>
          <p className="mt-1 text-[56px] font-bold leading-none">
            {totalPoints}
          </p>
          <p className="mt-5 text-[11px]">points total</p>
        </section>

        <p className="max-w-[170px] text-center text-[11px] leading-snug">
          Exchange points for merchandise in the future!
        </p>
      </div>
    </main>
  );
}