import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { buttonVariants } from './buttonStyles'

export type AddReviewFormPayload = {
  title: string
  email: string
  body: string
}

type AddReviewDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (payload: AddReviewFormPayload) => void
}

const emptyForm: AddReviewFormPayload = {
  title: '',
  email: '',
  body: '',
}

const AddReviewDialog = ({ open, onClose, onSubmit }: AddReviewDialogProps) => {
  const [form, setForm] = useState(emptyForm)

  const canSubmit =
    form.title.trim().length > 0 &&
    form.body.trim().length > 0

  const handleClose = () => {
    setForm(emptyForm)
    onClose()
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      title: form.title.trim(),
      email: form.email.trim(),
      body: form.body.trim(),
    })
    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          className:
            'w-full max-w-lg rounded-xl border border-slate-200/80 bg-white p-0 shadow-lg',
        },
        backdrop: {
          className: 'bg-slate-900/40',
        },
      }}
    >
      <DialogTitle className="border-b border-slate-200/80 px-6 py-4 text-lg font-semibold text-slate-900">
        Add review
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4 px-6 pt-6 pb-2">
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/30"
            placeholder="Reviewer title"
            autoComplete="off"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/30"
            placeholder="email@example.com"
            autoComplete="email"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Body
          <textarea
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            rows={4}
            className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/30"
            placeholder="Write your review…"
          />
        </label>
      </DialogContent>
      <DialogActions className="gap-2 border-t border-slate-200/80 px-6 py-4">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!canSubmit}
          className={`${buttonVariants.primary} disabled:cursor-not-allowed disabled:opacity-50`}
          onClick={handleSubmit}
        >
          Add
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default AddReviewDialog
