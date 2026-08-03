import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  to?: string
  state?: any
}

export default function BackButton({ to, state }: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => {
        console.log('[BackButton] navigate to', to, state)
        if (to) {
          navigate(to, { state })
        } else {
          navigate(-1)
        }
      }}
      className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-dark"
    >
      <ArrowLeft className="h-5 w-5" />
      Back
    </button>
  )
}
