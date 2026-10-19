import { useEffect } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { NOT_FOUND_SEO, ROUTE_SEO } from '../data/seo'
import { applyPageMeta, setCanonical } from '../utils/pageMeta'

// Keeps the tab title, meta description, robots and canonical tags in step
// with the current route, from the table in src/data/seo.ts. Renders nothing.
export default function RouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    setCanonical(pathname)
    const route = ROUTE_SEO.find((entry) => matchPath(entry.path, pathname)) ?? NOT_FOUND_SEO
    // The page sets these itself with usePageMeta.
    if (route.ownMeta) return
    applyPageMeta(route)
  }, [pathname])

  return null
}
