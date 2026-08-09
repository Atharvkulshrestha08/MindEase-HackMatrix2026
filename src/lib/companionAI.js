import { mockCompanionResponses } from '../data/mockData'

const API_URL = import.meta.env.VITE_AI_API_URL || 'https://api.groq.com/openai/v1/chat/completions'
const API_KEY = import.meta.env.VITE_AI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || ''
const MODEL = import.meta.env.VITE_AI_MODEL || 'llama-3.3-70b-versatile'

const GEMINI_URL = import.meta.env.VITE_AI_GEMINI_URL || 'https://generativelanguage.googleapis.com/v1beta/models'
const GEMINI_MODEL = import.meta.env.VITE_AI_GEMINI_MODEL || 'gemini-2.0-flash'
const GEMINI_API_KEY = import.meta.env.VITE_AI_GEMINI_API_KEY || ''

export const isAIConfigured = () => Boolean(API_KEY || GEMINI_API_KEY)
export const isGeminiConfigured = () => Boolean(GEMINI_API_KEY)

const SYSTEM_PROMPT = `You are MindEase AI, a warm, non-judgmental mental-wellness companion for students and young professionals.

Guidelines:
- Respond like a caring friend who also uses simple CBT, grounding, and mindfulness techniques.
- Keep replies to 2-4 short sentences. Ask ONE reflective follow-up question.
- NEVER diagnose, prescribe, or make clinical claims. Use supportive language.
- If someone mentions self-harm, suicide, or being in crisis, respond with compassion and IMMEDIATELY share these India helplines: iCall 9152987821 (24/7), AASRA 9820466726 (24/7), Vandrevala 1860-2662-345 (24/7). Say "You matter, and you don't have to go through this alone."
- Personalize lightly if the user shares their name.
- Occasionally suggest a specific MindEase activity (breathing exercise, journal prompt, 5-4-3-2-1 grounding, focus timer).
- Use the provided user context (name, mood history, journal habits, streak, wellness goal) to tailor your tone and suggestions. Never recite raw context data back verbatim; use it quietly.`

const crisisPatterns = [
  /suicid/i, /self[\s-]?harm/i, /kill myself/i, /end (my|it all|everything)/i,
  /don'?t want to (live|be here|exist)/i, /hurt myself/i, /can'?t go on/i,
  /want to die/i, /better off without me/i, /no reason to live/i,
  /give up on life/i, /not worth (living|being alive)/i, /wish i (was|were) (dead|gone)/i,
]

const MOOD_SCORE = { happy: 5, calm: 5, neutral: 3, anxious: 1, sad: 1 }

const buildContextSnippet = (context = {}) => {
  const parts = []
  if (context.userName) parts.push(`User's first name: ${context.userName}`)
  if (context.goal) parts.push(`Wellness goal: ${context.goal}`)
  if (context.streak) parts.push(`Mood check-in streak: ${context.streak} day${context.streak === 1 ? '' : 's'}`)

  const moodLogs = Array.isArray(context.moodLogs) ? context.moodLogs : []
  if (moodLogs.length > 0) {
    const recent = moodLogs.slice(-7)
    const summary = recent.map(l => `${l.date}: ${l.mood}`).join(', ')
    const avg = recent.reduce((sum, l) => sum + (MOOD_SCORE[l.mood] || 3), 0) / Math.min(recent.length, 7)
    const trend = avg >= 4.5 ? 'mostly positive' : avg <= 2 ? 'mostly low' : 'mixed/neutral'
    parts.push(`Recent mood check-ins (last ${recent.length}): ${summary}`)
    parts.push(`Mood trend: ${trend}`)
  }

  const journalEntries = Array.isArray(context.journalEntries) ? context.journalEntries : []
  if (journalEntries.length > 0) {
    const lastEntry = journalEntries[journalEntries.length - 1]
    const excerpt = typeof lastEntry?.content === 'string' ? lastEntry.content.slice(0, 400) : ''
    if (excerpt) {
      parts.push(`Most recent journal entry: "${excerpt}"`)
      parts.push('Use this gently for context if relevant. Do not reveal that you read the journal unless it helps the conversation.')
    }
  }

  return parts.join('\n') || "User hasn't shared much yet."
}

const getMockResponse = (message) => {
  const lower = message.toLowerCase()
  if (lower.includes('stressed') || lower.includes('stress'))
    return mockCompanionResponses.stressed[Math.floor(Math.random() * mockCompanionResponses.stressed.length)]
  if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('worried'))
    return mockCompanionResponses.anxious[Math.floor(Math.random() * mockCompanionResponses.anxious.length)]
  if (lower.includes('sad') || lower.includes('unhappy') || lower.includes('depressed'))
    return mockCompanionResponses.sad[Math.floor(Math.random() * mockCompanionResponses.sad.length)]
  if (lower.includes('happy') || lower.includes('good') || lower.includes('great'))
    return mockCompanionResponses.happy[Math.floor(Math.random() * mockCompanionResponses.happy.length)]
  if (lower.includes('focus') || lower.includes('concentrate'))
    return mockCompanionResponses.focus[Math.floor(Math.random() * mockCompanionResponses.focus.length)]
  if (lower.includes('sleep') || lower.includes('tired'))
    return mockCompanionResponses.sleep[Math.floor(Math.random() * mockCompanionResponses.sleep.length)]
  return mockCompanionResponses.default[Math.floor(Math.random() * mockCompanionResponses.default.length)]
}

const CRISIS_REPLY = `I'm really glad you reached out. You matter, and you don't have to go through this alone. Please talk to someone right now:
• iCall — 9152987821 (24/7)
• AASRA — 9820466726 (24/7)
• Vandrevala Foundation — 1860-2662-345 (24/7)

And if you're in immediate danger, please call emergency services right away. I'm here with you.`

const callOpenAICompatible = async ({ messages, context }) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.8,
      max_tokens: 300,
      messages: [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\nUser context:\n${buildContextSnippet(context)}` },
        ...messages,
      ],
    }),
  })
  if (!res.ok) throw new Error(`AI request failed: ${res.status}`)
  const data = await res.json()
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error('Empty AI response')
  return content
}

const callGemini = async ({ messages, context }) => {
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  const lastMessage = messages[messages.length - 1]
  const generationConfig = { temperature: 0.8, maxOutputTokens: 300 }

  const url = `${GEMINI_URL}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`

  const payload = {
    systemInstruction: { parts: [{ text: `${SYSTEM_PROMPT}\n\nUser context:\n${buildContextSnippet(context)}` }] },
    contents: [...history, { role: 'user', parts: [{ text: lastMessage.content }] }],
    generationConfig,
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Gemini request failed: ${res.status}`)
  const data = await res.json()
  const content = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('')?.trim()
  if (!content) throw new Error('Empty Gemini response')
  return content
}

export const getCompanionReply = async ({ messages, context = {} }) => {
  const lastUserText = [...messages].reverse().find(m => m.role === 'user')?.content || ''
  if (crisisPatterns.some(re => re.test(lastUserText))) {
    return { content: CRISIS_REPLY, source: 'safety' }
  }

  const history = messages.slice(-12).map(m => ({ role: m.role, content: m.content }))

  if (isGeminiConfigured()) {
    try {
      const content = await callGemini({ messages: history, context })
      return { content, source: 'ai' }
    } catch (error) {
      console.error('Gemini request failed, falling back:', error)
      if (!API_KEY) {
        return { content: getMockResponse(lastUserText), source: 'mock' }
      }
    }
  }

  if (isAIConfigured()) {
    try {
      const content = await callOpenAICompatible({ messages: history, context })
      return { content, source: 'ai' }
    } catch (error) {
      console.error('AI companion fallback to offline mode:', error)
      return { content: getMockResponse(lastUserText), source: 'mock' }
    }
  }

  return { content: getMockResponse(lastUserText), source: 'mock' }
}
