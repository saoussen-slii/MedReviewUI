import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {  BASE_URL } from './doctorsConstants'

type JsonPlaceholderComment = {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

const Reviews = () => {
  const { doctorId } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<JsonPlaceholderComment[] | null>(null)
console.log("id that we passed in", doctorId)
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const id = doctorId ?? ''
        const res = await fetch(
          `${BASE_URL}/comments?postId=${id}`,
        )
        if (!res.ok) {
          throw new Error(`Could not load comments (${res.status})`)
        }
        const json = (await res.json()) as JsonPlaceholderComment[]
        if (!cancelled) {
          setData(json)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load comments')
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
  }, [doctorId])

  return (
    <div className="min-h-svh bg-slate-50 px-4 py-8 text-slate-900 md:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/doctors"
          className="text-sm font-medium text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline"
        >
          ← Back to doctors
        </Link>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">
          Reviews
        </h1>
        <p className="mt-2 text-sm text-slate-600 md:text-base">
          Doctor ID: {doctorId ?? '—'}
        </p>

        {loading ? (
          <p className="mt-8 text-sm text-slate-600">Loading…</p>
        ) : error ? (
          <p
            className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : (
          <p className="mt-8 whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-white p-4 font-mono text-xs text-slate-800 shadow-sm">
            {JSON.stringify(data, null, 2)}
          </p>
        )}
      </div>
    </div>
  )
}

export default Reviews
