'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { isLocalSupabaseDev } from '../../../attendance/e/[slug]/DevPasswordLogin'
import RatingInput from './RatingInput'

type FeedbackEvent = {
  id: string
  slug: string
  name: string
  thumbnail_url: string | null
  description: string | null
  category: string | null
}

const MAX_LENGTH = 2000

export default function FeedbackForm({ event }: { event: FeedbackEvent }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  // Points from the check-in, shown in the header
  const [earned, setEarned] = useState<number | null>(null)

  const [rating, setRating] = useState(0)
  const [liked, setLiked] = useState('')
  const [improve, setImprove] = useState('')
  const [wouldReturn, setWouldReturn] = useState<boolean | null>(null)
  const [suggestions, setSuggestions] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

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

      const [{ data: checkin }, { data: feedback }] = await Promise.all([
        supabase
          .from('checkins')
          .select('points_awarded, bonus_points')
          .eq('user_id', user.id)
          .eq('event_id', event.id)
          .maybeSingle(),
        supabase
          .from('feedback')
          .select('id')
          .eq('user_id', user.id)
          .eq('event_id', event.id)
          .maybeSingle(),
      ])

      // Only attendees can leave feedback, and only once
      if (!checkin || feedback) {
        router.replace('/events')
        return
      }

      setUser(user)
      setEarned(checkin.points_awarded + checkin.bonus_points)
    }

    init()
  }, [event.id, router])

  const complete = rating > 0 && liked.trim() !== '' && improve.trim() !== '' && wouldReturn !== null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !complete || status === 'loading') return
    setStatus('loading')

    const { error } = await supabase.from('feedback').insert({
      user_id: user.id,
      event_id: event.id,
      rating,
      liked: liked.trim(),
      improve: improve.trim(),
      would_return: wouldReturn,
      suggestions: suggestions.trim() || null,
    })

    if (!error) {
      router.push(`/events?sent=${encodeURIComponent(event.slug)}`)
    } else if (error.code === '23505') {
      // Already submitted, e.g. from another tab
      router.replace('/events')
    } else {
      setStatus('error')
    }
  }

  if (earned === null) {
    return <p className="py-16 text-center text-xs">Loading...</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail_url || '/GraphicHolder.png'}
          alt={event.name}
          className="block h-[163px] w-[131px] shrink-0 border border-white object-cover"
        />
        <div className="flex min-h-[164px] min-w-0 flex-1 flex-col justify-center gap-[3px]">
          <div className="flex flex-col items-start">
            {event.category && (
              <span className="flex h-[14px] items-center border-[0.882px] border-white px-2 text-[8.815px] leading-[12.342px]">
                {event.category}
              </span>
            )}
            <h1 className="font-plak text-[20px] font-bold">{event.name}</h1>
          </div>
          <p className="min-h-[28px] text-[12px] leading-[14px]">You earned {earned}pts for attending.</p>
          {event.description && <p className="text-[12px] leading-[12px]">{event.description}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <fieldset>
          <legend className="text-[18px]">On a scale of 1 to 5, how was it?</legend>
          <RatingInput value={rating} onChange={setRating} />
        </fieldset>

        <TextQuestion id="liked" label="What did you like?" value={liked} onChange={setLiked} height="h-[170px]" required />
        <TextQuestion id="improve" label="What could be better?" value={improve} onChange={setImprove} height="h-[170px]" required />

        <fieldset>
          <legend className="mb-[10px] text-[18px]">Would you come to similar events?</legend>
          <div className="flex gap-8">
            {[true, false].map((option) => (
              <button
                key={String(option)}
                type="button"
                aria-pressed={wouldReturn === option}
                onClick={() => setWouldReturn(option)}
                // A 70% fill reads as "pressed" against the plain white option
                className={`flex-1 cursor-pointer py-4 text-[12px] leading-[14px] text-black ${wouldReturn === option ? 'bg-white/70' : 'bg-white hover:bg-neutral-200'}`}
              >
                {option ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </fieldset>

        <TextQuestion
          id="suggestions"
          label="Any suggestions for future events?"
          value={suggestions}
          onChange={setSuggestions}
          height="h-[85px]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={!complete || status === 'loading'}
          className="cursor-pointer bg-white py-4 text-[13px] text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-white/50"
        >
          {status === 'loading' ? 'Sending...' : 'Submit Feedback'}
        </button>
        {status === 'error' && (
          <p role="alert" className="text-center text-[12px] text-white/70">
            Couldn&apos;t send your feedback. Please try again.
          </p>
        )}
      </div>
    </form>
  )
}

function TextQuestion({
  id,
  label,
  value,
  onChange,
  height,
  required = false,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  height: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-[10px]">
      <label htmlFor={id} className="text-[18px]">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={MAX_LENGTH}
        placeholder="Type here..."
        className={`${height} w-full resize-none border border-white bg-transparent p-[10px] text-[14px] leading-[14px] placeholder:text-white/70 focus:outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white`}
      />
    </div>
  )
}
