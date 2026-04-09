import { Link } from 'react-router-dom'
import type { Doctor } from '../types'

type DoctorCardProps = {
  doctor: Doctor
}

const DoctorCard = ({ doctor }: DoctorCardProps) => (
  <article className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
    <h2 className="text-lg font-semibold text-slate-900">{doctor.name}</h2>
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
          <div className="flex flex-col justify-end gap-4 sm:flex-row">
            <a
              href={doctor.professionalProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              Professional profile
            </a>
            <Link
              to={`/doctors/${doctor.id}/reviews`}
              className="inline-flex items-center justify-center rounded-lg border border-teal-600 bg-white px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm transition-colors hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              Reviews
            </Link>
          </div>
        </dd>
      </div>
    </dl>
  </article>
)

export default DoctorCard
