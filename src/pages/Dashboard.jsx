import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, Flame, BookOpen, Music, Activity, ArrowRight, Sparkles } from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import MoodSelector from '../components/ui/MoodSelector'
import useLocalStorage from '../hooks/useLocalStorage'
import { useAuth } from '../hooks/useAuth'
import { useProfile, GOAL_ACTIVITIES } from '../hooks/useProfile'
import { useMoodPrediction } from '../hooks/useMoodData'
import { useToast } from '../hooks/useToast'
import MentalHealthWall from '../components/ui/ParallaxMarquee'
import { formatLocalDate, startOfLocalDay } from '../lib/dates'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile } = useProfile()
  const { showToast } = useToast()
  const prediction = useMoodPrediction()
  const [moodLogs, setMoodLogs] = useLocalStorage('moodLogs', [], v => Array.isArray(v))
  const today = formatLocalDate()

  const todaysMood = useMemo(() => {
    return moodLogs.find(log => log.date === today)?.mood || null
  }, [moodLogs, today])

  const handleMoodSelect = (mood) => {
    const newLog = { date: today, mood, timestamp: new Date().toISOString() }
    const filteredLogs = moodLogs.filter(log => log.date !== today)
    setMoodLogs([...filteredLogs, newLog])
    showToast(todaysMood ? 'Mood updated ✨' : 'Mood saved! Keep the habit going 🌱', 'success')
  }

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

  const displayName = profile?.name || user?.user_metadata?.full_name?.split(' ')[0] || 'there'
  const recommended = GOAL_ACTIVITIES[profile?.goal] || GOAL_ACTIVITIES.exploring

  const quickActions = [
    { icon: Activity, label: 'Breathing', path: '/app/activities', gradient: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, white), color-mix(in srgb, var(--primary) 4%, white))', iconColor: 'var(--primary)', borderColor: 'var(--primary)' },
    { icon: BookOpen, label: 'Journal', path: '/app/journal', gradient: 'linear-gradient(135deg, color-mix(in srgb, var(--secondary) 10%, white), color-mix(in srgb, var(--secondary) 4%, white))', iconColor: 'var(--secondary)', borderColor: 'var(--secondary)' },
    { icon: Music, label: 'Music', path: '/app/music', gradient: 'linear-gradient(135deg, color-mix(in srgb, var(--tertiary) 10%, white), color-mix(in srgb, var(--tertiary) 4%, white))', iconColor: 'var(--tertiary)', borderColor: 'var(--tertiary)' },
    { icon: Sparkles, label: 'AI Chat', path: '/app/companion', gradient: 'linear-gradient(135deg, color-mix(in srgb, var(--on-surface) 5%, white), color-mix(in srgb, var(--on-surface) 2%, white))', iconColor: 'var(--on-surface-variant)', borderColor: 'var(--outline-variant)' },
  ]

  return (
    <div className="max-w-6xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome & Mood */}
      <Card padding="xl" variant="glass">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', letterSpacing: '-0.03em' }}
            >
              How are you feeling, <span style={{ color: 'var(--primary)' }}>{displayName}</span>?
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--on-surface-variant)' }}>
              Your mood check-in helps us personalize your wellness journey.
            </p>
            <MoodSelector selectedMood={todaysMood} onSelect={handleMoodSelect} />
          </div>
          
          <div className="relative w-40 h-40 md:w-52 md:h-52 flex-shrink-0">
            <div className="absolute inset-0 rounded-full animate-breathe" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 12%, transparent), transparent)' }} />
            <div className="absolute inset-4 rounded-full animate-breathe" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 20%, transparent), transparent)', animationDelay: '1s' }} />
            <div className="absolute inset-8 rounded-full animate-breathe" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 30%, transparent), transparent)', animationDelay: '2s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl md:text-7xl">
                {todaysMood === 'happy' ? '😊' : 
                 todaysMood === 'calm' ? '😌' :
                 todaysMood === 'anxious' ? '😰' :
                 todaysMood === 'sad' ? '😔' : '🧘'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions + Streak */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card
              variant="glass"
              hover
              padding="md"
              className="cursor-pointer"
              onClick={() => navigate(action.path)}
            >
              <div 
                className="inline-flex p-3.5 rounded-[var(--radius-lg)] mb-4"
                style={{ background: action.gradient }}
              >
                <action.icon size={24} style={{ color: action.iconColor }} strokeWidth={1.8} />
              </div>
              <h4 className="text-sm font-semibold" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>
                {action.label}
              </h4>
            </Card>
          </motion.div>
        ))}

        {/* Streak Card */}
        <Card variant="primary" padding="md" className="col-span-2 lg:col-span-1">
          <div className="flex flex-col items-center text-center py-2">
            <Flame size={32} className="mb-3" strokeWidth={1.8} />
            <div className="text-5xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>{streak}</div>
            <div className="text-sm" style={{ opacity: 0.9 }}>Day Streak</div>
          </div>
        </Card>
      </div>

      {/* Chart + Activity */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Weekly Chart */}
        <Card padding="lg" className="lg:col-span-8" variant="glass">
          <CardHeader title="Weekly Balance" subtitle="Your mood trends this week" icon={TrendingUp} />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006491" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#006491" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8892a0', fontSize: 12, fontFamily: 'Inter' }} dy={10} />
                <YAxis hide domain={[0, 6]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(0,20,40,0.12)',
                    padding: '14px',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#006491" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {prediction && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 rounded-[14px] flex items-center gap-3"
              style={{ backgroundColor: 'color-mix(in srgb, var(--primary-container) 18%, transparent)' }}>
              <span className="text-3xl">{prediction.emoji}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>
                  Tomorrow looks like {prediction.label}
                </p>
                <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  Your mood trend is {prediction.trend} — {prediction.trend === 'improving' ? 'keep up the great habits 🌱' : prediction.trend === 'needs a little care' ? 'try a grounding exercise today 🧘' : 'stay consistent with your routine ✨'}
                </p>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Recommended Activity */}
        <Card variant="secondary" padding="lg" className="lg:col-span-4">
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold" style={{ opacity: 0.8, letterSpacing: '0.08em' }}>
                Recommended for You
              </span>
              <h3 className="text-2xl font-bold mt-3 mb-3" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>{recommended.title}</h3>
              <p className="text-base" style={{ opacity: 0.9, lineHeight: 1.7 }}>
                {recommended.description}
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-8"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}
              onClick={() => navigate(recommended.path)}
              icon={ArrowRight}
              iconPosition="right"
            >
              Start Now
            </Button>
          </div>
        </Card>
      </div>

      {/* Community Preview */}
      <Card padding="lg" variant="glass">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex -space-x-3">
              {['😊', '🌟', '💪'].map((emoji, i) => (
                <div 
                  key={i}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, white), color-mix(in srgb, var(--secondary) 6%, white))',
                    border: '2.5px solid var(--surface-container-lowest)',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>You're not alone in this</p>
              <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>Join today's community check-in</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/app/community')}
            icon={ArrowRight}
            iconPosition="right"
          >
            Join Now
          </Button>
        </div>
      </Card>

      <MentalHealthWall />
    </div>
  )
}

export default Dashboard
