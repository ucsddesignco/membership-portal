'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PORTAL_PAGES } from './(portal)/portalPages'

const PANEL_ID = 'site-menu'
const HOME_HREF = PORTAL_PAGES[0].href
// How far a horizontal drag travels before it closes the panel
const SWIPE_CLOSE_PX = 30

// Shared top bar with the side panel. Content dims through the data-menu-dims rule in globals.css.
export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [panelTop, setPanelTop] = useState(0)
  const headerRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const dragStartX = useRef<number | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    buttonRef.current?.focus({ preventScroll: true })
  }, [])

  function toggle() {
    if (open) {
      close()
      return
    }
    // Measured because the feedback page's header scrolls with the page
    setPanelTop(Math.max(0, headerRef.current?.getBoundingClientRect().bottom ?? 0))
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    root.setAttribute('data-menu-open', '')
    const links = () => Array.from(panelRef.current?.querySelectorAll('a') ?? [])
    links()[0]?.focus({ preventScroll: true })

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close()
      } else if (e.key === 'Tab') {
        // Keep Tab inside the panel
        const all = links()
        const index = all.indexOf(document.activeElement as HTMLAnchorElement)
        const next = e.shiftKey ? (index <= 0 ? all.length - 1 : index - 1) : (index + 1) % all.length
        e.preventDefault()
        all[next]?.focus({ preventScroll: true })
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      root.removeAttribute('data-menu-open')
    }
  }, [open, close])

  // A horizontal swipe closes the panel, by finger or trackpad
  const swipeToClose = {
    onPointerDown: (e: React.PointerEvent) => {
      dragStartX.current = e.clientX
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (dragStartX.current === null) return
      if (Math.abs(e.clientX - dragStartX.current) > SWIPE_CLOSE_PX) {
        dragStartX.current = null
        close()
      }
    },
    onPointerUp: () => {
      dragStartX.current = null
    },
    onWheel: (e: React.WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) close()
    },
  }

  return (
    <header
      ref={headerRef}
      onClick={(e) => {
        if (open && e.target === e.currentTarget) close()
      }}
      className="relative z-50 flex h-[57px] w-full shrink-0 items-center justify-between border-b border-white px-[30px]"
    >
      <Link href={HOME_HREF} scroll={false} onClick={() => open && close()} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/designco-logo.svg" alt="Design Co" width={119.632} height={13.0651} className="block" />
      </Link>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={toggle}
        className="cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/menu-icon.svg" alt="" width={25} height={16} className="block" />
      </button>

      {/* Catches taps outside the panel, so they can't also press what's behind it */}
      {open && (
        <div
          aria-hidden
          onClick={close}
          {...swipeToClose}
          style={{ top: panelTop }}
          className="fixed inset-x-0 bottom-0 touch-none overscroll-contain"
        />
      )}

      {/* Clips the panel while it's off to the right, so it can't widen the page */}
      <div
        style={{ top: panelTop }}
        className={`fixed right-0 bottom-0 w-[213px] overflow-hidden ${open ? '' : 'pointer-events-none'}`}
      >
        <nav
          ref={panelRef}
          id={PANEL_ID}
          aria-label="Main"
          inert={!open}
          {...swipeToClose}
          className={`flex h-full touch-none flex-col items-start gap-5 border-l border-white bg-black px-[30px] pt-[30px] font-plak text-[24px] leading-[35px] font-bold text-white transition-transform duration-200 ease-out motion-reduce:transition-none ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {PORTAL_PAGES.map(({ href, label }) => {
            // The feedback page sits under /events, so Events shows as current there
            const current = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                scroll={false}
                aria-current={current ? 'page' : undefined}
                onClick={(e) => {
                  if (current) e.preventDefault()
                  close()
                }}
                className={current ? 'text-white' : 'text-white/70'}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
