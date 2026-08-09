import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Wind, Brain, Timer, PersonStanding, Mountain, Play, Pause, RotateCcw, X, CheckCircle2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useToast } from '../hooks/useToast'

const activityTypes = [
  {
    id: 'breathing', title: 'Breathing Exercises', description: 'Calm your mind with guided breathing techniques',
    icon: Wind, color: 'var(--primary-container)', iconColor: 'var(--primary)',
    techniques: [
      { name: '4-7-8 Breathing', inhale: 4, hold: 7, exhale: 8, cycles: 4 },
      { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, cycles: 4 },
      { name: 'Deep Breath', inhale: 5, hold: 2, exhale: 5, cycles: 6 },
    ]
  },
  {
    id: 'meditation', title: 'Meditation', description: 'Find inner peace with guided meditation sessions',
    icon: Brain, color: 'var(--secondary-container)', iconColor: 'var(--secondary)',
    durations: [3, 5, 10]
  },
  {
    id: 'focus', title: 'Focus Timer', description: 'Boost productivity with Pomodoro technique',
    icon: Timer, color: 'var(--tertiary-container)', iconColor: 'var(--tertiary)',
    pomodoro: { work: 25, break: 5 }
  },
  {
    id: 'stretch', title: 'Quick Stretch', description: 'Release tension with a guided stretch routine',
    icon: PersonStanding, color: 'var(--error-container)', iconColor: 'var(--error)',
    stretches: ['Neck Rolls', 'Shoulder Shrugs', 'Side Bend', 'Forward Fold']
  },
  {
    id: 'grounding', title: 'Grounding', description: 'Stay present with the 5-4-3-2-1 technique',
    icon: Mountain, color: 'var(--surface-container-highest)', iconColor: 'var(--on-surface-variant)',
    senses: [
      { count: 5, sense: 'things you can see' },
      { count: 4, sense: 'things you can touch' },
      { count: 3, sense: 'things you can hear' },
      { count: 2, sense: 'things you can smell' },
      { count: 1, sense: 'thing you can taste' },
    ]
  }
]

const Activities = () => {
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [selectedTechnique, setSelectedTechnique] = useState(null)
  const [breathPhase, setBreathPhase] = useState('ready')
  const [currentCycle, setCurrentCycle] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const phaseTimerRef = useRef(null)
  const countdownRef = useRef(null)
  const timeLeftRef = useRef(0)
  const { showToast } = useToast()

  useEffect(() => {
    if (isComplete) showToast('Session complete 🎉', 'success')
  }, [isComplete, showToast])

  // Keep the ref in sync with state so the interval never restarts on each tick
  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])

  // Main countdown timer (single interval, no per-tick re-creation)
  useEffect(() => {
    if (!isActive || isPaused) return

    countdownRef.current = setInterval(() => {
      if (timeLeftRef.current <= 1) {
        clearInterval(countdownRef.current)
        setIsActive(false)
        setIsComplete(true)
        setTimeLeft(0)
      } else {
        timeLeftRef.current -= 1
        setTimeLeft(timeLeftRef.current)
      }
    }, 1000)

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [isActive, isPaused])

  // Breathing phase cycling
  useEffect(() => {
    if (selectedActivity?.id !== 'breathing' || breathPhase === 'ready' || isPaused || !isActive) return

    const technique = selectedTechnique
    if (!technique) return

    const durations = {
      inhale: technique.inhale * 1000,
      hold: technique.hold * 1000,
      exhale: technique.exhale * 1000,
    }

    const nextPhase = { inhale: 'hold', hold: 'exhale', exhale: 'inhale' }
    
    phaseTimerRef.current = setTimeout(() => {
      const next = nextPhase[breathPhase]
      if (next === 'inhale') {
        setCurrentCycle(prev => prev + 1)
      }
      setBreathPhase(next)
    }, durations[breathPhase])

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
    }
  }, [breathPhase, isPaused, isActive, selectedActivity, selectedTechnique])

  const handleStart = (activity, technique = null) => {
    setSelectedActivity(activity)
    setSelectedTechnique(technique)
    setIsActive(true)
    setIsPaused(false)
    setIsComplete(false)
    setCurrentCycle(0)
    if (activity.id === 'breathing' && technique) {
      const total = (technique.inhale + technique.hold + technique.exhale) * technique.cycles
      setTimeLeft(total)
      setTotalTime(total)
    } else if (activity.id === 'focus') {
      setTimeLeft(activity.pomodoro.work * 60)
      setTotalTime(activity.pomodoro.work * 60)
    } else {
      setTimeLeft(3 * 60)
      setTotalTime(3 * 60)
    }
  }

  const handleStop = () => {
    setIsActive(false)
    setIsPaused(false)
    setSelectedActivity(null)
    setSelectedTechnique(null)
    setTimeLeft(0)
    setTotalTime(0)
    setBreathPhase('ready')
    setCurrentCycle(0)
    setIsComplete(false)
    if (countdownRef.current) clearInterval(countdownRef.current)
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
  }

  const handleTogglePause = () => {
    setIsPaused(prev => !prev)
  }

  const handleStartBreathing = () => {
    setBreathPhase('inhale')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  // Breathing exercise view
  if (selectedActivity?.id === 'breathing' && (isActive || isComplete)) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card padding="xl" className="text-center relative">
          <button onClick={handleStop} className="absolute top-6 left-6 p-2 rounded-[12px] transition-colors" style={{ color: 'var(--on-surface-variant)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-container)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <X size={22} />
          </button>
          
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
            {selectedTechnique?.name || 'Breathing'}
          </h2>

          {selectedTechnique && !isComplete && (
            <p className="text-sm mb-8" style={{ color: 'var(--on-surface-variant)' }}>
              Cycle {Math.min(currentCycle + 1, selectedTechnique.cycles)} of {selectedTechnique.cycles}
            </p>
          )}

          {isComplete ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12">
              <CheckCircle2 size={72} style={{ color: 'var(--secondary)', margin: '0 auto' }} strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mt-6 mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
                Well Done! 🎉
              </h3>
              <p className="text-lg mb-8" style={{ color: 'var(--on-surface-variant)' }}>
                You completed {selectedTechnique?.name}. Take a moment to notice how you feel.
              </p>
              <Button onClick={handleStop} size="lg">Back to Activities</Button>
            </motion.div>
          ) : (
            <>
              <div className="relative w-56 h-56 mx-auto mb-6">
                <motion.div
                  animate={{ scale: breathPhase === 'inhale' ? 1.3 : breathPhase === 'exhale' ? 0.8 : 1 }}
                  transition={{ duration: breathPhase === 'inhale' ? selectedTechnique?.inhale : breathPhase === 'exhale' ? selectedTechnique?.exhale : selectedTechnique?.hold, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--primary-container) 35%, transparent)' }}
                />
                <motion.div
                  animate={{ scale: breathPhase === 'inhale' ? 1.2 : breathPhase === 'exhale' ? 0.9 : 1 }}
                  transition={{ duration: breathPhase === 'inhale' ? selectedTechnique?.inhale : breathPhase === 'exhale' ? selectedTechnique?.exhale : selectedTechnique?.hold, ease: 'easeInOut' }}
                  className="absolute inset-5 rounded-full"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--primary-container) 55%, transparent)' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold capitalize" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                    {breathPhase === 'ready' ? 'Press Start' : breathPhase}
                  </span>
                </div>
              </div>

              {/* Progress ring */}
              <div className="w-full h-2 rounded-full overflow-hidden mb-4 mx-auto max-w-xs" style={{ backgroundColor: 'var(--surface-container-highest)' }}>
                <motion.div 
                  className="h-full rounded-full" 
                  style={{ backgroundColor: 'var(--primary)', width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <p className="text-xl mb-8" style={{ color: 'var(--on-surface-variant)' }}>{formatTime(timeLeft)}</p>

              <div className="flex justify-center gap-4">
                {breathPhase === 'ready' ? (
                  <Button onClick={handleStartBreathing} size="lg" icon={Play} iconPosition="left">
                    Start
                  </Button>
                ) : (
                  <Button onClick={handleTogglePause} size="lg">
                    {isPaused ? <Play size={22} /> : <Pause size={22} />}
                  </Button>
                )}
                <Button variant="outline" onClick={handleStop} size="lg">
                  <RotateCcw size={22} />
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    )
  }

  // Generic timer view (meditation, focus, stretch)
  if (selectedActivity && selectedActivity.id !== 'breathing' && (isActive || isComplete)) {
    const activityInfo = activityTypes.find(a => a.id === selectedActivity.id)
    return (
      <div className="max-w-2xl mx-auto">
        <Card padding="xl" className="text-center relative">
          <button onClick={handleStop} className="absolute top-6 left-6 p-2 rounded-[12px] transition-colors" style={{ color: 'var(--on-surface-variant)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-container)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <X size={22} />
          </button>
          
          <div className="inline-flex p-4 rounded-[16px] mb-5" style={{ backgroundColor: `color-mix(in srgb, ${activityInfo.color} 25%, transparent)` }}>
            <activityInfo.icon size={32} style={{ color: activityInfo.iconColor }} />
          </div>

          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
            {activityInfo.title}
          </h2>

          {isComplete ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-8">
              <CheckCircle2 size={72} style={{ color: 'var(--secondary)', margin: '0 auto' }} strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mt-6 mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
                Session Complete! 🎉
              </h3>
              <p className="text-lg mb-8" style={{ color: 'var(--on-surface-variant)' }}>
                Great job staying focused. You earned it!
              </p>
              <Button onClick={handleStop} size="lg">Back to Activities</Button>
            </motion.div>
          ) : (
            <>
              <div className="w-full h-2 rounded-full overflow-hidden my-6 mx-auto max-w-xs" style={{ backgroundColor: 'var(--surface-container-highest)' }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ backgroundColor: activityInfo.iconColor, width: `${progress}%` }} />
              </div>

              <p className="text-5xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>{formatTime(timeLeft)}</p>

              <div className="flex justify-center gap-4">
                <Button onClick={handleTogglePause} size="lg">
                  {isPaused ? <Play size={22} /> : <Pause size={22} />}
                </Button>
                <Button variant="outline" onClick={handleStop} size="lg">
                  <RotateCcw size={22} />
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
          Activities
        </h1>
        <p className="text-lg" style={{ color: 'var(--on-surface-variant)' }}>
          Choose an activity to boost your wellness
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activityTypes.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card padding="lg" className="h-full">
              <div className="inline-flex p-4 rounded-[16px] mb-5" style={{ backgroundColor: `color-mix(in srgb, ${activity.color} 25%, transparent)` }}>
                <activity.icon size={26} style={{ color: activity.iconColor }} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
                {activity.title}
              </h3>
              <p className="mb-6" style={{ color: 'var(--on-surface-variant)' }}>{activity.description}</p>

              {activity.id === 'breathing' && (
                <div className="flex flex-col gap-3">
                  {activity.techniques.map((technique) => (
                    <button key={technique.name} onClick={() => handleStart(activity, technique)}
                      className="w-full p-4 rounded-[14px] text-left transition-colors"
                      style={{ backgroundColor: 'var(--surface-container-low)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-container)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-container-low)'}>
                      <span className="font-semibold block" style={{ color: 'var(--on-surface)' }}>{technique.name}</span>
                      <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{technique.inhale}-{technique.hold}-{technique.exhale} pattern</span>
                    </button>
                  ))}
                </div>
              )}

              {activity.id === 'focus' && (
                <Button onClick={() => handleStart(activity)} fullWidth icon={Timer}>Start 25-min Focus</Button>
              )}

              {activity.id === 'stretch' && (
                <div className="flex flex-col gap-3">
                  {activity.stretches.map((stretch) => (
                    <div key={stretch} className="p-4 rounded-[14px]" style={{ backgroundColor: 'var(--surface-container-low)', color: 'var(--on-surface)' }}>
                      {stretch}
                    </div>
                  ))}
                  <Button onClick={() => handleStart(activity)} fullWidth className="mt-2">Start Routine</Button>
                </div>
              )}

              {activity.id === 'meditation' && (
                <div className="flex gap-3">
                  {activity.durations.map((dur) => (
                    <Button key={dur} variant="outline" onClick={() => {
                      const meditationActivity = { ...activity }
                      setTimeLeft(dur * 60)
                      setTotalTime(dur * 60)
                      setSelectedActivity(meditationActivity)
                      setIsActive(true)
                      setIsPaused(false)
                      setIsComplete(false)
                    }} className="flex-1">{dur} min</Button>
                  ))}
                </div>
              )}

              {activity.id === 'grounding' && (
                <div className="flex flex-col gap-3">
                  {activity.senses.map((item) => (
                    <div key={item.count} className="flex items-center gap-4 p-3">
                      <span className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--primary-container) 25%, transparent)', color: 'var(--primary)' }}>
                        {item.count}
                      </span>
                      <span style={{ color: 'var(--on-surface-variant)' }}>{item.sense}</span>
                    </div>
                  ))}
                  <Button onClick={() => handleStart(activity)} fullWidth className="mt-2">Start Grounding</Button>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Activities
