import { formatLocalDate } from './dates'

const MOODS = ['calm', 'neutral', 'neutral', 'happy', 'calm', 'anxious', 'sad', 'neutral', 'happy', 'calm']

/**
 * Build a realistic set of demo mood logs for the last `days` days.
 * Dates are local YYYY-MM-DD so streaks and charts behave correctly.
 */
export const buildDemoMoodLogs = (days = 30) => {
  const logs = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const date = formatLocalDate(d)
    const mood = MOODS[(days - i) % MOODS.length]
    logs.push({ date, mood, timestamp: d.toISOString() })
  }
  return logs
}

/**
 * A few gentle, realistic journal entries spread over the past week.
 */
export const buildDemoJournalEntries = () => {
  const prompts = [
    "What's been on your mind today?",
    "What are three things you're grateful for right now?",
    "How did you take care of yourself today?",
  ]
  const contents = [
    "Today was a mixed day. I felt a bit overwhelmed in the morning, but the breathing exercise helped me reset before my classes.",
    "Grateful for good friends who check in, a warm cup of chai, and the quiet time to read this evening.",
    "I took a short walk after dinner and did a 5-minute journal. Small steps, but they add up.",
  ]
  return prompts.map((prompt, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (i + 1))
    return { id: Date.now() - i, date: d.toISOString(), content: contents[i], prompt, reframe: null }
  })
}

/**
 * A few starter plants for the habit garden at varied growth stages.
 */
export const buildDemoPlants = () => {
  const now = Date.now()
  return [
    { id: now - 3, type: 'sunflower', name: 'Sunflower', emoji: '🌻', growth: 60, lastWatered: new Date(now - 86400000 * 1).toISOString() },
    { id: now - 2, type: 'tulip', name: 'Tulip', emoji: '🌷', growth: 40, lastWatered: new Date(now - 86400000 * 2).toISOString() },
    { id: now - 1, type: 'cactus', name: 'Cactus', emoji: '🌵', growth: 20, lastWatered: new Date(now - 86400000 * 1).toISOString() },
  ]
}

export const DEMO_DATA_KEYS = ['moodLogs', 'journalEntries', 'gardenPlants']
