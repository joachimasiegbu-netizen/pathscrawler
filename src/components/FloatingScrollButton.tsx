import { ArrowDown } from 'lucide-react'

export default function FloatingScrollButton() {
  const handleClick = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      aria-label="Scroll to bottom"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg"
    >
      <ArrowDown className="h-6 w-6" />
    </button>
  )
}
