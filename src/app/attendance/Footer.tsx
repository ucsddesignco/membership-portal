// Shared bottom-of-page note. Pages control spacing above it; styling lives only here.
export default function Footer({ children }: { children: React.ReactNode }) {
  return (
    <p className="w-full px-22 text-center text-xs leading-relaxed text-neutral-400">
      {children}
    </p>
  )
}
