import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, Calendar, Target, Brain, ArrowRight } from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import useLocalStorage from '../hooks/useLocalStorage'
import { useStreak, useMoodChartData, useMoodDistribution } from '../hooks/useMoodData'
import { formatLocalDate, startOfLocalDay } from '../lib/dates'

const Insights = () => {
  const navigate = useNavigate()
  const [moodLogs] = useLocalStorage('moodLogs', [], v => Array.isArray(v))
  const [journalEntries] = useLocalStorage('journalEntries', [], v => Array.isArray(v))
  const streak = useStreak()
  const weeklyTrend = useMoodChartData()
  const moodDistribution = useMoodDistribution()
  const hasNoData = moodLogs.length === 0 && journalEntries.length === 0

  // Count unique active days in last 7 days
  const activeDaysThisWeek = (() => {
    const activeDates = new Set()
    const cutoff = startOfLocalDay(new Date())
    cutoff.setDate(cutoff.getDate() - 7)
    const inWindow = (dateStr) => {
      if (!dateStr) return false
      const local = startOfLocalDay(dateStr)
      return local !== null && local >= cutoff
    }
    moodLogs.forEach(log => {
      if (inWindow(log.date)) activeDates.add(formatLocalDate(log.date))
    })
    journalEntries.forEach(entry => {
      if (inWindow(entry.date)) activeDates.add(formatLocalDate(entry.date))
    })
    return activeDates.size
  })()

  // Count journal entries in last 7 days
  const journalThisWeek = (() => {
    const cutoff = startOfLocalDay(new Date())
    cutoff.setDate(cutoff.getDate() - 7)
    return journalEntries.filter(entry => {
      if (!entry.date) return false
      const local = startOfLocalDay(entry.date)
      return local !== null && local >= cutoff
    }).length
  })()

  const stats = [
    { icon: Calendar, label: 'Total Check-ins', value: moodLogs.length, color: 'var(--primary-container)', iconColor: 'var(--primary)' },
    { icon: TrendingUp, label: 'Current Streak', value: `${streak} day${streak !== 1 ? 's' : ''}`, color: 'var(--secondary-container)', iconColor: 'var(--secondary)' },
    { icon: Target, label: 'Journal Entries', value: journalEntries.length, color: 'var(--tertiary-container)', iconColor: 'var(--tertiary)' },
    { icon: Brain, label: 'Days Active', value: activeDaysThisWeek, color: 'var(--surface-container-highest)', iconColor: 'var(--on-surface-variant)' },
  ]

  return (
    <div className="max-w-6xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Insights</h1>
        <p className="text-lg" style={{ color: 'var(--on-surface-variant)' }}>Track your wellness journey with detailed analytics</p>
      </div>

      {hasNoData && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card padding="lg" variant="glass">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="text-6xl">📊</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Your insights start with one check-in</h2>
                <p style={{ color: 'var(--on-surface-variant)' }}>Log your mood daily and your trends, streaks, and insights will appear here automatically.</p>
              </div>
              <Button variant="primary" onClick={() => navigate('/app/dashboard')} icon={ArrowRight} iconPosition="right" className="flex-shrink-0">
                Check in now
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card padding="md">
              <div className="inline-flex p-3 rounded-[14px] mb-4" style={{ backgroundColor: `color-mix(in srgb, ${stat.color} 25%, transparent)` }}>
                <stat.icon size={20} style={{ color: stat.iconColor }} />
              </div>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>{stat.value}</div>
              <div className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card padding="lg">
          <CardHeader title="Weekly Mood Trend" subtitle="Your emotional journey this week" icon={TrendingUp} />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="insightsColorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006491" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#006491" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#707880', fontSize: 13 }} />
                <YAxis hide domain={[0, 6]} />
                <Tooltip contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '14px' }} />
                <Area type="monotone" dataKey="score" stroke="#006491" strokeWidth={3} fillOpacity={1} fill="url(#insightsColorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <CardHeader title="Mood Distribution" subtitle="How you've been feeling" icon={Brain} />
          <div className="h-72 flex items-center justify-center">
            {moodLogs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={moodDistribution} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={5} dataKey="value">
                    {moodDistribution.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center" style={{ color: 'var(--on-surface-variant)' }}>
                <p className="text-lg mb-1">No mood data yet</p>
                <p className="text-sm">Start checking in to see your trends</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-5 mt-5">
            {moodDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <CardHeader title="Weekly Summary" subtitle="Your progress this week" icon={Calendar} />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { value: activeDaysThisWeek, label: 'Days Active', color: 'var(--primary)' },
            { value: moodLogs.filter(l => { const cutoff = startOfLocalDay(new Date()); cutoff.setDate(cutoff.getDate() - 7); const local = l.date ? startOfLocalDay(l.date) : null; return local !== null && local >= cutoff }).length, label: 'Mood Check-ins', color: 'var(--secondary)' },
            { value: journalThisWeek, label: 'Journal Entries', color: 'var(--tertiary)' },
          ].map((item) => (
            <div key={item.label} className="text-center p-6 rounded-[18px]" style={{ backgroundColor: 'var(--surface-container-low)' }}>
              <div className="text-4xl font-bold mb-2" style={{ color: item.color, fontFamily: 'var(--font-heading)' }}>{item.value}</div>
              <div className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Insights
