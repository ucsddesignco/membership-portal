'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { isLocalSupabaseDev } from '../attendance/e/[slug]/DevPasswordLogin'

type EventItem = {
  id: string
  name: string
  thumbnail_url: string | null
  event_date: string // YYYY-MM-DD
  description: string | null
  feedback_url: string | null
  attended: boolean
  upcoming: boolean // not attended, and check-in hasn't closed yet
  earned: number
}

export default function EventList() {
  const [events, setEvents] = useState<EventItem[] | null>(null)
  // Only one row is expanded at a time
  const [openId, setOpenId] = useState<string | null>(null)

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

      // YYYY-MM-DD in San Diego time, comparable with event_date
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })

      const [{ data: eventRows }, { data: checkins }] = await Promise.all([
        supabase
          .from('events')
          .select('id, name, thumbnail_url, event_date, active_end, description, feedback_url')
          .lte('event_date', today)
          .order('event_date', { ascending: false }),
        supabase
          .from('checkins')
          .select('event_id, points_awarded, bonus_points')
          .eq('user_id', user.id),
      ])

      // Same total as the dashboard: base points plus any streak bonus
      const earnedByEvent = new Map(
        checkins?.map((row) => [row.event_id, row.points_awarded + row.bonus_points]),
      )

      const now = Date.now()
      setEvents(
        eventRows?.map(({ active_end, ...event }) => {
          const attended = earnedByEvent.has(event.id)
          return {
            ...event,
            attended,
            upcoming: !attended && !!active_end && new Date(active_end).getTime() > now,
            earned: earnedByEvent.get(event.id) ?? 0,
          }
        }) ?? [],
      )
    }

    init()
  }, [])

  if (!events) {
    return <p className="py-16 text-center text-xs">Loading...</p>
  }

  return (
    <ul className="flex flex-col">
      {events.map((event, i) => (
        <EventRow
          key={event.id}
          event={event}
          first={i === 0}
          open={openId === event.id}
          onToggle={() => setOpenId(openId === event.id ? null : event.id)}
        />
      ))}
    </ul>
  )
}

function EventRow({
  event,
  first,
  open,
  onToggle,
}: {
  event: EventItem
  first: boolean
  open: boolean
  onToggle: () => void
}) {
  const panelId = `event-panel-${event.id}`
  // event_date is date-only, which parses as UTC midnight
  const date = new Date(event.event_date)
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
  const day = date.getUTCDate()
  const text = event.attended ? 'text-white' : 'text-white/70'

  return (
    // Rows overlap by 1px so neighbours share a border; attended rows sit on top so their brighter border wins
    <li
      className={`relative border ${first ? '' : '-mt-px'} ${event.attended ? 'z-10 border-white' : 'border-white/70'}`}
    >
      <div className="flex h-[60px] items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-5 text-left"
        >
          <span className="flex w-7 shrink-0 flex-col items-center gap-[2px] text-center leading-[14px]">
            <span className="text-[12px] text-white/70">{month}</span>
            <span className={`text-[18px] ${text}`}>{day}</span>
          </span>

          <span className="flex min-w-0 flex-col gap-[2px]">
            <span className="flex items-center gap-2">
              <span className={`truncate text-[18px] leading-[18px] ${text}`}>{event.name}</span>
              {/* The asset points left; rotate to point down when closed, up when open */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/chevron.svg"
                alt=""
                width={7.07781}
                height={11.7372}
                className={`block shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-90' : '-rotate-90'} ${event.attended ? '' : 'opacity-70'}`}
              />
            </span>
            <span className="text-[10px] leading-[10px] text-white/70">
              {event.attended ? `+${event.earned} pts` : event.upcoming ? 'Upcoming' : 'Missed'}
            </span>
          </span>
        </button>

        {event.attended && event.feedback_url && (
          <a
            href={event.feedback_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[30px] shrink-0 items-center justify-center bg-white px-3 text-[13px] leading-none text-black hover:bg-neutral-200"
          >
            Feedback
          </a>
        )}
      </div>

      {/* Animating grid rows 0fr -> 1fr lets the panel expand to its natural height */}
      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="flex items-start gap-4 px-4 pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.thumbnail_url || '/GraphicHolder.png'}
              alt={event.name}
              className="block h-[163px] w-[131px] shrink-0 border border-white object-cover"
            />
            {event.description && (
              <p className={`min-w-0 flex-1 text-[12px] leading-normal ${text}`}>{event.description}</p>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}
