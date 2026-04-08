import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Review } from '../types'

type ReviewsState = {
  items: Review[]
}

const initialState: ReviewsState = {
  items: [],
}

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<Review>) => {
      state.items.push(action.payload)
    },
  },
})

export const { addReview } = reviewsSlice.actions
export default reviewsSlice.reducer
