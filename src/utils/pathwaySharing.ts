// Encodes pathway state directly into the URL itself (URL-safe base64 of a
// small JSON payload) rather than a short ID that points at a database row.
// There is no backend, so this is what makes "share this link" actually work
// across devices/browsers - the link carries its own data, nothing to look up.

export interface SharedPathwayData {
  selectedRole: string | null
  selectedLevel: string | null
  selectedSubjects: string[]
  highlightedCareerId: number | null
}

export function encodePathway(data: SharedPathwayData): string {
  const json = JSON.stringify(data)
  const base64 = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16))))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodePathway(encoded: string): SharedPathwayData | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const binary = atob(padded)
    const percentEncoded = binary
      .split('')
      .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
    const json = decodeURIComponent(percentEncoded)
    const data = JSON.parse(json) as SharedPathwayData
    if (!Array.isArray(data.selectedSubjects)) return null
    return data
  } catch {
    return null
  }
}
