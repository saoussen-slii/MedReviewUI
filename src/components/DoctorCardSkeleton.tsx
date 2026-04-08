const DoctorCardSkeleton = () => (
  <div
    className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
    aria-hidden
  >
    <div className="animate-pulse space-y-4">
      <div className="h-5 w-3/4 rounded-md bg-slate-200" />
      <div className="h-3 w-1/2 rounded-md bg-slate-200" />
      <div className="space-y-2 pt-2">
        <div className="h-3 w-full rounded-md bg-slate-100" />
        <div className="h-3 w-5/6 rounded-md bg-slate-100" />
        <div className="h-8 w-28 rounded-md bg-slate-200" />
      </div>
    </div>
  </div>
)

export default DoctorCardSkeleton
