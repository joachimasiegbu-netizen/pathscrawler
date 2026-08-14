interface ToastProps {
  message: string
  type?: 'success' | 'info' | 'error'
}

const typeStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  info: 'border-slate-200 bg-slate-50 text-slate-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
}

export default function Toast({ message, type = 'info' }: ToastProps) {
  return (
    // pointer-events-none: purely informational, nothing to click inside
    // it - without this, its fixed bottom-center position can sit on top
    // of real controls underneath (confirmed: it was intercepting clicks
    // meant for the Roll a Job result card's action buttons, and since it
    // has no click handler of its own, that click would bubble straight
    // through to whatever's behind it, e.g. that page's dismiss-on-
    // outside-click - the toast celebrating "Added to binder!" was
    // silently closing the card it just reported on).
    <div
      className={`pointer-events-none fixed bottom-6 left-1/2 z-50 w-[min(92vw,380px)] -translate-x-1/2 rounded-3xl border px-5 py-4 text-sm shadow-2xl ${typeStyles[type]}`}
    >
      {message}
    </div>
  )
}
