'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Footer from '../Footer'
import { isLocalSupabaseDev } from '../e/[slug]/DevPasswordLogin'

export default function DashboardPage() {
  const [fullName, setFullName] = useState('')
  const [totalPoints, setTotalPoints] = useState<number | null>(null)
  const [eventsAttended, setEventsAttended] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/attendance/login'
        return
      }

      // Seeded local users use @test.dev emails
      if (!isLocalSupabaseDev && !user.email?.endsWith('@ucsd.edu')) {
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
        .select('points_awarded, bonus_points')
        .eq('user_id', user.id)

      const total =
        checkins?.reduce((sum, row) => sum + row.points_awarded + row.bonus_points, 0) ?? 0
      setTotalPoints(total)
      setEventsAttended(checkins?.length ?? 0)
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
      <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col items-center px-6 pb-10 pt-6">
        <section className="flex flex-1 items-center pb-24">
          <div className="flex w-[266px] flex-col gap-[72px] text-center">
            <div className="relative">
              {/* Top-right cursor, anchored above the greeting */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cursor.svg"
                alt=""
                aria-hidden="true"
                width={36.565}
                height={36.3996}
                className="pointer-events-none absolute top-[94px] left-[229px]"
              />
              <h1 className="font-plak text-[32px] font-bold leading-[1.2]">
                Hello {fullName}!
              </h1>
            </div>

            <div className="flex flex-col gap-[72px]">
              <div className="flex flex-col">
                <p className="text-[16px]">You have:</p>
                <div className="flex flex-col gap-[9px]">
                  <p className="font-plak text-[65px] font-bold leading-[1.2]">{totalPoints}</p>
                  <p className="text-[16px] leading-none">points total</p>
                </div>
              </div>

              <div className="relative flex flex-col">
                {/* Left cursor, centered in the 72px gap above this block. Figma's rotated variant is this one mirrored. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/cursor.svg"
                  alt=""
                  aria-hidden="true"
                  width={36.565}
                  height={36.3996}
                  className="pointer-events-none absolute -left-[13px] -top-[36px] -translate-y-1/2 -scale-x-100"
                />
                <p className="text-[16px]">You&apos;ve attended:</p>
                <div className="flex flex-col gap-[9px]">
                  <p className="font-plak text-[65px] font-bold leading-[1.2]">{eventsAttended}</p>
                  <p className="text-[16px] leading-none">events total</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer>Exchange points for merchandise in the future!</Footer>
      </div>
    </main>
  );
}
