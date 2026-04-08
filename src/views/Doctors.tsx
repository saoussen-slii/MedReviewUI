import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import DoctorCard from '../components/DoctorCard'
import type { Doctor, JsonPlaceholderUser } from '../types'
import { mapUserToDoctor } from './doctorsUtils'
import { SKELETON_IDS, USERS_URL } from './doctorsConstants'


const DoctorCardSkeleton = () => (
  <div
    className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
    aria-hidden
  >
    <div className="animate-pulse space-y-4">
      <div className="h-5 w-3/4 rounded-md bg-slate-200" />
      <div className="h-3 w-1/2 rounded-md bg-slate-200" />
      <div className="space-y-2 pt-2">
        <div className="h-3 w-full rounded-md bg-slate-100" />
        <div className="h-3 w-5/6 rounded-md bg-slate-100" />
        <div className="h-8 w-28 rounded-md bg-slate-200" />
      </div>
    </div>
  </div>
)


const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(USERS_URL)
        if (!res.ok) {
          throw new Error(`Could not load directory (${res.status})`)
        }
        const data = (await res.json()) as JsonPlaceholderUser[]
        if (!cancelled) {
          setDoctors(data.map(mapUserToDoctor))
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load doctors')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

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
