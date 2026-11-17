'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { isLocalSupabaseDev } from '../attendance/e/[slug]/DevPasswordLogin'
import Header from '../Header'
import { PORTAL_PAGES } from './portalPages'

// A page counts as settled once it fills the track. Not quite 1, so fractional widths still reach it.
const SETTLED_RATIO = 0.99

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // The page the track is on or heading to. Tells a swipe's URL change apart from a link's or Back's.
  const trackHref = useRef(pathname)

  function scrollTrackTo(href: string, behavior: ScrollBehavior) {
    const track = trackRef.current
    if (!track) return
    const index = PORTAL_PAGES.findIndex((page) => page.href === href)
    track.scrollTo({ left: index * track.clientWidth, behavior })
  }

  // Scroll position can't be server-rendered, so the track starts hidden and is revealed once in place.
  useLayoutEffect(() => {
    scrollTrackTo(trackHref.current, 'instant')
    if (trackRef.current) trackRef.current.style.visibility = ''
  }, [])

  // Swipe -> URL. Runs only when a page settles, so dragging never re-renders React.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const sections = Array.from(track.children)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < SETTLED_RATIO) continue
          const { href } = PORTAL_PAGES[sections.indexOf(entry.target)]
          if (href === trackHref.current) continue
          trackHref.current = href
          window.history.pushState(null, '', href)
        }
      },
      { root: track, threshold: SETTLED_RATIO },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // URL -> track, for links and Back/Forward
  useEffect(() => {
    if (pathname === trackHref.current) return
    trackHref.current = pathname
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scrollTrackTo(pathname, reduceMotion ? 'instant' : 'smooth')
  }, [pathname])

  // One auth check for both pages, so they can't both redirect or sign out
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

      setUser(user)
    }

    init()
  }, [])

  return (
    <main className="flex h-dvh flex-col bg-black text-white">
      <Header />
      <div
        ref={trackRef}
        data-menu-dims
        style={{ visibility: 'hidden' }}
        className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PORTAL_PAGES.map(({ href, label, component: Panel }) => (
          <section
            key={href}
            aria-label={label}
            inert={href !== pathname}
            className="h-full w-full shrink-0 snap-start snap-always overflow-y-auto"
          >
            <Panel user={user} active={href === pathname} />
          </section>
        ))}
      </div>
      {children}
    </main>
  )
}
