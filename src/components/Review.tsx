type ReviewProps = {
  review: {
    id: number
    name: string
    email: string
    body: string
  }
}

const Review = ({ review }: ReviewProps) => (
  <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
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
