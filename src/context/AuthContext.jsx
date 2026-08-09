import { useState, useEffect } from 'react'
import AuthContext from './auth-context'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const makeId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `demo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

const hashPassword = async (password) => {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const data = new TextEncoder().encode(`mindease::${password}`)
      const digest = await crypto.subtle.digest('SHA-256', data)
      return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
    }
  } catch { /* fall through to non-crypto fallback */ }
  let h = 0
  const s = `mindease::${password}`
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return `fallback-${(h >>> 0).toString(36)}`
}

const readDemoUser = () => {
  try {
    const savedUser = localStorage.getItem('mindease_user')
    return savedUser ? JSON.parse(savedUser) : null
  } catch {
    localStorage.removeItem('mindease_user')
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      if (!isSupabaseConfigured()) {
        // Demo mode - use localStorage
        setUser(readDemoUser())
        setLoading(false)
        return
      }

      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      }
      setLoading(false)
    }

    getSession()

    // Listen for changes on auth state (logged in, signed out, etc.)
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, metadata = {}) => {
    if (!isSupabaseConfigured()) {
      // Demo mode
      const demoUser = {
        id: makeId(),
        email,
        passwordHash: await hashPassword(password),
        user_metadata: metadata,
        created_at: new Date().toISOString()
      }
      localStorage.setItem('mindease_user', JSON.stringify(demoUser))
      setUser(demoUser)
      return { data: { user: demoUser }, error: null }
    }

    return await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })
  }

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured()) {
      // Demo mode
      const user = readDemoUser()
      if (!user) {
        return { data: null, error: { message: 'No account found. Please sign up.' } }
      }
      if (user.email?.toLowerCase() !== email.toLowerCase()) {
        return { data: null, error: { message: 'Incorrect email or password.' } }
      }
      let passwordOk = false
      if (user.passwordHash) {
        passwordOk = user.passwordHash === (await hashPassword(password))
      } else if (user.password) {
        // Legacy account stored a plaintext password - verify and upgrade to a hash
        passwordOk = user.password === password
        if (passwordOk) {
          const upgraded = { ...user, passwordHash: await hashPassword(password), password: undefined }
          localStorage.setItem('mindease_user', JSON.stringify(upgraded))
        }
      }
      if (!passwordOk) {
        return { data: null, error: { message: 'Incorrect email or password.' } }
      }
      setUser(user)
      return { data: { user }, error: null }
    }

    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      // Demo mode - simulate Google login
      const demoUser = {
        id: makeId(),
        email: 'demo@mindease.app',
        user_metadata: {
          full_name: 'Demo User',
          avatar_url: null
        },
        created_at: new Date().toISOString()
      }
      localStorage.setItem('mindease_user', JSON.stringify(demoUser))
      setUser(demoUser)
      return { data: { user: demoUser }, error: null }
    }

    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/app/dashboard`
      }
    })
  }

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      localStorage.removeItem('mindease_user')
      setUser(null)
      return { error: null }
    }

    return await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
