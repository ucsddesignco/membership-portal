import type { ComponentType } from 'react'
import type { User } from '@supabase/supabase-js'
import DashboardPanel from '../attendance/dashboard/DashboardPanel'
import EventList from '../events/EventList'

export type PortalPanelProps = {
  // Null until the shell's auth check finishes
  user: User | null
  // True once this page is the one on screen
  active: boolean
}

// Drives the swipe sections and the menu links, so their order always matches.
export const PORTAL_PAGES: {
  href: string
  label: string
  component: ComponentType<PortalPanelProps>
}[] = [
  { href: '/attendance/dashboard', label: 'Dashboard', component: DashboardPanel },
  { href: '/events', label: 'Events', component: EventList },
]
