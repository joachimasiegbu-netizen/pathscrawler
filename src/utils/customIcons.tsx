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
// file), given a plain array of SVG primitives.
//
// First attempt modeled this on lucide's own Scissors icon (two circles
// for handle grips, connected by straight lines crossing through a shared
// pivot to blade-like tips) - and it just read as scissors with the
// handles moved, since that IS the scissors construction (an X-cross plus
// closed handle rings), not a pliers one - caught live, not assumed.
// Redone from the actual visual differences between the two tools: real
// pliers have two bodies that stay roughly parallel and OVERLAP at a
// rivet rather than crossing into an X, jaws that stay close together
// (not splayed wide like an open blade), and open/flared handle ends
// (not closed finger-hole rings, which read specifically as scissors/
// shears). Two slightly-converging paths (handle -> rivet -> jaw tip,
// wide apart at the handle end, close together at the jaw end, never
// swapping sides so they never actually cross), a pivot rivet where they
// pass closest to each other, and default lucide round line-caps at
// every open end.
export const Pliers = createLucideIcon('pliers', [
  ['path', { d: 'M7 20 9.5 12.5 10 4', key: 'body-l' }],
  ['path', { d: 'M17 20 14.5 12.5 14 4', key: 'body-r' }],
  ['circle', { cx: '12', cy: '12.3', r: '1.4', key: 'rivet' }],
])

// A standalone chisel - lucide has no chisel icon either (Hammer, Pickaxe,
// Axe, Gavel, Drill, Wrench are its only tool icons, same check as
// Pliers's own comment above). A simple diagonal tool shape, same
// language the rest of this file and lucide itself use for hand tools:
// handle at one end, working end at the other. The blade doesn't taper to
// a point the way a knife would - a short perpendicular tick at the tip
// stands in for the flat cutting edge a chisel actually has, the one
// detail that keeps this from reading as a generic rod/screwdriver.
// Not currently used on its own anywhere in the app (HammerAndChisel
// below is what's actually wired to a career) - kept exported as a
// building block in case a future career needs just the one tool.
export const Chisel = createLucideIcon('chisel', [
  ['path', { d: 'M18 19 11 12', key: 'handle' }],
  ['path', { d: 'M11 12 6 7', key: 'blade' }],
  ['path', { d: 'M4.5 8.5 7.5 5.5', key: 'edge' }],
])

// Hammer and chisel, crossed - the actual fix for the gap Pargeter/Ship's
// Figurehead Carver's own TITLE_OVERRIDES comment (careerIcons.ts) flags:
// lucide has no combined hammer-and-chisel icon, so those two stonemasonry/
// carving careers fell back to plain Hammer as a stand-in.
//
// Been through a few passes: simplified mallet (plain diagonal + a
// rotated-rect head) -> swapped for lucide's real, more detailed Hammer
// path data per "use the hammer icon thats already made" (so it'd match
// the real Hammer icon this app uses everywhere else) -> the chisel's own
// diagonal had to move further down its own line to clear that more
// detailed head's own footprint, which also happened to be the moment its
// stroke got thickened (2.75 vs the default 2) so it wouldn't read as
// thinner next to the hammer's extra path detail -> switched back to the
// simplified mallet per a follow-up request, which also meant the
// chisel's crossing point needed to move back to where it originally sat
// (12.5,12.5-ish) rather than the position tuned for the real hammer's
// different-shaped head - keeping that position would have traded one
// clash for a new one against the mallet's own head instead, which sits
// in a different spot. The thickness bump stayed - genuinely useful on
// its own, unrelated to which hammer shape it's paired with.
export const HammerAndChisel = createLucideIcon('hammer-and-chisel', [
  ['path', { d: 'M4 20 11 13', key: 'hammer-handle' }],
  ['rect', { x: '10.5', y: '8.5', width: '7', height: '3', rx: '0.6', transform: 'rotate(-45 14 10)', key: 'hammer-head' }],
  ['path', { d: 'M20 20 13 13', key: 'chisel-handle', strokeWidth: '2.75' }],
  ['path', { d: 'M13 13 8 8', key: 'chisel-blade', strokeWidth: '2.75' }],
  ['path', { d: 'M6.5 9.5 9.5 6.5', key: 'chisel-edge', strokeWidth: '2.75' }],
])
