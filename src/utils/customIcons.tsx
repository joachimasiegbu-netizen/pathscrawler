import { createLucideIcon } from 'lucide-react'

// lucide-react (checked v0.517.0, the version this app has installed) has
// no "pliers" icon, and nothing close either (tongs/clamp/wicker/weave all
// come up empty too - checked both the icon file list and the actual
// package's exported names, not just filenames). Rather than pull in a
// second icon library for one icon - which would look visibly
// inconsistent next to lucide's stroke width/style everywhere else in
// this app - or fake it with an unrelated tool icon, this builds a real
// pliers glyph the same way lucide builds its own: createLucideIcon() is
// itself part of lucide-react's public API (not just an internal build
// file), given a plain array of SVG primitives. Structured like lucide's
// own Scissors icon (two circles for the handle grips, connected by
// straight lines through a shared pivot) - same handle-loops-plus-
// crossing-lines shape, just with the pivot roughly centered rather than
// at one end, and the lines continuing past it out to jaw tips instead of
// stopping at a blade point.
export const Pliers = createLucideIcon('pliers', [
  ['circle', { cx: '7', cy: '19', r: '2.2', key: 'grip-l' }],
  ['circle', { cx: '17', cy: '19', r: '2.2', key: 'grip-r' }],
  ['path', { d: 'M8.2 17.1 12 11', key: 'handle-l' }],
  ['path', { d: 'M15.8 17.1 12 11', key: 'handle-r' }],
  ['circle', { cx: '12', cy: '11', r: '1', key: 'pivot' }],
  ['path', { d: 'M12 11 9 4', key: 'jaw-l' }],
  ['path', { d: 'M12 11 15 4', key: 'jaw-r' }],
])
