import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Trash2, Sparkles, Plus, X, BookOpen, Mic, MicOff, StopCircle } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import useLocalStorage from '../hooks/useLocalStorage'
import { useToast } from '../hooks/useToast'
import { journalPrompts } from '../data/mockData'

const reframeRules = [
  { pattern: /never|always|nothing|everything/i, advice: "Try to avoid 'all-or-nothing' thinking. Is there a middle ground?" },
  { pattern: /should|must|ought/i, advice: "Consider replacing 'should' with 'it would be nice if'. Reduce the pressure." },
  { pattern: /fail|worst|horrible|terrible/i, advice: "This sounds like catastrophizing. What's a more balanced perspective?" },
  { pattern: /my fault|i'm to blame/i, advice: "Is there anything else that contributed to this situation? Be kind to yourself." }
]

const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

const Journal = () => {
  const [entries, setEntries] = useLocalStorage('journalEntries', [], v => Array.isArray(v))
  const [content, setContent] = useState('')
  const [activePrompt, setActivePrompt] = useState(null)
  const [reframedThought, setReframedThought] = useState(null)
  const [showPrompts, setShowPrompts] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)
  const { showToast } = useToast()

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening()
      return
    }

    const SpeechRecognition = getSpeechRecognition()
    if (!SpeechRecognition) {
      showToast("Voice input isn't supported in this browser yet", 'error')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = true
    recognitionRef.current = recognition

    recognition.onresult = (event) => {
      let finalText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += event.results[i][0].transcript
      }
      if (finalText) {
        setContent(prev => {
          const trimmed = finalText.trim()
          return prev ? prev.replace(/\s+$/, '') + ' ' + trimmed : trimmed
        })
      }
    }

    recognition.onend = () => setIsListening(false)

    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === 'not-allowed') showToast('Microphone permission was denied', 'error')
      else if (event.error === 'no-speech') showToast('No speech detected — try again', 'info')
      else if (event.error === 'network') showToast('Voice input needs a connection — please retry', 'error')
    }

    try {
      recognition.start()
      setIsListening(true)
    } catch {
      setIsListening(false)
      showToast("Couldn't start voice input", 'error')
    }
  }

  useEffect(() => () => { if (recognitionRef.current) recognitionRef.current.stop() }, [])

  const handleReframe = () => {
    const rule = reframeRules.find(r => r.pattern.test(content))
    setReframedThought(rule ? rule.advice : "Think about one small thing you can control right now. How does that change your perspective?")
  }

  const handleSave = () => {
    if (!content.trim()) return
    stopListening()
    setEntries([{ id: Date.now(), date: new Date().toISOString(), content, prompt: activePrompt, reframe: reframedThought }, ...entries])
    setContent('')
    setActivePrompt(null)
    setReframedThought(null)
    showToast('Journal entry saved ✍️', 'success')
  }

  return (
    <div className="max-w-4xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Journal</h1>
        <p className="text-lg" style={{ color: 'var(--on-surface-variant)' }}>Express your thoughts and gain insights</p>
      </div>

      <Card padding="lg">
        {activePrompt && (
          <div className="flex items-center justify-between p-4 mb-5 rounded-[14px]" style={{ backgroundColor: 'color-mix(in srgb, var(--tertiary-container) 20%, transparent)' }}>
            <span className="font-medium" style={{ color: 'var(--tertiary)' }}>{activePrompt}</span>
            <button onClick={() => setActivePrompt(null)} style={{ color: 'var(--tertiary)' }}><X size={18} /></button>
          </div>
        )}

        {!activePrompt && (
          <div className="mb-5">
            <button onClick={() => setShowPrompts(!showPrompts)} className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--primary)' }}>
              <Plus size={14} /> Need a writing prompt?
            </button>
            <AnimatePresence>
              {showPrompts && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 mt-3">
                  {journalPrompts.map((prompt) => (
                    <button key={prompt} onClick={() => { setActivePrompt(prompt); setShowPrompts(false) }}
                      className="px-4 py-2 text-sm rounded-full transition-colors"
                      style={{ backgroundColor: 'var(--surface-container)', color: 'var(--on-surface-variant)' }}>
                      {prompt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="relative">
          <Textarea placeholder="Write your thoughts here..." value={content} onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]" style={{ border: 'none', backgroundColor: 'transparent' }} />
          <button
            onClick={handleVoiceInput}
            title={isListening ? 'Stop dictation' : 'Dictate with your voice'}
            aria-label={isListening ? 'Stop dictation' : 'Start voice dictation'}
            className={`absolute bottom-4 right-4 p-3 rounded-full transition-all active:scale-90 ${isListening ? 'animate-pulse' : ''}`}
            style={{
              backgroundColor: isListening ? 'var(--error)' : 'var(--surface-container)',
              color: isListening ? 'var(--on-error)' : 'var(--primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>
        </div>

        {isListening && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mt-2 text-sm"
            style={{ color: 'var(--error)' }}>
            <MicOff size={14} /> Listening… speak naturally, then tap the mic to stop.
          </motion.div>
        )}

        <div className="flex flex-wrap gap-3 mt-5">
          <Button onClick={handleSave} disabled={!content.trim()} icon={Save}>Save Entry</Button>
          <Button variant="outline" onClick={handleReframe} disabled={!content.trim()} icon={Sparkles}>AI Reframe</Button>
        </div>

        <AnimatePresence>
          {reframedThought && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mt-5 p-5 rounded-[16px]" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-container) 20%, transparent)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} style={{ color: 'var(--primary)' }} />
                <span className="font-semibold" style={{ color: 'var(--primary)' }}>Cognitive Reframing</span>
              </div>
              <p style={{ color: 'var(--on-surface)' }}>{reframedThought}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Past Entries</h2>
        <div className="flex flex-col gap-4">
          {entries.length === 0 && (
            <Card padding="lg" className="text-center py-12">
              <div className="text-5xl mb-4">📓</div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Your journal is ready</h3>
              <p className="mb-1" style={{ color: 'var(--on-surface-variant)' }}>No entries yet — your thoughts deserve a home.</p>
              <p className="text-sm mb-5" style={{ color: 'var(--on-surface-variant)' }}>Start writing above, or pick a prompt to get going.</p>
              <Button variant="outline" onClick={() => { setShowPrompts(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }} icon={BookOpen}>
                Show writing prompts
              </Button>
            </Card>
          )}
          {entries.map((entry) => (
            <Card key={entry.id} padding="md">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  {new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button onClick={() => { setEntries(entries.filter(e => e.id !== entry.id)); showToast('Entry deleted', 'info') }} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--on-surface-variant)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--on-surface-variant)'}>
                  <Trash2 size={16} />
                </button>
              </div>
              {entry.prompt && <p className="text-sm italic mb-2" style={{ color: 'var(--primary)' }}>Prompt: {entry.prompt}</p>}
              <p className="whitespace-pre-wrap" style={{ color: 'var(--on-surface)' }}>{entry.content}</p>
              {entry.reframe && (
                <div className="mt-3 p-4 rounded-[14px]" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-container) 12%, transparent)' }}>
                  <p className="text-sm" style={{ color: 'var(--primary)' }}><strong>Reflection:</strong> {entry.reframe}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Journal
