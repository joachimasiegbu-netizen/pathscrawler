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
    <div className={`fixed bottom-6 left-1/2 z-50 w-[min(92vw,380px)] -translate-x-1/2 rounded-3xl border px-5 py-4 text-sm shadow-2xl ${typeStyles[type]}`}>
      {message}
    </div>
  )
}
