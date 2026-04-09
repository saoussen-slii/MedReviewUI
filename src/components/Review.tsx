type ReviewProps = {
  review: {
    id: number
    name: string
    email: string
    body: string
  }
  isSelected: boolean
  onSelect: () => void
}

const Review = ({ review, isSelected, onSelect }: ReviewProps) => (
  <article
    role="button"
    tabIndex={0}
    onClick={onSelect}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onSelect()
      }
    }}
    className={`cursor-pointer rounded-xl border bg-white p-5 transition-all duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
      isSelected
        ? 'border-teal-600/80 shadow-lg ring-2 ring-teal-600/40'
        : 'border-slate-200/80 shadow-sm hover:shadow-lg'
    }`}
  >
    <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold text-slate-900">
          {review.name}
        </h2>
        <p className="mt-0.5 text-sm text-slate-600">{review.email}</p>
      </div>
      <p className="shrink-0 text-xs font-medium text-slate-500">
        Review #{review.id}
      </p>
    </header>

    <blockquote className="mt-4 border-l-2 border-slate-200 pl-4 text-sm leading-relaxed text-slate-700">
      <span className="sr-only">Testimonial</span>
      <p className="whitespace-pre-wrap">{review.body}</p>
    </blockquote>
  </article>
)

export default Review
