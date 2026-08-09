import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartPulse, X, Wind, Music, Phone, ArrowLeft, AlarmClock } from 'lucide-react'
import { emergencyResources } from '../data/mockData'
import { startAlarm, stopAlarm } from '../lib/alarm'

const BREATH_SECONDS = { in: 4, hold: 4, out: 6 }

const BreathingSession = ({ onExit }) => {
  const [phase, setPhase] = useState('in')

  useEffect(() => {
    const order = ['in', 'hold', 'out']
    let i = 0
    let timer
    const run = () => {
      setPhase(order[i])
      timer = setTimeout(() => {
        i = (i + 1) % order.length
        run()
      }, BREATH_SECONDS[order[i]] * 1000)
    }
    run()
    return () => clearTimeout(timer)
  }, [])

  const scale = phase === 'in' ? 1 : phase === 'hold' ? 1.35 : 1
  const label = phase === 'in' ? 'Breathe in' : phase === 'hold' ? 'Hold' : 'Breathe out'

  return (
    <div className="p-8 md:p-10 text-center">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: 'var(--on-surface-variant)' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>Guided Breathing</span>
      </div>

      <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary) 8%, transparent)' }} />
        <motion.div
          animate={{ scale }}
          transition={{ duration: BREATH_SECONDS[phase], ease: 'easeInOut' }}
          className="w-32 h-32 rounded-full flex items-center justify-center"
          style={{ background: 'radial-gradient(circle, var(--secondary), color-mix(in srgb, var(--secondary) 60%, transparent))', boxShadow: '0 12px 40px rgba(0,109,61,0.35)' }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">{label}</span>
      </div>

      <p className="mt-8 text-sm" style={{ color: 'var(--on-surface-variant)' }}>
        In for 4 · Hold for 4 · Out for 6. Follow the circle.
      </p>
    </div>
  )
}

const SOSButton = () => {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState('menu')
  const [alarmOn, setAlarmOn] = useState(false)
  const navigate = useNavigate()

  const openSOS = () => {
    setOpen(true)
    setView('menu')
    setAlarmOn(true)
    startAlarm()
  }

  const closeSOS = () => {
    setOpen(false)
    setAlarmOn(false)
    stopAlarm()
  }

  const toggleAlarm = () => {
    if (alarmOn) {
      setAlarmOn(false)
      stopAlarm()
    } else {
      setAlarmOn(true)
      startAlarm()
    }
  }

  const go = (path) => {
    closeSOS()
    setView('menu')
    navigate(path)
  }

  useEffect(() => {
    return () => stopAlarm()
  }, [])

  return (
    <>
      <button
        onClick={openSOS}
        aria-label="Emergency support"
        className="fixed right-5 bottom-28 md:bottom-7 md:right-7 z-[90] group"
      >
        <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: 'var(--error)' }} />
        <motion.span
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg"
          style={{ backgroundColor: 'var(--error)', boxShadow: '0 8px 24px rgba(186,26,26,0.4)' }}
        >
          <HeartPulse size={26} />
        </motion.span>
        <span className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg"
          style={{ backgroundColor: 'var(--on-surface)', color: 'var(--surface)' }}>
          Need support?
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Emergency support">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(8, 6, 13, 0.65)', backdropFilter: 'blur(6px)' }}
              onClick={closeSOS}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="relative w-full max-w-md rounded-[28px] shadow-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--surface-container-lowest)' }}
            >
              <button onClick={closeSOS} className="absolute top-4 right-4 p-2 rounded-full transition-colors" style={{ color: 'var(--on-surface-variant)' }} aria-label="Close">
                <X size={20} />
              </button>

              <button
                onClick={toggleAlarm}
                className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: alarmOn ? 'color-mix(in srgb, var(--error) 14%, transparent)' : 'var(--surface-container)',
                  color: alarmOn ? 'var(--error)' : 'var(--on-surface-variant)',
                  border: `1px solid ${alarmOn ? 'color-mix(in srgb, var(--error) 30%, transparent)' : 'var(--outline-variant)'}`,
                }}
                aria-label={alarmOn ? 'Stop alarm' : 'Start alarm'}
              >
                <span className={`inline-block w-2 h-2 rounded-full ${alarmOn ? 'animate-pulse' : ''}`} style={{ backgroundColor: alarmOn ? 'var(--error)' : 'var(--on-surface-variant)' }} />
                {alarmOn ? 'Alarm on — tap to silence' : 'Alarm silenced — tap to sound'}
              </button>

              {view === 'breathe' ? (
                <BreathingSession onExit={() => setView('menu')} />
              ) : (
                <div className="p-8 md:p-10">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 12%, transparent)' }}>
                    <HeartPulse size={28} style={{ color: 'var(--error)' }} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
                    Need support right now?
                  </h2>
                  <p className="mb-7" style={{ color: 'var(--on-surface-variant)' }}>You're not alone. Here's what can help you right now.</p>

                  {alarmOn && (
                    <div className="mb-5 flex items-center gap-3 p-3 rounded-2xl" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--error) 20%, transparent)' }}>
                      <AlarmClock size={18} style={{ color: 'var(--error)' }} className="animate-pulse" />
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
                        The alarm is sounding to get attention from people nearby. Tap <span className="font-semibold" style={{ color: 'var(--error)' }}>Alarm on</span> at the top to silence it at any time.
                      </p>
                    </div>
                  )}

                  <div className="grid gap-3">
                    <button onClick={() => setView('breathe')} className="flex items-center gap-4 p-4 rounded-2xl text-left transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--secondary) 10%, transparent)', border: '1px solid var(--outline-variant)' }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--secondary)' }}>
                        <Wind size={22} color="white" />
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--on-surface)' }}>Breathe with me</p>
                        <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>60 seconds of guided breathing, right here</p>
                      </div>
                    </button>

                    <button onClick={() => go('/app/music')} className="flex items-center gap-4 p-4 rounded-2xl text-left transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)', border: '1px solid var(--outline-variant)' }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}>
                        <Music size={22} color="white" />
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--on-surface)' }}>Calming sounds</p>
                        <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>Ambient music to help you settle</p>
                      </div>
                    </button>

                    <div className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--error)' }}>
                          <Phone size={22} color="white" />
                        </div>
                        <p className="font-semibold" style={{ color: 'var(--on-surface)' }}>Talk to someone 24/7</p>
                      </div>
                      <div className="space-y-2">
                        {emergencyResources.map(r => (
                          <div key={r.name} className="flex items-center justify-between text-sm">
                            <span style={{ color: 'var(--on-surface)' }}>{r.name}</span>
                            <a href={`tel:${r.number.replace(/[^0-9]/g, '')}`} className="font-bold" style={{ color: 'var(--error)' }}>{r.number}</a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SOSButton
