'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setCheckingAuth(false)
    })
  }, [])

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

    setStatus('done')
  }

  if (checkingAuth) return <p>Loading...</p>

  if (status === 'done') return <p>Checked in! Points added.</p>

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