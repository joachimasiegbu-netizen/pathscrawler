import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

// The 7 fixed star positions reused identically across all 4 star boxes
// (see .notfound-scene CSS) - only the box's own animation-delay differs,
// which is what makes the 4 layers read as one continuous field of stars
// drifting past at different depths rather than 4 stacked copies moving in
// lockstep.
const STAR_POSITIONS = [1, 2, 3, 4, 5, 6, 7]

function StarField({ className }: { className: string }) {
  return (
    <div className={className}>
      {STAR_POSITIONS.map((position) => (
        <div key={position} className={`star star-position${position}`} />
      ))}
    </div>
  )
}

// 404 page - an astronaut adrift, built entirely from plain CSS shapes/
// gradients (no image assets) in index.css under .notfound-scene. Kept as
// its own fixed-dark backdrop regardless of the site's light/dark toggle -
// same reasoning as Roll a Job's own permanently-dark "game mode" page -
// stars-on-white would just look broken, and this is a one-off illustrated
// error state, not core app chrome that needs to track the toggle.
export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#0a0e2a] px-6 py-16 text-center">
      <div className="notfound-scene relative h-[420px] w-full max-w-4xl overflow-hidden sm:h-[500px]">
        <StarField className="box-of-star1" />
        <StarField className="box-of-star2" />
        <StarField className="box-of-star3" />
        <StarField className="box-of-star4" />

        <div className="astronaut" aria-hidden="true">
          <div className="schoolbag" />
          <div className="head" />
          <div className="body" />
          <div className="panel" />
          <div className="arm arm-left" />
          <div className="arm arm-right" />
          <div className="leg leg-left" />
          <div className="leg leg-right" />
        </div>
      </div>

      <div className="relative z-20 -mt-4 space-y-3 sm:-mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">404</p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Looks like you've drifted off course</h1>
        <p className="mx-auto max-w-md text-sm leading-6 text-slate-300">
          We couldn't find that page. It might have moved, or the link might be off - let's get you back on a real
          pathway.
        </p>
        <div className="pt-2">
          <Button onClick={() => navigate('/')}>Back to PathScrawler</Button>
        </div>
      </div>
    </div>
  )
}
