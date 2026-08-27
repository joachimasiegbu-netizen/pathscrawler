import { useState } from 'react'
import { CheckSquare, ClipboardCheck, Copy, ListChecks } from 'lucide-react'

// Tickable checklist with a "Copy" button (plain-text copy - downloads are
// awkward across environments, a paste-anywhere list is more useful). State
// is local and not persisted; it's a working aid, not a saved document.
export default function Checklist({ title, items }: { title: string; items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n\n${items.map((it) => `[ ] ${it}`).join('\n')}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked - no-op */
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <ListChecks className="h-4 w-4 text-indigo-500" />
          {title}
        </h3>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          {copied ? <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-start gap-2.5 text-left text-[15px] leading-7 text-slate-600 dark:text-slate-300"
            >
              <CheckSquare
                className={`mt-0.5 h-4 w-4 shrink-0 transition ${checked.has(i) ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`}
              />
              <span className={checked.has(i) ? 'line-through opacity-60' : ''}>{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
