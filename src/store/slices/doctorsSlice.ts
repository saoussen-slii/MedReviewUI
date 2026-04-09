import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

import type { Doctor, JsonPlaceholderUser } from '../../types'
import { BASE_URL } from '../../views/doctorsConstants'
import { mapUserToDoctor } from '../../views/doctorsUtils'
import type { RootState } from '../store'

type DoctorsState = {
  items: Doctor[]
  loading: boolean
  error: string | null
}

const initialState: DoctorsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchDoctors = createAsyncThunk<
  Doctor[],
  void,
  { rejectValue: string }
>('doctors/fetchDoctors', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}/users`)
    if (!res.ok) {
      return rejectWithValue(`Could not load directory (${res.status})`)
    }
    const data = (await res.json()) as JsonPlaceholderUser[]
    return data.map(mapUserToDoctor)
  } catch (e) {
    return rejectWithValue(
      e instanceof Error ? e.message : 'Failed to load doctors',
    )
  }
})

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to load doctors'
      })
  },
})

export default doctorsSlice.reducer

const selectDoctorsState = (state: RootState) => state.doctors

export const selectDoctors = createSelector(
  [selectDoctorsState],
  (doctors) => doctors.items,
)

export const selectDoctorsLoading = createSelector(
  [selectDoctorsState],
  (doctors) => doctors.loading,
)

export const selectDoctorsError = createSelector(
  [selectDoctorsState],
  (doctors) => doctors.error,
)
