import { configureStore } from '@reduxjs/toolkit'

import doctorsReducer from './slices/doctorsSlice'
import reviewsReducer from './slices/reviewsSlice'

export const store = configureStore({
  reducer: {
    doctors: doctorsReducer,
    reviews: reviewsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
