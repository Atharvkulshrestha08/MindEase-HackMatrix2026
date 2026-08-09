const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * Format a date as a local YYYY-MM-DD string.
 * Accepts a Date, an ISO timestamp, or an existing YYYY-MM-DD string
 * (which is treated as a local calendar date, not UTC).
 * Returns null for invalid dates so callers can guard safely.
 */
export const formatLocalDate = (date = new Date()) => {
  if (typeof date === 'string') {
    const match = date.match(DATE_RE)
    if (match) return date
    return formatLocalDate(new Date(date))
  }
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return null
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Return a local Date set to midnight (00:00:00) for the given date.
 * Accepts a Date, an ISO timestamp, or a YYYY-MM-DD string
 * (which is treated as a local calendar date, not UTC).
 * Returns null for invalid input.
 */
export const startOfLocalDay = (date = new Date()) => {
  if (typeof date === 'string') {
    const match = date.match(DATE_RE)
    if (match) {
      const d = new Date()
      d.setFullYear(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
      d.setHours(0, 0, 0, 0)
      return d
    }
    return startOfLocalDay(new Date(date))
  }
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return null
  d.setHours(0, 0, 0, 0)
  return d
}
