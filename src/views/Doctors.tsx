import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import DoctorCard from '../components/DoctorCard'
import DoctorCardSkeleton from '../components/DoctorCardSkeleton'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  fetchDoctors,
  selectDoctors,
  selectDoctorsError,
  selectDoctorsLoading,
} from '../store/slices/doctorsSlice'
import { SKELETON_IDS } from './doctorsConstants'

const Doctors = () => {
  const dispatch = useAppDispatch()
  const doctors = useAppSelector(selectDoctors)
  const loading = useAppSelector(selectDoctorsLoading)
  const error = useAppSelector(selectDoctorsError)

  useEffect(() => {
    void dispatch(fetchDoctors())
  }, [dispatch])

  return (
    <div className="min-h-svh bg-slate-50 px-4 py-8 text-slate-900 md:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="text-sm font-medium text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline"
        >
          ← Back home
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">
          Doctors
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
          Directory sourced from JSONPlaceholder. Hospital and professional
          profile are mapped from each user&apos;s company and website.
        </p>

        {error ? (
          <p
            className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {loading
            ? SKELETON_IDS.map((id) => <DoctorCardSkeleton key={id} />)
            : doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
