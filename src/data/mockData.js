// Mock AI responses for the companion chat
export const mockCompanionResponses = {
  greeting: [
    "Hey there! How are you feeling today? I'm here to chat whenever you need.",
    "Welcome back! What's on your mind? Remember, there's no wrong answer here.",
    "Hi! I'm glad you're here. How's your day going so far?"
  ],
  stressed: [
    "I hear you — stress can feel overwhelming. Let's try something: take 3 slow breaths right now. In for 4, hold for 4, out for 6. I'll wait.",
    "That sounds really tough. Remember, you don't have to solve everything at once. What's the ONE thing that feels most urgent?",
    "Stress is your body's way of saying 'this matters to you.' That's actually a good sign. Let's channel it productively."
  ],
  anxious: [
    "Anxiety can be really uncomfortable. Try this: name 5 things you can see right now. This grounds you in the present.",
    "Your feelings are valid. Anxiety often comes from worrying about the future. What's actually happening RIGHT NOW?",
    "Let's try the 5-4-3-2-1 technique: 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste."
  ],
  sad: [
    "I'm sorry you're feeling this way. It's okay to feel sad — it means you care deeply about something.",
    "Sadness is temporary, even when it doesn't feel like it. What's one small thing that usually brings you comfort?",
    "Sometimes we need to feel our feelings before we can move through them. I'm here if you want to talk about it."
  ],
  happy: [
    "That's wonderful! Savor this feeling. What contributed to your good mood today?",
    "Love to hear it! Positive moments deserve recognition. What's going well?",
    "Amazing! Remember this feeling — it can be an anchor during tougher days."
  ],
  neutral: [
    "That's perfectly okay! Not every day needs to be highs or lows. How can I support you today?",
    "Neutral is a valid state. Is there anything specific you'd like to work on or talk about?",
    "Sometimes 'just okay' is exactly where we need to be. What would make today a little better?"
  ],
  default: [
    "Thank you for sharing that with me. Can you tell me more about how that makes you feel?",
    "I appreciate you opening up. What do you think is the root of what you're experiencing?",
    "That's interesting. How does this connect to what else is happening in your life right now?"
  ],
  focus: [
    "Focus is like a muscle — it gets stronger with practice. Let's try a 25-minute Pomodoro session.",
    "When I need to focus, I find it helps to eliminate one distraction first. What's pulling your attention away?",
    "Try the 2-minute rule: if it takes less than 2 minutes, do it now. Otherwise, schedule it."
  ],
  sleep: [
    "Sleep is crucial for mental health. Try putting screens away 30 minutes before bed tonight.",
    "A consistent sleep schedule helps more than most people realize. What time do you usually go to bed?",
    "If your mind races at night, try a body scan meditation. Start from your toes and work up."
  ]
}

// Mood to color mapping
export const moodColors = {
  happy: { primary: '#5DADE2', secondary: '#8aceff', bg: '#e6f5ff' },
  calm: { primary: '#58D68D', secondary: '#7efbae', bg: '#e6fff0' },
  neutral: { primary: '#707880', secondary: '#bfc7d0', bg: '#f0f2f5' },
  anxious: { primary: '#F4D03F', secondary: '#ffe174', bg: '#fff9e6' },
  sad: { primary: '#EC7063', secondary: '#ffdad6', bg: '#fff0ee' },
  stressed: { primary: '#c3a304', secondary: '#e7c433', bg: '#fffbe6' }
}

// Activity types
export const activities = [
  {
    id: 'breathing',
    title: 'Breathing Exercises',
    description: 'Calm your mind with guided breathing techniques',
    icon: 'wind',
    color: '#5DADE2',
    duration: '5 min'
  },
  {
    id: 'meditation',
    title: 'Meditation',
    description: 'Find inner peace with guided meditation sessions',
    icon: 'brain',
    color: '#58D68D',
    duration: '10 min'
  },
  {
    id: 'focus',
    title: 'Focus Timer',
    description: 'Boost productivity with Pomodoro technique',
    icon: 'timer',
    color: '#F4D03F',
    duration: '25 min'
  },
  {
    id: 'stretch',
    title: 'Quick Stretch',
    description: 'Release tension with a guided stretch routine',
    icon: 'person-standing',
    color: '#EC7063',
    duration: '5 min'
  },
  {
    id: 'grounding',
    title: 'Grounding',
    description: 'Stay present with the 5-4-3-2-1 technique',
    icon: 'mountain',
    color: '#705d00',
    duration: '3 min'
  }
]

// Journal prompts
export const journalPrompts = [
  "What's been on your mind today?",
  "What are three things you're grateful for right now?",
  "What's one challenge you faced today and how did you handle it?",
  "Describe a moment that brought you joy recently.",
  "What would you tell your younger self about today?",
  "What's one thing you'd like to let go of?",
  "How did you take care of yourself today?",
  "What's something you're looking forward to?"
]

// Music playlists
export const playlists = [
  {
    id: 'lofi',
    title: 'Lo-fi Beats',
    description: 'Chill beats to relax and study',
    icon: '🎵',
    color: '#5DADE2'
  },
  {
    id: 'nature',
    title: 'Nature Sounds',
    description: 'Rain, forest, and ocean ambience',
    icon: '🌿',
    color: '#58D68D'
  },
  {
    id: 'focus',
    title: 'Focus Music',
    description: 'Instrumental tracks for deep work',
    icon: '🎯',
    color: '#F4D03F'
  },
  {
    id: 'calm',
    title: 'Calm & Sleep',
    description: 'Soothing sounds for better rest',
    icon: '🌙',
    color: '#705d00'
  }
]

// Habit garden plants
export const plantTypes = [
  { id: 'sunflower', name: 'Sunflower', emoji: '🌻', growthTime: 7 },
  { id: 'rose', name: 'Rose', emoji: '🌹', growthTime: 10 },
  { id: 'tulip', name: 'Tulip', emoji: '🌷', growthTime: 5 },
  { id: 'cactus', name: 'Cactus', emoji: '🌵', growthTime: 14 },
  { id: 'tree', name: 'Bonsai', emoji: '🌳', growthTime: 21 }
]

// Community mock posts
export const communityPosts = [
  {
    id: 1,
    content: "Completed my first 7-day meditation streak today! Feeling proud.",
    reactions: { '❤️': 12, '🌱': 8, '✨': 5 },
    timeAgo: '2 hours ago',
    tag: 'achievement'
  },
  {
    id: 2,
    content: "The breathing exercises really helped during my exam prep today.",
    reactions: { '❤️': 7, '💪': 4, '🙌': 3 },
    timeAgo: '5 hours ago',
    tag: 'gratitude'
  },
  {
    id: 3,
    content: "Remember: it's okay to have bad days. Tomorrow is a fresh start.",
    reactions: { '❤️': 23, '🫂': 11, '💛': 8 },
    timeAgo: '1 day ago',
    tag: 'encouragement'
  }
]

// Emergency resources
export const emergencyResources = [
  {
    name: 'iCall',
    description: 'Mental health helpline for young people',
    number: '9152987821',
    available: '24/7'
  },
  {
    name: 'Vandrevala Foundation',
    description: 'Crisis support and counseling',
    number: '1860-2662-345',
    available: '24/7'
  },
  {
    name: 'AASRA',
    description: 'Suicide prevention helpline',
    number: '9820466726',
    available: '24/7'
  },
  {
    name: 'Sangath',
    description: 'Mental health research and support',
    number: '0124-2540171',
    available: 'Mon-Sat 10am-6pm'
  }
]
