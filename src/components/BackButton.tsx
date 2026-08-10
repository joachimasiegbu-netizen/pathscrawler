import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  to?: string
  state?: any
  label?: string
}

export default function BackButton({ to, state, label = 'Back' }: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => {
        if (to) {
          navigate(to, { state })
        } else {
          navigate(-1)
        }
      }}
      className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-dark"
    >
      <ArrowLeft className="h-5 w-5" />
      {label}
    </button>
  )
}
