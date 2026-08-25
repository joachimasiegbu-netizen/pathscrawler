import type { TierKey } from './careerTiers'

// One real Audio element per src, created once and reused - not a fresh
// `new Audio()` per call. A cold `new Audio(src).play()` has to fetch and
// decode the file before playback can start, which reads as a real,
// noticeable lag on its very first play - reusing (and preloading, see
// below) the same element means that cost is paid ahead of time instead
// of at the exact moment a player expects an instant click sound.
const audioCache = new Map<string, HTMLAudioElement>()

function getCachedAudio(src: string): HTMLAudioElement {
  let audio = audioCache.get(src)
  if (!audio) {
    audio = new Audio(src)
    audio.preload = 'auto'
    audioCache.set(src, audio)
  }
  return audio
}

// Every call is a graceful no-op if playback fails (file missing, autoplay
// policy, browser quirks, Audio unavailable in this environment, ...)
// since a missing/blocked sound effect should never break the interaction
// it's attached to. currentTime reset to startAtSec (0 by default) first
// so mashing the same action twice in a row (e.g. mis-clicking Roll again)
// restarts the clip from the top instead of doing nothing (a
// still-playing HTMLAudioElement ignores a second .play() call on itself).
//
// maxDurationMs cuts playback off early (a plain setTimeout pause, not an
// actual trimmed asset - MythicStarfieldReveal.tsx's scream cue wants
// only the first 3s of a longer file, and this way the source file in
// public/sounds stays whole rather than needing a second, pre-trimmed
// copy of it). startAtSec does the same for the START of a clip instead of
// the end (roll-click.mp3 has ~0.5s of near-silent lead-in before the
// actual click hits, per explicit request to cut it) - same reasoning:
// skips it at playback time rather than needing an actual pre-trimmed
// second copy of the file (no audio-editing tool available in this
// environment to cut the real asset anyway).
export function playSound(src: string, maxDurationMs?: number, startAtSec = 0) {
  try {
    const audio = getCachedAudio(src)
    audio.currentTime = startAtSec
    void audio.play().catch(() => {})
    if (maxDurationMs) {
      window.setTimeout(() => {
        audio.pause()
        audio.currentTime = startAtSec
      }, maxDurationMs)
    }
  } catch {
    // Audio unavailable in this environment - nothing else to do.
  }
}

// For ambient beds meant to loop under a whole scene (MythicStarfieldReveal
// .tsx's rain overlay) rather than a one-shot hit - sets loop before
// playing, and unlike playSound this needs an explicit stopSound() call
// when the scene ends (a one-shot hit can just be left to finish playing
// out on its own past unmount; a looping bed left unstopped would loop
// forever in the background).
export function playLoopingSound(src: string) {
  try {
    const audio = getCachedAudio(src)
    audio.loop = true
    audio.currentTime = 0
    void audio.play().catch(() => {})
  } catch {
    // Audio unavailable in this environment - nothing else to do.
  }
}

export function stopSound(src: string) {
  try {
    const audio = getCachedAudio(src)
    audio.pause()
    audio.currentTime = 0
    audio.loop = false
  } catch {
    // Audio unavailable in this environment - nothing else to do.
  }
}

// AudioContext-backed boosted playback - kept entirely separate from the
// cached elements/audioCache above. A plain HTMLMediaElement's `.volume`
// caps at 1.0 (100%) - every sound in this file already plays at that
// default since nothing here ever sets it lower - so "increase the
// volume" past what a file already plays at can't be done through that
// property at all; a Web Audio GainNode with gain > 1 is the only way to
// actually amplify it. Deliberately creates its OWN dedicated Audio
// element per call rather than reusing getCachedAudio's shared one:
// routing an element through a GainNode via createMediaElementSource
// permanently redirects ALL of its future output through that graph (and
// can only be done once per element, ever), which would silently boost
// every OTHER caller of the same src too (e.g. Celestial's own,
// deliberately unboosted use of celestial-blast.mp3) - not just this one
// call.
let boostAudioContext: AudioContext | null = null
// Tracked separately from audioCache above (boosted elements are never
// put in there) purely so stopAllSounds() below can reach them too - see
// its own comment for why that matters for a grinding player mashing
// Roll Again. Elements are dropped from this set once they finish
// playing on their own (the 'ended' listener), so it can't grow forever
// across a long grinding session.
const boostedAudioElements = new Set<HTMLAudioElement>()
export function playSoundBoosted(src: string, gain: number) {
  try {
    const AudioContextCtor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextCtor) return
    boostAudioContext ??= new AudioContextCtor()
    if (boostAudioContext.state === 'suspended') void boostAudioContext.resume()
    const audio = new Audio(src)
    const source = boostAudioContext.createMediaElementSource(audio)
    const gainNode = boostAudioContext.createGain()
    gainNode.gain.value = gain
    source.connect(gainNode).connect(boostAudioContext.destination)
    boostedAudioElements.add(audio)
    audio.addEventListener('ended', () => boostedAudioElements.delete(audio))
    void audio.play().catch(() => {})
  } catch {
    // Web Audio unavailable in this environment - nothing else to do.
  }
}

// Every sound this app can currently have playing, silenced at once - for
// a player grinding for Mythic/Celestial: rolling again (or dismissing a
// card) the instant they see a tier they don't want, over and over, would
// otherwise leave whatever one-shot/loop was mid-playback (a thunder
// crack, the explosion boom, a tier stinger, the rain bed) bleeding into
// the NEXT roll's own soundscape instead of cutting off cleanly. Reaches
// both audioCache (every cached one-shot/loop sound this file has ever
// played) and the separately-tracked boosted elements above - two
// different pools, both need clearing. Callers (JobMarketRollPage.tsx's
// handleRoll/dismiss) are expected to call this BEFORE starting/leaving a
// roll, not after - see those call sites for exactly where.
export function stopAllSounds() {
  audioCache.forEach((audio) => {
    audio.pause()
    audio.currentTime = 0
    audio.loop = false
  })
  boostedAudioElements.forEach((audio) => {
    audio.pause()
    audio.currentTime = 0
  })
  boostedAudioElements.clear()
}

// Fetches + decodes the given files ahead of time (call once, e.g. on
// mount of a page that's about to need instant playback) so the FIRST
// real playSound() for each of them doesn't pay that fetch/decode cost -
// purely a `.load()` (no playback attempt), so it isn't subject to
// autoplay-policy blocking the way an unprompted .play() would be.
export function preloadSounds(srcs: string[]) {
  srcs.forEach((src) => getCachedAudio(src).load())
}

// One reveal stinger per tier, played the moment that tier's card actually
// becomes visible - for Common through Legendary that's the instant
// RollResultCard mounts (JobMarketRollPage.tsx's finishRoll, no click
// gating), for Mythic/Celestial it's the "revealed" phase inside their own
// reveal cards, a beat after the click-triggered card-burst.mp3 explosion
// (two layered cues: burst on click, then this stinger once the card
// itself is actually showing). "legendry"/"celestial win" were the source
// files' own names (Music/app sounds) - renamed to match this app's own
// TierKey spelling when copied into public/sounds.
export const TIER_SOUNDS: Record<TierKey, string> = {
  common: '/sounds/common.mp3',
  uncommon: '/sounds/uncommon.mp3',
  rare: '/sounds/rare.mp3',
  epic: '/sounds/epic.mp3',
  legendary: '/sounds/legendary.mp3',
  mythic: '/sounds/mythic.mp3',
  celestial: '/sounds/celestial-win.mp3',
}
