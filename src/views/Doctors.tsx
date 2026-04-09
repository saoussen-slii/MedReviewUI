import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

import DoctorCard from '../components/DoctorCard'
import DoctorCardSkeleton from '../components/DoctorCardSkeleton'
import { DOCTORS_QUERY } from '../graphql/queries'
import type { Doctor } from '../types'
import { SKELETON_IDS } from './doctorsConstants'

const Doctors = () => {
  const { data, loading, error } = useQuery<{ doctors: Doctor[] }>(
    DOCTORS_QUERY,
  )

  const doctors = data?.doctors ?? []

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
          Directory loaded via GraphQL (Apollo Client). Backend wraps JSONPlaceholder
          users as doctors.
        </p>

        {error ? (
          <p
            className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error.message}
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
