export default function WaveBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-blue-700/20" />
      <div className="absolute -top-10 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute top-14 left-10 h-[220px] w-[220px] rounded-full bg-sky-300/20 blur-2xl" />
      <div className="absolute top-24 right-6 h-[160px] w-[160px] rounded-full bg-cyan-300/20 blur-2xl" />
    </div>
  )
}
