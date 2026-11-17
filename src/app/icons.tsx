// Small icons inlined as SVG: no extra requests, and they follow the text colour.
// Path data is copied from the Figma exports.

type IconProps = { className?: string }

// Points left
export function BackIcon({ className }: IconProps) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <path d="M11.5 10L7 4L2.5 10" stroke="currentColor" transform="rotate(-90 7 7)" />
    </svg>
  )
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg width={11.618} height={9.60559} viewBox="0 0 11.618 9.60559" fill="none" aria-hidden className={className}>
      <path d="M0.542116 4.48053L4.36622 8.48053L11.0421 0.48053" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  )
}

// Points left; rotate at the call site
export function ChevronIcon({ className }: IconProps) {
  return (
    <svg width={7.07781} height={11.7372} viewBox="0 0 7.07781 11.7372" fill="none" aria-hidden className={className}>
      <path d="M6.73995 0.368577L0.739946 5.86858L6.73995 11.3686" stroke="currentColor" />
    </svg>
  )
}
