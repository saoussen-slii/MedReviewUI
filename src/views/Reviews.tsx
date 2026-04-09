import { useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import AddReviewDialog from '../components/AddReviewDialog'
import Review from '../components/Review'
import { buttonVariants } from '../components/buttonStyles'
import { REVIEWS_BY_DOCTOR_QUERY } from '../graphql/queries'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addReview,
  deleteReviewById,
  selectLocalReviewsForDoctor,
  selectRemoteReviews,
  setRemoteReviews,
} from '../store/slices/reviewsSlice'

type SelectedReview = {
  doctorId: string
  source: 'local' | 'remote'
  id: number
}

type ReviewsQueryData = {
  reviewsByDoctorId: {
    postId: number
    id: number
    name: string
    email: string
    body: string
  }[]
}

const Reviews = () => {
  const { doctorId } = useParams()
  const dispatch = useAppDispatch()
  const [selectedReview, setSelectedReview] = useState<SelectedReview | null>(
    null,
  )
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const { data, loading, error } = useQuery<ReviewsQueryData>(
    REVIEWS_BY_DOCTOR_QUERY,
    {
      variables: { doctorId: doctorId ?? '' },
      skip: !doctorId,
    },
  )

  useEffect(() => {
    dispatch(setRemoteReviews([]))
  }, [doctorId, dispatch])

  useEffect(() => {
    if (data?.reviewsByDoctorId) {
      dispatch(setRemoteReviews(data.reviewsByDoctorId))
    }
  }, [data, dispatch])

  const remote = useAppSelector(selectRemoteReviews)
  const localForDoctor = useAppSelector((state) =>
    selectLocalReviewsForDoctor(state, doctorId),
  )

  const displayRows = useMemo(() => {
    const fromLocal = localForDoctor.map((r) => ({
      source: 'local' as const,
      review: {
        id: r.id,
        title: r.title,
        email: r.email,
        body: r.body,
      },
    }))
    const fromRemote = remote.map((r) => ({
      source: 'remote' as const,
      review: {
        id: r.id,
        title: r.name,
        email: r.email,
        body: r.body,
      },
    }))
    return [...fromLocal, ...fromRemote]
  }, [localForDoctor, remote])

  const activeSelection =
    selectedReview && selectedReview.doctorId === doctorId
      ? selectedReview
      : null

  const isSelected = (row: {
    source: SelectedReview['source']
    review: { id: number }
  }) =>
    activeSelection?.source === row.source &&
    activeSelection.id === row.review.id

  const handleDeleteReview = () => {
    if (!doctorId || !activeSelection || activeSelection.source !== 'local')
      return
    dispatch(
      deleteReviewById({ doctorId, reviewId: activeSelection.id }),
    )
    setSelectedReview(null)
  }

  return (
    <div className="min-h-svh bg-slate-50 px-4 py-8 text-slate-900 md:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/doctors"
          className="text-sm font-medium text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline"
        >
          ← Back to doctors
        </Link>

        <header className="sticky top-0 z-20 -mx-4 mt-6 border-b border-slate-200/80 bg-slate-50/95 px-4 pb-4 pt-1 shadow-sm backdrop-blur-sm md:-mx-6 md:px-6">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Reviews
          </h1>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-600 md:text-base">
              Doctor ID: {doctorId ?? '—'}
            </p>
            <div className="flex flex-col justify-end gap-4 sm:ml-auto sm:flex-row">
              <button
                type="button"
                className={`${buttonVariants.primary} w-full sm:w-auto sm:min-w-24`}
                onClick={() => setAddDialogOpen(true)}
              >
                Add
              </button>
              <button
                type="button"
                className={`${buttonVariants.danger} w-full sm:w-auto sm:min-w-24 disabled:cursor-not-allowed disabled:opacity-50`}
                disabled={
                  !activeSelection ||
                  activeSelection.source !== 'local' ||
                  !doctorId
                }
                onClick={handleDeleteReview}
              >
                Delete
              </button>
            </div>
          </div>
        </header>

        <AddReviewDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSubmit={(payload) => {
            if (!doctorId) return
            dispatch(addReview({ doctorId, ...payload }))
          }}
        />

        {loading ? (
          <p className="mt-8 text-sm text-slate-600">Loading…</p>
        ) : error ? (
          <p
            className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error.message}
          </p>
        ) : displayRows.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6">
            {displayRows.map((row) => (
              <Review
                key={`${row.source}-${row.review.id}`}
                review={row.review}
                isSelected={isSelected(row)}
                onSelect={() => {
                  if (!doctorId) return
                  setSelectedReview({
                    doctorId,
                    source: row.source,
                    id: row.review.id,
                  })
                }}
              />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-slate-600">No reviews found.</p>
        )}
      </div>
    </div>
  )
}

export default Reviews
