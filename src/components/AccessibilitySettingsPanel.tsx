import { useMemo } from 'react'
import { Moon, Sun } from 'lucide-react'
import { usePathStore } from '../store/usePathStore'

const options = [
  { key: 'reduceMotion', label: 'Reduce motion' },
  { key: 'highContrast', label: 'High contrast mode' },
  { key: 'largerText', label: 'Larger text' },
  { key: 'dyslexiaFont', label: 'Dyslexia-friendly font' },
  { key: 'darkMode', label: 'Dark mode' },
] as const

type OptionKey = (typeof options)[number]['key']

export default function AccessibilitySettingsPanel() {
  const { accessibilitySettings, setAccessibilitySettings } = usePathStore()

  const toggles = useMemo(
    () =>
      options.map((option) => ({
        ...option,
        value: accessibilitySettings[option.key as OptionKey],
      })),
    [accessibilitySettings],
  )

  const updateSetting = (key: OptionKey) => {
    setAccessibilitySettings({
      ...accessibilitySettings,
      [key]: !accessibilitySettings[key],
    })
  }

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-800">
      <div>
        <div className="text-lg font-semibold text-slate-950 dark:text-slate-50">Adjust my experience</div>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Choose settings that make this tool easier to use for you.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {toggles.map(({ key, label, value }) => (
          // <label> wrapping the checkbox, not the old <button aria-pressed>
          // imitating one - this is the actual native toggle pattern the
          // .cl-switch CSS below expects (clicking anywhere in the label,
          // including the tile's own text/icon, forwards to the checkbox
          // for free), and it's more accessible than faking switch
          // semantics on a button ever was.
          <label
            key={key}
            className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
              value
                ? 'border-accent bg-accent/5 text-primary-dark ring-2 ring-accent dark:bg-accent/10 dark:text-primary-light'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-500'
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              {key === 'darkMode' ? (
                value ? <Moon className="h-4 w-4 shrink-0" /> : <Sun className="h-4 w-4 shrink-0" />
              ) : null}
              {label}
            </span>
            <span className="cl-switch">
              <input type="checkbox" checked={value} onChange={() => updateSetting(key)} aria-label={label} />
              <span />
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
