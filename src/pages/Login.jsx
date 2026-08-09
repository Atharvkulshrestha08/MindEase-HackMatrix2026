import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await signIn(data.email, data.password)
      if (error) {
        setError(error.message)
      } else {
        navigate('/app/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error.message)
      } else {
        navigate('/app/dashboard')
      }
    } catch (err) {
      console.error('Google login error:', err)
      setError(err?.message || 'Could not sign in with Google. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-block mb-10">
            <span className="text-3xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>MindEase</span>
          </Link>

          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
            Welcome back
          </h1>
          <p className="text-lg mb-10" style={{ color: 'var(--on-surface-variant)' }}>
            Log in to continue your wellness journey
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] transition-colors"
                style={{ color: 'var(--on-surface-variant)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-[14px] text-sm"
                style={{ backgroundColor: 'color-mix(in srgb, var(--error) 10%, transparent)', color: 'var(--error)' }}
              >
                {error}
              </motion.div>
            )}

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Log In'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid var(--outline-variant)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3" style={{ backgroundColor: 'var(--surface)', color: 'var(--on-surface-variant)' }}>or continue with</span>
            </div>
          </div>

          <Button variant="outline" fullWidth size="lg" onClick={handleGoogleLogin} disabled={loading}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-base" style={{ color: 'var(--on-surface-variant)' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold" style={{ color: 'var(--primary)' }}>
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div 
        className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)', filter: 'blur(80px)' }} />
        </div>
        <div className="relative z-10 text-center text-white p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="text-8xl mb-8">🧘</div>
            <h2 className="text-4xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
              Your space for calm
            </h2>
            <p className="text-xl max-w-sm" style={{ opacity: 0.85 }}>
              Take a moment. Breathe. You're exactly where you need to be.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login
