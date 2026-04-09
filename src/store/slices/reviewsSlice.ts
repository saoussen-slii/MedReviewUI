import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Review } from '../../types'
import type { RootState } from '../store'

export type JsonPlaceholderComment = {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

type ReviewsState = {
  items: Review[]
  remoteItems: JsonPlaceholderComment[]
}

const initialState: ReviewsState = {
  items: [],
  remoteItems: [],
}

const maxReviewId = (items: Review[], remote: JsonPlaceholderComment[]): number => {
  let max = 0
  for (const r of items) {
    if (r.id > max) max = r.id
  }
  for (const r of remote) {
    if (r.id > max) max = r.id
  }
  return max
}

export type AddReviewPayload = Omit<Review, 'id'>
export type DeleteReviewByIdPayload = {
  doctorId: string
  reviewId: number
}

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<AddReviewPayload>) => {
      const nextId = maxReviewId(state.items, state.remoteItems) + 1
      state.items.push({ ...action.payload, id: nextId })
    },
    deleteReviewById: (
      state,
      action: PayloadAction<DeleteReviewByIdPayload>,
    ) => {
      const { doctorId, reviewId } = action.payload
      state.items = state.items.filter(
        (r) => !(r.doctorId === doctorId && r.id === reviewId),
      )
    },
    setRemoteReviews: (
      state,
      action: PayloadAction<JsonPlaceholderComment[]>,
    ) => {
      state.remoteItems = action.payload
    },
  },
})

export const { addReview, deleteReviewById, setRemoteReviews } =
  reviewsSlice.actions
export default reviewsSlice.reducer

const selectReviewsState = (state: RootState) => state.reviews

export const selectRemoteReviews = createSelector(
  [selectReviewsState],
  (reviews) => reviews.remoteItems,
)

export const selectLocalReviewsForDoctor = createSelector(
  [selectReviewsState, (_state: RootState, doctorId: string | undefined) => doctorId],
  (reviews, doctorId) =>
    doctorId ? reviews.items.filter((r) => r.doctorId === doctorId) : [],
)
