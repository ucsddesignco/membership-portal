'use client'

import { useRef, type KeyboardEvent } from 'react'

const SCORES = [1, 2, 3, 4, 5]

// Picking N fills circles 1..N with a smiley, matching the Figma "5 Smiley Rating" variants
export default function RatingInput({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  // Radio-group keyboard behaviour: arrows move and select
  function handleKeyDown(e: KeyboardEvent) {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = Math.min(5, Math.max(1, (value || 0) + step))
    onChange(next)
    buttons.current[next - 1]?.focus()
  }

  return (
    <div role="radiogroup" onKeyDown={handleKeyDown} className="flex h-[74px] items-center justify-between py-4">
      {SCORES.map((score) => (
        <button
          key={score}
          ref={(el) => {
            buttons.current[score - 1] = el
          }}
          type="button"
          role="radio"
          aria-checked={value === score}
          aria-label={`${score} out of 5`}
          // Only one circle is in the tab order: the selected one, or the first
          tabIndex={value === score || (value === 0 && score === 1) ? 0 : -1}
          onClick={() => onChange(score)}
          className="block size-10 shrink-0 cursor-pointer rounded-full focus:outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <SmileyCircle filled={score <= value} />
        </button>
      ))}
    </div>
  )
}

// The Figma face, drawn in a 40x40 circle. The eye and smile transforms reproduce the
// Figma layer rotations and flips, with the path data copied from its exports.
function SmileyCircle({ filled }: { filled: boolean }) {
  if (!filled) {
    return (
      <svg width={40} height={40} viewBox="0 0 40 40" aria-hidden className="block">
        <circle cx={20} cy={20} r={19.5} fill="black" stroke="white" />
      </svg>
    )
  }

  return (
    <svg width={40} height={40} viewBox="0 0 40 40" aria-hidden className="block">
      <circle cx={20} cy={20} r={20} fill="white" />
      <g transform="translate(12.7735 8.5425) rotate(-152.35) scale(1 -1) translate(-4.824 -1.905)" fill="black" stroke="black" strokeWidth={0.568632}>
        <ellipse cx={1.02786} cy={1.59196} rx={0.743546} ry={1.30764} />
        <ellipse cx={8.62074} cy={2.21842} rx={0.743546} ry={1.30764} />
      </g>
      <g transform="translate(12.4535 13.33) rotate(-154.84) scale(1 -1) translate(-4.12 -1.376)">
        <path d="M1.67876 1.40402C2.86432 2.82376 5.23544 2.82376 6.60339 1.40402" stroke="black" strokeWidth={0.568632} strokeLinecap="round" fill="none" />
        <path d="M0.394945 1.63935C0.238303 1.62843 0.102464 1.74656 0.0915421 1.90321C0.0806198 2.05985 0.198749 2.19569 0.355392 2.20661L0.375168 1.92298L0.394945 1.63935ZM1.95631 0.216224C1.91867 0.063779 1.76457 -0.0292861 1.61213 0.00835751C1.45968 0.0460011 1.36662 0.200099 1.40426 0.352544L1.68028 0.284384L1.95631 0.216224ZM0.375168 1.92298L0.355392 2.20661C0.685011 2.22959 1.17991 2.16857 1.55357 1.86849C1.74618 1.71381 1.9014 1.4989 1.97886 1.21487C2.05544 0.934084 2.05166 0.602394 1.95631 0.216224L1.68028 0.284384L1.40426 0.352544C1.48272 0.670326 1.4752 0.900491 1.43027 1.06525C1.38622 1.22676 1.30217 1.34109 1.19752 1.42513C0.976692 1.60247 0.645213 1.6568 0.394945 1.63935L0.375168 1.92298Z" fill="black" />
        <path d="M7.8449 1.67888C8.00154 1.66796 8.13738 1.78609 8.1483 1.94274C8.15923 2.09938 8.0411 2.23522 7.88446 2.24614L7.86468 1.96251L7.8449 1.67888ZM6.28354 0.255756C6.32118 0.103311 6.47528 0.0102458 6.62772 0.0478894C6.78017 0.0855329 6.87323 0.23963 6.83559 0.392075L6.55957 0.323916L6.28354 0.255756ZM7.86468 1.96251L7.88446 2.24614C7.55484 2.26912 7.05994 2.2081 6.68628 1.90802C6.49367 1.75334 6.33845 1.53844 6.26099 1.2544C6.18441 0.973616 6.18819 0.641926 6.28354 0.255756L6.55957 0.323916L6.83559 0.392075C6.75712 0.709858 6.76464 0.940023 6.80958 1.10479C6.85363 1.26629 6.93768 1.38062 7.04232 1.46466C7.26316 1.642 7.59463 1.69633 7.8449 1.67888L7.86468 1.96251Z" fill="black" />
      </g>
    </svg>
  )
}
