import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Review } from '../../types'
import { BASE_URL } from '../../views/doctorsConstants'
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
  remoteLoading: boolean
  remoteError: string | null
}

const initialState: ReviewsState = {
  items: [],
  remoteItems: [],
  remoteLoading: false,
  remoteError: null,
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

export const fetchReviewsByDoctorId = createAsyncThunk<
  JsonPlaceholderComment[],
  string,
  { rejectValue: string }
>('reviews/fetchByDoctorId', async (doctorId, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}/comments?postId=${doctorId}`)
    if (!res.ok) {
      return rejectWithValue(`Could not load comments (${res.status})`)
    }
    return (await res.json()) as JsonPlaceholderComment[]
  } catch (e) {
    return rejectWithValue(
      e instanceof Error ? e.message : 'Failed to load comments',
    )
  }
})

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<AddReviewPayload>) => {
      const nextId = maxReviewId(state.items, state.remoteItems) + 1
      state.items.push({ ...action.payload, id: nextId })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByDoctorId.pending, (state) => {
        state.remoteLoading = true
        state.remoteError = null
      })
      .addCase(fetchReviewsByDoctorId.fulfilled, (state, action) => {
        state.remoteLoading = false
        state.remoteItems = action.payload
      })
      .addCase(fetchReviewsByDoctorId.rejected, (state, action) => {
        state.remoteLoading = false
        state.remoteError = action.payload ?? 'Failed to load comments'
      })
  },
})

export const { addReview } = reviewsSlice.actions
export default reviewsSlice.reducer

const selectReviewsState = (state: RootState) => state.reviews

export const selectRemoteReviews = createSelector(
  [selectReviewsState],
  (reviews) => reviews.remoteItems,
)

export const selectRemoteReviewsLoading = createSelector(
  [selectReviewsState],
  (reviews) => reviews.remoteLoading,
)

export const selectRemoteReviewsError = createSelector(
  [selectReviewsState],
  (reviews) => reviews.remoteError,
)

export const selectLocalReviewsForDoctor = createSelector(
  [selectReviewsState, (_state: RootState, doctorId: string | undefined) => doctorId],
  (reviews, doctorId) =>
    doctorId ? reviews.items.filter((r) => r.doctorId === doctorId) : [],
)
