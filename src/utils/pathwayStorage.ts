// Pure localStorage pathway storage - no backend, no lookup server.
// IMPORTANT TRADE-OFF: a /pathway/:id link only resolves in the browser that
// created it, since the data lives in that browser's localStorage and
// nowhere else. Copying the link to another device or browser will not
// restore anything - there's nothing for it to look up. This is the explicit
// design requested (vs. the earlier URL-encoded approach, which carried the
// data in the link itself and worked anywhere).

export interface SavedPathway {
  id: string
  role: string | null
  subjects: string[]
  level: string | null
  careers: number[]
  highlightedCareerId: number | null
  date: string
}

const STORAGE_KEY = 'pathscrawler-saved-pathways'

function readAll(): SavedPathway[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedPathway[]) : []
  } catch {
    return []
  }
}

function writeAll(pathways: SavedPathway[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pathways))
}

function generatePathwayId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 9)
  return `pathway_${timestamp}_${random}`
}

export function savePathway(data: {
  role: string | null
  subjects: string[]
  level: string | null
  careers: number[]
  highlightedCareerId: number | null
}): SavedPathway {
  const pathway: SavedPathway = {
    id: generatePathwayId(),
    date: new Date().toISOString().slice(0, 10),
    ...data,
  }
  const pathways = readAll()
  pathways.unshift(pathway)
  writeAll(pathways)
  return pathway
}

export function getSavedPathways(): SavedPathway[] {
  return readAll()
}

export function getPathwayById(id: string): SavedPathway | null {
  return readAll().find((pathway) => pathway.id === id) ?? null
}

export function deletePathway(id: string): void {
  writeAll(readAll().filter((pathway) => pathway.id !== id))
}
