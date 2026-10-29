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

// The Figma face, drawn in a 40x40 circle. Geometry is Figma's own SVG export of the
// smiley group, since its layers use mirror transforms that rotate+flip CSS gets wrong.
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
      <g fill="black" stroke="black" strokeWidth={0.568632}>
        <ellipse cx={0.743546} cy={1.30764} rx={0.743546} ry={1.30764} transform="matrix(-0.885808 -0.464053 -0.464043 0.885812 19.4746 9.27344)" />
        <ellipse cx={0.743546} cy={1.30764} rx={0.743546} ry={1.30764} transform="matrix(-0.885808 -0.464053 -0.464043 0.885812 12.458 6.30469)" />
      </g>
      <g fill="black">
        <path d="M14.92 13.9073C15.0623 13.841 15.2315 13.9027 15.2978 14.045C15.3641 14.1873 15.3024 14.3565 15.1601 14.4228L15.04 14.165L14.92 13.9073ZM10.3135 12.1627C10.263 12.014 10.3425 11.8525 10.4912 11.802C10.6399 11.7515 10.8014 11.831 10.8519 11.9797L10.5827 12.0712L10.3135 12.1627ZM15.04 14.165L15.1601 14.4228C13.312 15.2835 10.9959 14.1701 10.3135 12.1627L10.5827 12.0712L10.8519 11.9797C11.4386 13.7056 13.4147 14.6085 14.92 13.9073L15.04 14.165Z" />
        <path d="M16.1023 14.9236C16.2487 14.9804 16.3214 15.145 16.2647 15.2915C16.208 15.4379 16.0433 15.5106 15.8969 15.4539L15.9996 15.1888L16.1023 14.9236ZM15.2942 12.9717C15.3931 12.8497 15.5721 12.831 15.6941 12.9299C15.816 13.0288 15.8348 13.2078 15.7359 13.3298L15.515 13.1508L15.2942 12.9717ZM15.9996 15.1888L15.8969 15.4539C15.5888 15.3346 15.1668 15.0689 14.9562 14.6384C14.8476 14.4165 14.7985 14.156 14.8492 13.866C14.8992 13.5793 15.0437 13.2807 15.2942 12.9717L15.515 13.1508L15.7359 13.3298C15.5297 13.5841 15.4387 13.7956 15.4093 13.9638C15.3805 14.1287 15.408 14.268 15.467 14.3885C15.5914 14.6429 15.8684 14.833 16.1023 14.9236L15.9996 15.1888Z" />
        <path d="M9.34263 11.7917C9.2055 11.7152 9.03232 11.7644 8.95584 11.9015C8.87935 12.0387 8.92852 12.2118 9.06565 12.2883L9.20414 12.04L9.34263 11.7917ZM11.3609 11.1675C11.3917 11.0135 11.2917 10.8637 11.1378 10.833C10.9838 10.8023 10.834 10.9022 10.8033 11.0561L11.0821 11.1118L11.3609 11.1675ZM9.20414 12.04L9.06565 12.2883C9.35422 12.4493 9.8281 12.6045 10.2939 12.4917C10.534 12.4336 10.7659 12.3051 10.9567 12.081C11.1454 11.8594 11.283 11.5575 11.3609 11.1675L11.0821 11.1118L10.8033 11.0561C10.7392 11.3771 10.6345 11.5823 10.5238 11.7123C10.4153 11.8397 10.2906 11.9075 10.1601 11.9391C9.88486 12.0057 9.56173 11.9139 9.34263 11.7917L9.20414 12.04Z" />
      </g>
    </svg>
  )
}
