// Shared top bar. The menu button is a placeholder until the nav menu is designed.
export default function Header() {
  return (
    <header className="flex h-[57px] w-full shrink-0 items-center justify-between border-b border-white px-[30px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/designco-logo.svg" alt="Design Co" width={119.632} height={13.0651} className="block" />
      <button type="button" aria-label="Menu" className="cursor-pointer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/menu-icon.svg" alt="" width={25} height={16} className="block" />
      </button>
    </header>
  )
}
