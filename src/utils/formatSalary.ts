// Shared by every roll-result card (RollResultCard/MythicRevealCard/
// CelestialRevealCard) - "pick a range for the salary theres too much
// text" per request: several careers' raw career.salary strings carry
// parenthetical asides and/or multiple alternate ranges (e.g. "£35,000 -
// £55,000 (military) / £50,000 - £70,000 (civilian police)") that read
// fine as reference data but crowd the card. This keeps ONLY the FIRST
// "£X - £Y" range in the string (deliberately not scanning the whole
// string for a combined min/max - a stray figure buried in a
// parenthetical aside, like "top jockeys earn £1M+", would otherwise get
// pulled in as if it were the headline range) and reformats it into the
// short £Nk/£N.NM notation most of this file's careers already use, so
// the fix is a no-op for any salary that's already in that shorter form.
function parseAmount(raw: string): number {
  const match = raw.replace(/[£,]/g, '').match(/([\d.]+)\s*([kKmM]?)/)
  if (!match) return NaN
  const value = parseFloat(match[1])
  const suffix = match[2].toLowerCase()
  if (suffix === 'k') return value * 1_000
  if (suffix === 'm') return value * 1_000_000
  return value
}

function formatAmount(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    return `£${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`
  }
  if (value >= 1_000) return `£${Math.round(value / 1_000)}k`
  return `£${Math.round(value)}`
}

export function formatSalaryRange(salary: string): string {
  const match = salary.match(/£\s*[\d,.]+\s*[kKmM]?\+?\s*[-–]\s*£\s*[\d,.]+\s*[kKmM]?\+?/)
  if (!match) return salary
  const [lowRaw, highRaw] = match[0].split(/[-–]/)
  if (!lowRaw || !highRaw) return salary
  const low = parseAmount(lowRaw)
  const high = parseAmount(highRaw)
  if (Number.isNaN(low) || Number.isNaN(high)) return salary
  const hasPlus = highRaw.includes('+')
  return `${formatAmount(low)} - ${formatAmount(high)}${hasPlus ? '+' : ''}`
}
