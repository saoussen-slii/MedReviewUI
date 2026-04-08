import { HeartPulse } from 'lucide-react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import Doctors from './views/Doctors'

const Home = () => (
  <div className="min-h-svh bg-slate-50 px-4 py-8 text-slate-900 md:px-6">
    <header className="mx-auto max-w-2xl text-center">
      <div className="mb-4 flex justify-center">
        <HeartPulse
          className="h-12 w-12 text-teal-600"
          aria-hidden
          strokeWidth={1.75}
        />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        MedReviewUI
      </h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Vite, React, Apollo Client, Redux Toolkit, and Tailwind are wired up.
      </p>
      <div className="mt-10 flex justify-center">
        <Link
          to="/doctors"
          className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 active:bg-teal-800"
        >
          Open Portal
        </Link>
      </div>
    </header>
  </div>
)

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
    </Routes>
  </BrowserRouter>
)

export default App
