import { useState } from 'react'
import { Check, Copy, Linkedin, MessageCircle, Share2, Twitter } from 'lucide-react'

// Every "share" here just opens a standard intent URL the user completes
// themselves (or copies text to their own clipboard) - no data is sent
// anywhere automatically, no API keys involved. Used by ResultPage's
// ShareResultsPanel.

interface ShareButtonsProps {
  shareText: string
  shareUrl: string
}

export default function ShareButtons({ shareText, shareUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const canWebShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  const fullText = `${shareText} ${shareUrl}`

  const handleWebShare = async () => {
    try {
      await navigator.share({ title: 'PathScrawler', text: shareText, url: shareUrl })
    } catch {
      // user cancelled the native share sheet, or it's unsupported - nothing to do
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable - the buttons below still work
    }
  }

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(fullText)}`
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`

  const linkClass =
    'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700'

  return (
    <div className="flex flex-wrap gap-2">
      {canWebShare ? (
        <button type="button" onClick={handleWebShare} className={linkClass}>
          <Share2 className="h-4 w-4" />
          Share
        </button>
      ) : null}
      <button type="button" onClick={handleCopy} className={linkClass}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copied!' : 'Copy text'}
      </button>
      <a href={twitterHref} target="_blank" rel="noreferrer" className={linkClass}>
        <Twitter className="h-4 w-4" />
        X
      </a>
      <a href={whatsappHref} target="_blank" rel="noreferrer" className={linkClass}>
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>
      <a href={linkedinHref} target="_blank" rel="noreferrer" className={linkClass}>
        <Linkedin className="h-4 w-4" />
        LinkedIn
      </a>
    </div>
  )
}
