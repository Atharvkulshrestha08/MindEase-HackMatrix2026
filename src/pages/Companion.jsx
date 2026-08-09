import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Wifi, WifiOff, AlertTriangle, Phone } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { mockCompanionResponses } from '../data/mockData'
import { getCompanionReply, isAIConfigured } from '../lib/companionAI'
import useLocalStorage from '../hooks/useLocalStorage'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { useStreak } from '../hooks/useMoodData'

const HELPLINES = [
  { name: 'iCall', number: '9152987821' },
  { name: 'AASRA', number: '9820466726' },
  { name: 'Vandrevala Foundation', number: '18602662345' },
]

const Companion = () => {
  const [messages, setMessages] = useLocalStorage('companionMessages', [], v => Array.isArray(v))
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState(null)
  const [isSafetyFlagged, setIsSafetyFlagged] = useState(false)
  const messagesEndRef = useRef(null)
  const hasGreeted = useRef(false)
  const { user } = useAuth()
  const { profile } = useProfile()
  const streak = useStreak()
  const [moodLogs] = useLocalStorage('moodLogs', [], v => Array.isArray(v))
  const [journalEntries] = useLocalStorage('journalEntries', [], v => Array.isArray(v))

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'friend'

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])
  useEffect(() => {
    if (hasGreeted.current) return
    hasGreeted.current = true
    if (messages.length === 0) {
      setMessages([{ id: Date.now(), role: 'assistant', content: mockCompanionResponses.greeting[0], timestamp: new Date().toISOString() }])
    }
    setMode(isAIConfigured() ? 'ai' : 'mock')
  }, [messages.length, setMessages])

  const handleSend = async (overrideText) => {
    const text = overrideText || input
    if (!text.trim() || isTyping) return
    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    const { content, source } = await getCompanionReply({
      messages: [...messages, userMsg],
      context: {
        userName,
        goal: profile?.goal || '',
        streak,
        moodLogs,
        journalEntries,
      },
    })
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content, timestamp: new Date().toISOString() }])
    setIsTyping(false)
    setMode(source === 'ai' ? 'ai' : 'mock')
    if (source === 'safety') setIsSafetyFlagged(true)
  }

  const quickReplies = ["I'm feeling stressed", "I need help focusing", "I can't sleep", "I'm feeling good today"]

  return (
    <div className="max-w-4xl mx-auto flex flex-col" style={{ height: 'calc(100dvh - 200px)' }}>
      <div className="mb-5">
        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
          <Bot size={30} style={{ color: 'var(--primary)' }} /> Mind AI
        </h1>
        <p className="mt-1 flex items-center gap-2" style={{ color: 'var(--on-surface-variant)' }}>
          Your personal wellness companion
          {mode === 'ai' ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-container) 40%, transparent)', color: 'var(--secondary)' }}>
              <Wifi size={12} /> AI online
            </span>
          ) : mode === 'mock' ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--surface-container)', color: 'var(--on-surface-variant)' }}>
              <WifiOff size={12} /> offline mode
            </span>
          ) : null}
        </p>
      </div>

      {isSafetyFlagged && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-5 rounded-[16px] border border-solid" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--error) 30%, transparent)' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} style={{ color: 'var(--error)' }} />
            <span className="font-bold" style={{ color: 'var(--error)', fontFamily: 'var(--font-heading)' }}>You deserve immediate support</span>
          </div>
          <p className="text-sm mb-3" style={{ color: 'var(--on-surface-variant)' }}>
            It's okay to ask for help. One of these trained counselors is available 24/7 — tap to call:
          </p>
          <div className="flex flex-wrap gap-2">
            {HELPLINES.map(helpline => (
              <a key={helpline.name} href={`tel:${helpline.number}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-transform active:scale-95"
                style={{ backgroundColor: 'var(--error)', color: 'var(--on-error)' }}>
                <Phone size={14} /> {helpline.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}

      <Card padding="none" className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="p-2.5 rounded-full flex-shrink-0" style={{
                    backgroundColor: message.role === 'user' ? 'var(--primary)' : 'color-mix(in srgb, var(--primary-container) 25%, transparent)',
                    color: message.role === 'user' ? 'var(--on-primary)' : 'var(--primary)'
                  }}>
                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className="px-5 py-4 rounded-[20px]" style={{
                    backgroundColor: message.role === 'user' ? 'var(--primary)' : 'var(--surface-container-low)',
                    color: message.role === 'user' ? 'var(--on-primary)' : 'var(--on-surface)',
                    borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px'
                  }}>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="p-2.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-container) 25%, transparent)' }}>
                <Bot size={16} style={{ color: 'var(--primary)' }} />
              </div>
              <div className="px-5 py-4 rounded-[20px]" style={{ backgroundColor: 'var(--surface-container-low)' }}>
                <div className="flex gap-1.5">
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} className="w-2.5 h-2.5 rounded-full animate-bounce"
                      style={{ backgroundColor: 'var(--on-surface-variant)', opacity: 0.4, animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="px-6 pb-3 flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button key={reply} onClick={() => handleSend(reply)}
                className="px-4 py-2 text-sm rounded-full transition-colors"
                style={{ backgroundColor: 'var(--surface-container)', color: 'var(--on-surface-variant)' }}>
                {reply}
              </button>
            ))}
          </div>
        )}

        <div className="p-5" style={{ borderTop: '1px solid var(--outline-variant)' }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex items-center gap-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." disabled={isTyping}
              className="flex-1 px-5 py-3.5 rounded-[14px] transition-all focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', '--tw-ring-color': 'rgba(0,100,145,0.2)' }} />
            <Button type="submit" disabled={!input.trim() || isTyping} className="rounded-[14px] p-3.5">
              <Send size={20} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default Companion
