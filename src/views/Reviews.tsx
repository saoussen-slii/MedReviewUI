import { useEffect, useMemo, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
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

type SelectedReview = {
  doctorId: string
  source: 'local' | 'remote'
  id: number
}

const emptyForm = {
  title: '',
  email: '',
  body: '',
}

const Reviews = () => {
  const { doctorId } = useParams()
  const dispatch = useAppDispatch()
  const [selectedReview, setSelectedReview] = useState<SelectedReview | null>(
    null,
  )
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

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
        title: r.title,
        email: r.email,
        body: r.body,
      },
    }))
    const fromRemote = remote.map((r) => ({
      source: 'remote' as const,
      review: {
        id: r.id,
        title: r.name as string,
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

  const resetForm = () => {
    setForm(emptyForm)
  }

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false)
    resetForm()
  }

  const canSubmitAdd =
    form.title.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.body.trim().length > 0

  const handleSubmitAdd = () => {
    if (!doctorId || !canSubmitAdd) return
    dispatch(
      addReview({
        doctorId,
        title: form.title.trim(),
        email: form.email.trim(),
        body: form.body.trim(),
      }),
    )
    handleCloseAddDialog()
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

        <Dialog
          open={addDialogOpen}
          onClose={handleCloseAddDialog}
          slotProps={{
            paper: {
              className:
                'w-full max-w-lg rounded-xl border border-slate-200/80 bg-white p-0 shadow-lg',
            },
            backdrop: {
              className: 'bg-slate-900/40',
            },
          }}
        >
          <DialogTitle className="border-b border-slate-200/80 px-6 py-4 text-lg font-semibold text-slate-900">
            Add review
          </DialogTitle>
          <DialogContent className="flex flex-col gap-4 px-6 pt-6 pb-2">
            <label className="block text-sm font-medium text-slate-700">
              Title
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/30"
                placeholder="Reviewer title"
                autoComplete="title"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/30"
                placeholder="email@example.com"
                autoComplete="email"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Body
              <textarea
                value={form.body}
                onChange={(e) =>
                  setForm((f) => ({ ...f, body: e.target.value }))
                }
                rows={4}
                className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/30"
                placeholder="Write your review…"
              />
            </label>
          </DialogContent>
          <DialogActions className="gap-2 border-t border-slate-200/80 px-6 py-4">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
              onClick={handleCloseAddDialog}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSubmitAdd}
              className={`${buttonVariants.primary} disabled:cursor-not-allowed disabled:opacity-50`}
              onClick={handleSubmitAdd}
            >
              Add
            </button>
          </DialogActions>
        </Dialog>

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
