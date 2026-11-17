'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { PortalPanelProps } from '../../(portal)/portalPages'
import Footer from '../Footer'

export default function DashboardPanel({ user, active }: PortalPanelProps) {
  const [fullName, setFullName] = useState('')
  const [totalPoints, setTotalPoints] = useState<number | null>(null)
  const [eventsAttended, setEventsAttended] = useState(0)
  const [loading, setLoading] = useState(true)
  const [displayedPoints, setDisplayedPoints] = useState(0)
  // The count-up waits for the first time this page is on screen, and plays once per load
  const [seen, setSeen] = useState(active)
  if (active && !seen) setSeen(true)

  useEffect(() => {
    if (!user) return
    const signedInUser = user

    async function init() {
      const firstName =
        signedInUser.user_metadata.given_name ??
        signedInUser.user_metadata.full_name?.split(' ')[0] ??
        signedInUser.email

      setFullName(firstName)

      await supabase.from('profiles').upsert({
        id: signedInUser.id,
        email: signedInUser.email,
        full_name: signedInUser.user_metadata.full_name ?? signedInUser.email,
      })

      const [{ data: checkins }, { data: feedback }] = await Promise.all([
        supabase
          .from('checkins')
          .select('points_awarded, bonus_points')
          .eq('user_id', signedInUser.id),
        supabase.from('feedback').select('points_awarded').eq('user_id', signedInUser.id),
      ])

      // Attendance points, streak bonuses, and points for sending event feedback
      const total =
        (checkins?.reduce((sum, row) => sum + row.points_awarded + row.bonus_points, 0) ?? 0) +
        (feedback?.reduce((sum, row) => sum + row.points_awarded, 0) ?? 0)
      setTotalPoints(total)
      setEventsAttended(checkins?.length ?? 0)
      setLoading(false)
    }

    init()
  }, [user])

  // Same ease-out count-up as ThanksForAttending
  useEffect(() => {
    if (totalPoints === null || !seen) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduceMotion ? 0 : 1200
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = duration ? Math.min((now - start) / duration, 1) : 1
      setDisplayedPoints(Math.round((1 - (1 - t) ** 3) * totalPoints))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [totalPoints, seen])

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-xs">Loading...</p>
      </div>
    )
  }

  // Spacing is from the 852px Figma frame. Shorter screens give up the space above the
  // greeting first, keeping enough for the cursor that sits over it.
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[390px] flex-col items-center pt-[clamp(48px,calc(100dvh-661px),191px)] pb-[80px] font-nb">
      <section className="mb-10 w-[266px] flex-1">
        <div className="flex flex-col gap-[49px] text-center">
          <div className="relative">
            {/* Top-right cursor, above the greeting */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cursor.svg"
              alt=""
              aria-hidden="true"
              width={36.565}
              height={36.3996}
              className="pointer-events-none absolute -top-[44px] left-[229px]"
            />
            <h1 className="font-plak text-[32px] font-bold leading-[1.2]">
              Hello {fullName}!
            </h1>
          </div>

          <div className="flex flex-col gap-[72px]">
            <div className="flex flex-col">
              <p className="text-[16px] leading-none">You have:</p>
              <div className="flex flex-col gap-[9px]">
                <p className="font-plak text-[65px] font-bold leading-[1.2]">{displayedPoints}</p>
                <p className="text-[16px] leading-none">points total</p>
              </div>
            </div>

            <div className="relative flex flex-col">
              {/* Left cursor, in the 72px gap above this block. Figma's rotated variant is this one mirrored. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cursor.svg"
                alt=""
                aria-hidden="true"
                width={36.565}
                height={36.3996}
                className="pointer-events-none absolute -left-[13px] -top-[50px] -scale-x-100"
              />
              <p className="text-[16px] leading-none">You&apos;ve attended:</p>
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
  )
}
