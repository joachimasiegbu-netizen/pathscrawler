import { useMemo } from 'react'
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
          <button
            key={key}
            type="button"
            onClick={() => updateSetting(key)}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
              value
                ? 'border-primary bg-primary/10 text-primary-dark dark:border-primary/80 dark:bg-primary/10 dark:text-primary-light'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-500'
            }`}
          >
            <span className="text-sm font-semibold">{label}</span>
            <span className="text-sm font-medium">{value ? 'On' : 'Off'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
