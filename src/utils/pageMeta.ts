import { useEffect } from 'react'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME, SITE_URL } from '../data/seo'

export interface PageMeta {
  title?: string
  description?: string
  noindex?: boolean
}

// Finds the <meta>/<link> in <head> matching `selector`, creating it from
// `attrs` first if it isn't there yet.
function headTag(tag: 'meta' | 'link', selector: string, attrs: Record<string, string>): HTMLElement {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = document.createElement(tag)
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value)
    document.head.appendChild(el)
  }
  return el
}

export function applyPageMeta({ title, description, noindex }: PageMeta) {
  document.title = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  headTag('meta', 'meta[name="description"]', { name: 'description' }).setAttribute(
    'content',
    description ?? DEFAULT_DESCRIPTION,
  )
  if (noindex) {
    headTag('meta', 'meta[name="robots"]', { name: 'robots' }).setAttribute('content', 'noindex')
  } else {
    document.head.querySelector('meta[name="robots"]')?.remove()
  }
}

// Always the production origin, even on localhost or a Vercel preview, so
// search engines fold every copy of a page into the live one. Query strings
// are dropped: /job-market/roll?career=12 is the same page as /job-market/roll.
export function setCanonical(pathname: string) {
  const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  headTag('link', 'link[rel="canonical"]', { rel: 'canonical' }).setAttribute('href', `${SITE_URL}${path}`)
}

// For pages whose title depends on their own data (a ROUTE_SEO row with
// ownMeta: true). RouteMeta leaves those routes' title and description alone.
export function usePageMeta({ title, description, noindex }: PageMeta) {
  useEffect(() => {
    applyPageMeta({ title, description, noindex })
  }, [title, description, noindex])
}
