import useLocalStorage from './useLocalStorage'

export const PROFILE_GOALS = [
  { id: 'stress', label: 'Reduce stress', emoji: '🧘', description: 'Calm the mind with breathing & grounding' },
  { id: 'sleep', label: 'Better sleep', emoji: '😴', description: 'Wind down with calming sounds & routines' },
  { id: 'focus', label: 'Focus & productivity', emoji: '🎯', description: 'Stay sharp with focus timers & music' },
  { id: 'mindfulness', label: 'Build mindfulness', emoji: '🌱', description: 'Daily check-ins and journaling habits' },
  { id: 'exploring', label: 'Just exploring', emoji: '🧭', description: 'Discover what works best for you' },
]

export const PROFILE_TIMES = ['5 min', '10 min', '15 min', '20 min+']

export const GOAL_ACTIVITIES = {
  stress: { title: '5-min Breathing', description: 'Settle your mind and focus on the present with a guided breath session.', path: '/app/activities' },
  sleep: { title: 'Calm & Sleep Sounds', description: 'Soothing ambience designed to help you wind down before bed.', path: '/app/music' },
  focus: { title: 'Focus Timer', description: 'Pomodoro-style focus sessions to sharpen concentration.', path: '/app/activities' },
  mindfulness: { title: 'Daily Journal', description: 'Reflect on your day with gentle, guided prompts.', path: '/app/journal' },
  exploring: { title: 'Chat with Mind AI', description: 'Talk it out — your AI companion is always here to listen.', path: '/app/companion' },
}

export const useProfile = () => {
  const [profile, setProfile] = useLocalStorage('mindease_profile', null, v => v === null || (typeof v === 'object' && !Array.isArray(v)))

  const isComplete = Boolean(profile && profile.name && profile.goal)

  const saveProfile = (updates) => {
    setProfile({ ...(profile || {}), ...updates, completedAt: new Date().toISOString() })
  }

  const clearProfile = () => setProfile(null)

  return { profile, isComplete, saveProfile, clearProfile }
}
