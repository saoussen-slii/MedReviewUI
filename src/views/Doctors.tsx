import { Link } from 'react-router-dom'

const Doctors = () => (
  <div className="min-h-svh bg-slate-50 px-4 py-8 text-slate-900 md:px-6">
    <div className="mx-auto max-w-2xl">
      <Link
        to="/"
        className="text-sm font-medium text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline"
      >
        ← Back home
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">
        Doctors
      </h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Doctor directory and portal content will live here.
      </p>
    </div>
  </div>
)

export default Doctors
