import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import type { Doctor, JsonPlaceholderUser } from '../types'
import { mapUserToDoctor } from './doctorsUtils.ts'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

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

const SKELETON_IDS = ['s-1', 's-2', 's-3', 's-4', 's-5', 's-6'] as const

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
                <article
                  key={doctor.id}
                  className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <h2 className="text-lg font-semibold text-slate-900">
                    {doctor.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">@{doctor.username}</p>
                  <dl className="mt-4 flex flex-1 flex-col gap-3 text-sm">
                    <div>
                      <dt className="font-medium text-slate-700">Hospital</dt>
                      <dd className="mt-0.5 text-slate-600">{doctor.hospital}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-700">Contact</dt>
                      <dd className="mt-0.5">
                        <a
                          href={`mailto:${doctor.email}`}
                          className="text-teal-700 underline-offset-2 hover:text-teal-800 hover:underline"
                        >
                          {doctor.email}
                        </a>
                      </dd>
                      <dd className="mt-1 text-slate-600">{doctor.phone}</dd>
                    </div>
                    <div className="mt-auto pt-2">
                      <dt className="sr-only">Professional profile</dt>
                      <dd>
                        <a
                          href={doctor.professionalProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                        >
                          Professional profile
                        </a>
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
