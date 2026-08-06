import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'

const SHOW_AFTER_PX = 300

// Floating "back to top" button - hidden near the top of the page, fades in
// once the user has scrolled past SHOW_AFTER_PX. Stays mounted the whole
// time (just toggling opacity/pointer-events) rather than being added and
// removed from the DOM, so the appearance/disappearance is an actual fade
// rather than a hard cut.
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)
  const tickingRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      // rAF-throttled: a fast-scrolling user fires many scroll events per
      // frame, but only one visibility check per frame is ever useful.
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > SHOW_AFTER_PX)
        tickingRef.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-xl ring-1 ring-slate-200/60 transition-opacity duration-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
