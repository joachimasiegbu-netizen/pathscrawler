import { usePathStore } from '../store/usePathStore'

/**
 * Port of the "Earth Banner" CSS artifact
 * (claude.ai/code/artifact/4600dc4c) - a rotating earth circle - used as
 * the Student Hub persona's visual on RoleSelectionPage.tsx (the way
 * StudentPersonaCube.tsx is Student's).
 *
 * The artifact also had 7 twinkling corner-star sparkles and a dark
 * night-sky backdrop behind the earth (added so the white stars would be
 * visible at all against this app's light page background) - both removed
 * on request, leaving just the plain rotating earth on the page's own
 * background. Neither comes back here: the brightness below comes from the
 * globe itself, not from putting anything behind it again - and there is no
 * outer glow either, removed on request.
 *
 * The one span is what's left of the detail/brightness pass (explicit
 * request: "more detailed and bright") - night-side city lights, back at
 * their original 9 points after a brighter 24-point pass was reverted. Two
 * sibling layers started here and were each dropped on explicit request: a
 * specular hotspot + atmospheric limb ring, then a drifting cloud deck.
 * It stays a separate element rather than folding into the banner
 * because it needs its own mask and screen blend over the banner's own
 * background, which one element can't do to itself.
 */
export default function StudentHubPersonaEarth({ className }: { className?: string }) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  return (
    <div className={`student-hub-earth-stage ${className ?? ''}`} data-reduce-motion={reduceMotion ? 'true' : undefined}>
      <div className="student-hub-earth-banner">
        <span aria-hidden="true" className="student-hub-earth-lights" />
      </div>
    </div>
  )
}
