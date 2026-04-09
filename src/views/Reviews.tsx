import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Review from '../components/Review'
import { buttonVariants } from '../components/buttonStyles'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addReview,
  deleteReviewById,
  fetchReviewsByDoctorId,
  selectLocalReviewsForDoctor,
  selectRemoteReviews,
  selectRemoteReviewsError,
  selectRemoteReviewsLoading,
} from '../store/slices/reviewsSlice'

type SelectedReview = { source: 'local' | 'remote'; id: number }

const Reviews = () => {
  const { doctorId } = useParams()
  const dispatch = useAppDispatch()
  const [selectedReview, setSelectedReview] = useState<SelectedReview | null>(
    null,
  )
  const loading = useAppSelector(selectRemoteReviewsLoading)
  const error = useAppSelector(selectRemoteReviewsError)
  const remote = useAppSelector(selectRemoteReviews)
  const localForDoctor = useAppSelector((state) =>
    selectLocalReviewsForDoctor(state, doctorId),
  )

  const displayRows = useMemo(() => {
    const fromLocal = localForDoctor.map((r) => ({
      source: 'local' as const,
      review: {
        id: r.id,
        name: r.title,
        email: r.email,
        body: r.body,
      },
    }))
    const fromRemote = remote.map((r) => ({
      source: 'remote' as const,
      review: {
        id: r.id,
        name: r.name,
        email: r.email,
        body: r.body,
      },
    }))
    return [...fromLocal, ...fromRemote]
  }, [localForDoctor, remote])

  useEffect(() => {
    if (!doctorId) return
    void dispatch(fetchReviewsByDoctorId(doctorId))
  }, [dispatch, doctorId])

  useEffect(() => {
    setSelectedReview(null)
  }, [doctorId])

  const isSelected = (row: { source: SelectedReview['source']; review: { id: number } }) =>
    selectedReview?.source === row.source && selectedReview.id === row.review.id

  const handleDeleteReview = () => {
    if (!doctorId || !selectedReview || selectedReview.source !== 'local') return
    dispatch(deleteReviewById({ doctorId, reviewId: selectedReview.id }))
    setSelectedReview(null)
  }

  const handleAddReview = () => {
    if (!doctorId) return
    dispatch(
      addReview({
        doctorId,
        title: 'Anonymous patient',
        email: 'patient.placeholder@example.com',
        body:
          'Excellent care and clear communication. This review was added from the app as sample data.',
      }),
    )
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

        <h1 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">
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
              onClick={handleAddReview}
            >
              Add
            </button>
            <button
              type="button"
              className={`${buttonVariants.danger} w-full sm:w-auto sm:min-w-24 disabled:cursor-not-allowed disabled:opacity-50`}
              disabled={
                !selectedReview ||
                selectedReview.source !== 'local' ||
                !doctorId
              }
              onClick={handleDeleteReview}
            >
              Delete
            </button>
          </div>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-slate-600">Loading…</p>
        ) : error ? (
          <p
            className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : displayRows.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6">
            {displayRows.map((row) => (
              <Review
                key={`${row.source}-${row.review.id}`}
                review={row.review}
                isSelected={isSelected(row)}
                onSelect={() =>
                  setSelectedReview({
                    source: row.source,
                    id: row.review.id,
                  })
                }
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
