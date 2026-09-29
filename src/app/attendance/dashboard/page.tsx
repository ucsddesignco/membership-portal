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

      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name ?? user.email,
      })

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
          <p className="text-xs">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-black text-white">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[390px] flex-col items-center px-6 pb-10 pt-6">
        <img
          src="/arrow2.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[12%] top-[24%] h-auto w-[38px]"
        />
        <img
          src="/arrow1.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[12%] top-[61%] h-auto w-[38px]"
        />

        <section className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
          <h1 className="text-3xl font-extrabold leading-tight">
            Hello {fullName}!
          </h1>
          <p className="mt-10 text-sm">You have:</p>
          <p className="mt-1 text-[56px] font-bold leading-none">
            {totalPoints}
          </p>
          <p className="mt-5 text-sm">points total</p>
        </section>

        <p className="max-w-[170px] text-center text-xs leading-relaxed text-neutral-400">
          Exchange points for merchandise in the future!
        </p>
      </div>
    </main>
  );
}