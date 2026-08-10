// Placeholder shown for a brief moment while Career Changer results are
// "crunching the numbers" - keeps the grid's shape on screen (instead of a
// blank gap) between the last quiz question and the real cards painting in.
// Shimmer animation/colors come from the .skeleton-shimmer class in index.css.
export default function SkeletonCard() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800" aria-hidden="true">
      <div className="skeleton-shimmer h-3 w-1/3 rounded-full" />
      <div className="skeleton-shimmer mt-3 h-5 w-3/4 rounded-full" />
      <div className="skeleton-shimmer mt-5 h-3 w-1/4 rounded-full" />
      <div className="skeleton-shimmer mt-2 h-3 w-full rounded-full" />
      <div className="skeleton-shimmer mt-1.5 h-3 w-5/6 rounded-full" />
      <div className="mt-5 flex gap-2">
        <div className="skeleton-shimmer h-9 flex-1 rounded-2xl" />
        <div className="skeleton-shimmer h-9 flex-1 rounded-2xl" />
      </div>
    </div>
  )
}
