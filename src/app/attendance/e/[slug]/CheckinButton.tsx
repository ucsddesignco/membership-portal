'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import ThanksForAttending from './ThanksForAttending'

export default function CheckinButton({
  eventId,
  eventSlug,
  eventName,
}: {
  eventId: string
  eventSlug: string
  eventName: string
}) {
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [awardedPoints, setAwardedPoints] = useState(0)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Check for a real, existing checkin — not just leftover client state
        const { data: existing } = await supabase
          .from('checkins')
          .select('points_awarded')
          .eq('user_id', user.id)
          .eq('event_id', eventId)
          .maybeSingle()

        if (existing) {
          setAwardedPoints(existing.points_awarded)
          setStatus('done')
        }
      }

      setCheckingAuth(false)
    }

    init()
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

  if (checkingAuth) return <p className='flex items-center justify-center'>Loading...</p>

  if (status === 'done') return <ThanksForAttending points={awardedPoints} eventName={eventName}/>

  if (!user) {
    return <button onClick={handleGoogleLogin}>Sign in with UCSD Account</button>
  }

  return (
    <div>
      <button onClick={handleCheckin} disabled={status === 'loading'}>
        {status === 'loading' ? 'Checking in...' : 'Check in'}
      </button>
      {status === 'error' && <p className='flex items-center justify-center pt-2'>{errorMsg}</p>}
    </div>
  )
}