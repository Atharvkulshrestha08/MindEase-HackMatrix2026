import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react'
import Button from '../components/ui/Button'
import { PROFILE_GOALS, PROFILE_TIMES } from '../hooks/useProfile'

const OnboardingModal = ({ initialName = '', onComplete }) => {
  const [step, setStep] = useState(0)
  const [name, setName] = useState(initialName)
  const [goal, setGoal] = useState(null)
  const [time, setTime] = useState('10 min')

  const canContinue = step === 0 ? name.trim().length > 0 : step === 1 ? goal : true

  const handleNext = () => {
    if (step === 2) {
      onComplete({ name: name.trim(), goal: goal.id, time })
      return
    }
    setStep(step + 1)
  }

  const handleSkip = () => {
    onComplete({ name: name.trim() || initialName || 'there', goal: 'exploring', time })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Personalize your experience">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(8, 6, 13, 0.6)', backdropFilter: 'blur(6px)' }} onClick={() => {}} />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative w-full max-w-xl rounded-[28px] shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--surface-container-lowest)' }}
      >
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--tertiary))' }} />

        <div className="p-8 md:p-10">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--primary)' }}>Personalize your journey</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }} transition={{ duration: 0.25 }}>
              {step === 0 && (
                <div>
                  <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>What should we call you?</h2>
                  <p className="mb-6" style={{ color: 'var(--on-surface-variant)' }}>We'll use it to personalize your greetings and recommendations.</p>
                  <input
                    type="text"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && canContinue && handleNext()}
                    placeholder="Your first name"
                    className="w-full px-5 py-4 rounded-2xl text-lg focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', '--tw-ring-color': 'rgba(0,100,145,0.25)' }}
                  />
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>What's your main goal?</h2>
                  <p className="mb-6" style={{ color: 'var(--on-surface-variant)' }}>We'll tailor your daily recommendations around it.</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {PROFILE_GOALS.map((g) => (
                      <button key={g.id} onClick={() => setGoal(g)}
                        className={`flex items-start gap-3 p-4 rounded-2xl text-left transition-all ${goal?.id === g.id ? 'ring-2' : ''}`}
                        style={{
                          backgroundColor: goal?.id === g.id ? 'color-mix(in srgb, var(--primary-container) 25%, transparent)' : 'var(--surface-container-low)',
                          border: '1px solid var(--outline-variant)',
                          '--tw-ring-color': 'var(--primary)',
                        }}>
                        <span className="text-2xl">{g.emoji}</span>
                        <span>
                          <span className="block font-semibold" style={{ color: 'var(--on-surface)' }}>{g.label}</span>
                          <span className="block text-xs mt-0.5" style={{ color: 'var(--on-surface-variant)' }}>{g.description}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>How much time do you have daily?</h2>
                  <p className="mb-6" style={{ color: 'var(--on-surface-variant)' }}>Wellness works best in small, consistent steps.</p>
                  <div className="flex flex-wrap gap-3">
                    {PROFILE_TIMES.map((t) => (
                      <button key={t} onClick={() => setTime(t)}
                        className="px-6 py-3 rounded-2xl font-semibold transition-all"
                        style={{
                          backgroundColor: time === t ? 'var(--primary)' : 'var(--surface-container-low)',
                          color: time === t ? 'var(--on-primary)' : 'var(--on-surface)',
                          border: '1px solid var(--outline-variant)',
                        }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} icon={ArrowLeft} iconPosition="left" className="px-4">
              Back
            </Button>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2 h-2 rounded-full transition-colors" style={{ backgroundColor: i === step ? 'var(--primary)' : 'var(--outline-variant)' }} />
              ))}
            </div>
            <Button variant="primary" onClick={handleNext} disabled={!canContinue} icon={step === 2 ? Check : ArrowRight} iconPosition="right" className="px-5">
              {step === 2 ? 'Get Started' : 'Continue'}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={handleSkip}
              className="text-sm font-medium underline underline-offset-4 transition-colors"
              style={{ color: 'var(--on-surface-variant)' }}
            >
              Skip onboarding for now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OnboardingModal
