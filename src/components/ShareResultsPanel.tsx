import { useMemo } from 'react'
import { Download } from 'lucide-react'
import { generateShareImageDataUrl } from '../utils/shareImage'
import ShareButtons from './ShareButtons'

interface ShareResultsPanelProps {
  careerTitle: string | null
}

export default function ShareResultsPanel({ careerTitle }: ShareResultsPanelProps) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const shareText = careerTitle ? `I'm exploring ${careerTitle} via PathScrawler` : 'Find your future career pathway via PathScrawler'

  const imageDataUrl = useMemo(
    () =>
      generateShareImageDataUrl({
        title: careerTitle || 'Explore your future career',
        subtitle: 'Explore your future with clarity.',
        footerUrl: `Find your pathway at ${origin.replace(/^https?:\/\//, '')}`,
      }),
    [careerTitle, origin],
  )

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageDataUrl
    link.download = 'pathscrawler-share.png'
    link.click()
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-soft dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-xl font-bold text-slate-950 dark:text-slate-50">Share my results</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Show friends and family what you're exploring - download a shareable card or post it directly.
      </p>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            alt={`Shareable card: ${shareText}`}
            className="w-full max-w-xs shrink-0 rounded-xl border border-slate-200 shadow-sm dark:border-slate-700"
          />
        ) : null}

        <div className="flex-1 space-y-3">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <Download className="h-4 w-4" />
            Download image
          </button>

          <ShareButtons shareText={shareText} shareUrl={origin} />
        </div>
      </div>
    </div>
  )
}
