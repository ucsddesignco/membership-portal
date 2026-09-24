'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import ThanksForAttending from './ThanksForAttending'

export default function CheckinButton({
  eventId,
  eventSlug,
}: {
  eventId: string
  eventSlug: string
}) {
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [awardedPoints, setAwardedPoints] = useState<number | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)

      // If this user already checked into this event, skip straight to
      // the confirmation screen instead of showing the check-in button
      // again — makes the confirmation persist across reloads/revisits.
      if (data.user) {
        const { data: existingCheckin } = await supabase
          .from('checkins')
          .select('points_awarded')
          .eq('user_id', data.user.id)
          .eq('event_id', eventId)
          .maybeSingle()

        if (existingCheckin) {
          setAwardedPoints(existingCheckin.points_awarded)
          setStatus('done')
        }
      }

      setCheckingAuth(false)
    })
  }, [eventId])

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/attendance/e/${eventSlug}`,
        queryParams: { hd: 'ucsd.edu' },
      },
    })
  }

  async function handleCheckin() {
    setStatus('loading')

    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (!event) {
      setStatus('error')
      setErrorMsg('Event no longer exists.')
      return
    }

    const now = new Date()
    if (event.active_start && now < new Date(event.active_start)) {
      setStatus('error')
      setErrorMsg('This event has not started yet.')
      return
    }
    if (event.active_end && now > new Date(event.active_end)) {
      setStatus('error')
      setErrorMsg('This event has ended.')
      return
    }

    const { error } = await supabase.from('checkins').insert({
      user_id: user.id,
      event_id: eventId,
      points_awarded: event.points,
    })

    if (error) {
      setStatus('error')
      setErrorMsg(
        error.code === '23505'
          ? "You've already checked into this event."
          : error.message
      )
      return
    }

    setAwardedPoints(event.points)
    setStatus('done')
  }

  if (checkingAuth) return <p>Loading...</p>

  if (status === 'done') return <ThanksForAttending points={awardedPoints ?? 0} />

  if (!user) {
    return (
      <div>
        <button onClick={handleGoogleLogin}>
          Sign in with UCSD Account
        </button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={handleCheckin} disabled={status === 'loading'}>
        {status === 'loading' ? 'Checking in...' : 'Check in'}
      </button>
      {status === 'error' && <p>{errorMsg}</p>}
    </div>
  )
}