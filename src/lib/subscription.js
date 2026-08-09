const FREE_SONG_LIMIT = 20
const RESET_DAYS = 45
const PLAN_KEY = 'mindease_plan'
const USAGE_KEY = 'mindease_song_usage'

const DAY_MS = 24 * 60 * 60 * 1000

export const getPlan = () => {
  try {
    return localStorage.getItem(PLAN_KEY) || 'free'
  } catch {
    return 'free'
  }
}

export const setPlan = (plan) => {
  try {
    localStorage.setItem(PLAN_KEY, plan === 'premium' ? 'premium' : 'free')
  } catch { /* noop */ }
}

export const isPremium = () => getPlan() === 'premium'

const getSongUsage = () => {
  let usage = null
  try {
    usage = JSON.parse(localStorage.getItem(USAGE_KEY))
  } catch { /* noop */ }
  const now = Date.now()
  if (!usage || typeof usage.count !== 'number' || typeof usage.windowStart !== 'number') {
    usage = { count: 0, windowStart: now }
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
    return usage
  }
  if (now - usage.windowStart >= RESET_DAYS * DAY_MS) {
    usage = { count: 0, windowStart: now }
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
  }
  return usage
}

export const getSongsRemaining = () => {
  if (isPremium()) return Infinity
  const usage = getSongUsage()
  return Math.max(0, FREE_SONG_LIMIT - usage.count)
}

export const getSongsUsed = () => {
  if (isPremium()) return Infinity
  const usage = getSongUsage()
  return Math.min(FREE_SONG_LIMIT, usage.count)
}

export const getDaysUntilReset = () => {
  if (isPremium()) return 0
  const usage = getSongUsage()
  const elapsed = Date.now() - usage.windowStart
  const days = Math.ceil((RESET_DAYS * DAY_MS - elapsed) / DAY_MS)
  return Math.max(0, days)
}

export const canPlaySong = () => isPremium() || getSongsRemaining() > 0

export const consumeSong = () => {
  if (isPremium()) return { remaining: Infinity }
  const usage = getSongUsage()
  const count = Math.min(FREE_SONG_LIMIT, usage.count + 1)
  const next = { count, windowStart: usage.windowStart }
  localStorage.setItem(USAGE_KEY, JSON.stringify(next))
  return { remaining: FREE_SONG_LIMIT - count }
}

export const resetSongUsage = () => {
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify({ count: 0, windowStart: Date.now() }))
  } catch { /* noop */ }
}

export const getFreeSongLimit = () => FREE_SONG_LIMIT
export const getResetDays = () => RESET_DAYS
