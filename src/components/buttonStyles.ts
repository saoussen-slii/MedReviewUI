const buttonBase =
  'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

export const buttonVariants = {
  primary: `${buttonBase} bg-teal-600 text-white hover:bg-teal-700 focus-visible:outline-teal-600`,
  outline: `${buttonBase} border border-teal-600 bg-white text-teal-700 hover:bg-teal-50 focus-visible:outline-teal-600`,
  danger: `${buttonBase} bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600`,
} as const

