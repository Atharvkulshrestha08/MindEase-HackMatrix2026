import { useMemo } from 'react'
import useLocalStorage from './useLocalStorage'
import { formatLocalDate, startOfLocalDay } from '../lib/dates'

/**
 * Shared hook to compute the mood check-in streak from moodLogs.
 * Returns the current consecutive day streak.
 */
export const useStreak = () => {
  const [moodLogs] = useLocalStorage('moodLogs', [], v => Array.isArray(v))

  const streak = useMemo(() => {
    if (moodLogs.length === 0) return 0
    const loggedDates = new Set(moodLogs.map(l => l.date))
    let currentStreak = 0
    let checkDate = startOfLocalDay()
    if (!loggedDates.has(formatLocalDate(checkDate))) {
      checkDate.setDate(checkDate.getDate() - 1)
    }
    while (true) {
      const dateStr = formatLocalDate(checkDate)
      if (loggedDates.has(dateStr)) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    return currentStreak
  }, [moodLogs])

  return streak
}

/**
 * Shared hook to compute the last 7 days of mood chart data.
 * Returns an array of { name, score } objects for use with Recharts.
 */
export const useMoodChartData = () => {
  const [moodLogs] = useLocalStorage('moodLogs', [], v => Array.isArray(v))

  const chartData = useMemo(() => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const log = moodLogs.find(l => l.date === formatLocalDate(d))
      let score = 3
      if (log) {
        if (log.mood === 'happy' || log.mood === 'calm') score = 5
        if (log.mood === 'neutral') score = 3
        if (log.mood === 'anxious' || log.mood === 'sad') score = 1
      }
      data.push({ name: d.toLocaleDateString('en-US', { weekday: 'short' }), score })
    }
    return data
  }, [moodLogs])

  return chartData
}

/**
 * Shared hook to compute the mood distribution for the pie chart.
 * Returns an array of { name, value, color } objects.
 */
export const useMoodDistribution = () => {
  const [moodLogs] = useLocalStorage('moodLogs', [], v => Array.isArray(v))

  const moodDistribution = useMemo(() => {
    const counts = { happy: 0, calm: 0, neutral: 0, anxious: 0, sad: 0 }
    moodLogs.forEach(log => { if (counts[log.mood] !== undefined) counts[log.mood]++ })
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), value,
      color: name === 'happy' ? '#5DADE2' : name === 'calm' ? '#58D68D' : name === 'neutral' ? '#707880' : name === 'anxious' ? '#F4D03F' : '#EC7063'
    }))
  }, [moodLogs])

  return moodDistribution
}

const MOOD_SCORE = { happy: 5, calm: 5, neutral: 3, anxious: 1, sad: 1 }
const SCORE_TO_MOOD = [
  { max: 1.75, mood: 'anxious', emoji: '😰', label: 'a tougher day' },
  { max: 3.25, mood: 'neutral', emoji: '😐', label: 'a balanced day' },
  { max: 5, mood: 'calm', emoji: '😌', label: 'a lighter day' },
]

/**
 * Shared hook to predict tomorrow's mood from recent moodLogs
 * using a simple linear trend over the last 14 days.
 * Returns null when there is not enough data (fewer than 3 check-ins).
 */
export const useMoodPrediction = () => {
  const [moodLogs] = useLocalStorage('moodLogs', [], v => Array.isArray(v))

  const prediction = useMemo(() => {
    const sorted = [...moodLogs]
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
      .slice(-14)
      .map(log => MOOD_SCORE[log.mood])
      .filter(score => score !== undefined)

    if (sorted.length < 3) return null

    const n = sorted.length
    const xMean = (n - 1) / 2
    const yMean = sorted.reduce((sum, s) => sum + s, 0) / n

    let numerator = 0
    let denominator = 0
    sorted.forEach((score, i) => {
      numerator += (i - xMean) * (score - yMean)
      denominator += (i - xMean) * (i - xMean)
    })

    const slope = denominator === 0 ? 0 : numerator / denominator
    const predictedScore = Math.min(5, Math.max(1, yMean + slope * (n - xMean)))
    const predicted = SCORE_TO_MOOD.find(bucket => predictedScore <= bucket.max) || SCORE_TO_MOOD[SCORE_TO_MOOD.length - 1]
    const trend = slope > 0.25 ? 'improving' : slope < -0.25 ? 'needs a little care' : 'steady'

    return { predictedScore, mood: predicted.mood, emoji: predicted.emoji, label: predicted.label, trend }
  }, [moodLogs])

  return prediction
}

export default useStreak
