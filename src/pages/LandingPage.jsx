import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Shield, Heart, Zap, Brain, Sparkles, Award, Trophy, TrendingDown } from 'lucide-react'
import Button from '../components/ui/Button'
import Footer from '../components/layout/Footer'

const features = [
  {
    icon: Brain,
    title: 'AI Companion',
    description: 'Natural conversations that remember you and offer personalized guidance.',
    color: 'var(--primary)',
    bgGradient: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, white), color-mix(in srgb, var(--primary) 3%, white))',
  },
  {
    icon: Heart,
    title: 'Mood Tracking',
    description: 'Understand your emotional patterns with daily check-ins and insights.',
    color: 'var(--secondary)',
    bgGradient: 'linear-gradient(135deg, color-mix(in srgb, var(--secondary) 8%, white), color-mix(in srgb, var(--secondary) 3%, white))',
  },
  {
    icon: Zap,
    title: 'Quick Activities',
    description: 'Breathing, meditation, focus sessions — all under 5 minutes.',
    color: 'var(--tertiary)',
    bgGradient: 'linear-gradient(135deg, color-mix(in srgb, var(--tertiary) 8%, white), color-mix(in srgb, var(--tertiary) 3%, white))',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays on your device. No cloud, no tracking.',
    color: 'var(--on-surface-variant)',
    bgGradient: 'linear-gradient(135deg, color-mix(in srgb, var(--on-surface) 5%, white), color-mix(in srgb, var(--on-surface) 2%, white))',
  }
]

// Real statistics sourced from WHO/IHME Global Burden of Disease & treatment gap data
const stats = [
  { value: '1 in 4', label: 'People Experience Mental Health Issues', source: 'WHO' },
  { value: '3.8%', label: 'Global Anxiety Prevalence', source: 'IHME GBD' },
  { value: '57.7%', label: 'Go Untreated in the US', source: 'WMH Survey' },
  { value: '280M', label: 'People Living with Depression', source: 'IHME GBD' }
]

// Why it matters data (from CSV datasets)
const crisisData = [
  { label: 'Depression', value: '4.4%', desc: 'of the global population affected' },
  { label: 'Anxiety', value: '3.8%', desc: 'of the global population affected' },
  { label: 'Untreated', value: '76%', desc: 'in lower-middle-income countries' },
  { label: 'Youth', value: '50%', desc: 'of mental illnesses begin by age 14' },
]

const LandingPage = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Navigation */}
      <nav 
        className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-7xl px-4"
      >
        <div className="glass-pill rounded-[24px] px-6 h-[72px] flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold" style={{ 
            color: 'var(--primary)', 
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #006491, #0089c7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            MindEase
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/pricing" className="hidden sm:block">
              <Button variant="ghost" size="sm">Pricing</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[160px]">
        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            style={{ y }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-[100px] opacity-70"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 30%, transparent) 0%, transparent 70%)' }} />
          </motion.div>
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }}
            className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-[100px] opacity-70"
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--secondary) 25%, transparent) 0%, transparent 70%)' }} />
          </motion.div>
          <motion.div 
            className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full -translate-x-1/2 mix-blend-multiply filter blur-[100px] opacity-50"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--tertiary) 20%, transparent) 0%, transparent 70%)' }} />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10"
              style={{ 
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, white), color-mix(in srgb, var(--primary) 5%, white))',
                border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
                boxShadow: '0 2px 8px -2px rgba(0, 100, 145, 0.12)',
              }}
            >
              <Sparkles size={16} style={{ color: 'var(--primary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>Your Daily Mental Fitness Companion</span>
            </motion.div>
            
            {/* Title */}
            <h1 
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold mb-8 leading-[1.08]"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', letterSpacing: '-0.035em' }}
            >
              Find your balance,
              <br />
              <span style={{ 
                background: 'linear-gradient(135deg, #006491, #00a856)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>one day at a time.</span>
            </h1>
            
            {/* Subtitle */}
            <p 
              className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed"
              style={{ color: 'var(--on-surface-variant)', fontWeight: 400 }}
            >
              A calming digital space that helps you track your mood, reduce stress, 
              and build healthy habits — in under 5 minutes a day.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="xl" icon={ArrowRight} iconPosition="right">
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl">
                  I Have an Account
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats — Real WHO/IHME data */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center p-6 glass-widget"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ 
                  fontFamily: 'var(--font-heading)',
                  background: 'linear-gradient(135deg, #006491, #0089c7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.03em',
                }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{stat.label}</div>
                {stat.source && (
                  <div className="text-[10px] mt-1.5 font-medium" style={{ color: 'var(--outline)' }}>Source: {stat.source}</div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Mental Health Matters — Data Section */}
      <section className="py-28" style={{ background: 'linear-gradient(180deg, var(--surface) 0%, color-mix(in srgb, var(--error) 3%, var(--surface)) 50%, var(--surface) 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{
              backgroundColor: 'color-mix(in srgb, var(--error) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--error) 15%, transparent)',
            }}>
              <TrendingDown size={14} style={{ color: 'var(--error)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--error)' }}>The mental health crisis is real</span>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', letterSpacing: '-0.03em' }}
            >
              Why this matters.
            </h2>
            <p className="text-xl max-w-xl mx-auto" style={{ color: 'var(--on-surface-variant)' }}>
              Real data from WHO and the Global Burden of Disease study shows the urgency.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {crisisData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="p-8 text-center glass-widget"
              >
                <div className="text-4xl font-bold mb-2" style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--error)',
                  letterSpacing: '-0.03em',
                }}>
                  {item.value}
                </div>
                <div className="text-lg font-semibold mb-1" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-heading)' }}>
                  {item.label}
                </div>
                <div className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs mt-8"
            style={{ color: 'var(--outline)' }}
          >
            Sources: WHO World Mental Health Report 2022, IHME Global Burden of Disease Study, WMH Survey Initiative
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28" style={{ background: 'linear-gradient(180deg, var(--surface) 0%, var(--surface-container-low) 50%, var(--surface) 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', letterSpacing: '-0.03em' }}
            >
              Everything you need,
              <br />
              nothing you don't.
            </h2>
            <p className="text-xl max-w-xl mx-auto" style={{ color: 'var(--on-surface-variant)' }}>
              Built for students, by students. No complicated interfaces, 
              no expensive subscriptions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="p-8 md:p-10 transition-all duration-300 cursor-default group glass-widget"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, ' + feature.color + ' 20%, transparent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'var(--outline-variant)'
                }}
              >
                <div 
                  className="inline-flex p-4 rounded-[var(--radius-lg)] mb-6"
                  style={{ background: feature.bgGradient }}
                >
                  <feature.icon size={28} style={{ color: feature.color }} strokeWidth={1.8} />
                </div>
                <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
                  {feature.title}
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proven Section */}
      <section className="py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)',
            }}>
              <Award size={14} style={{ color: 'var(--primary)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>A proven idea</span>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', letterSpacing: '-0.03em' }}
            >
              Recognized. Validated.
            </h2>
            <p className="text-xl max-w-xl mx-auto" style={{ color: 'var(--on-surface-variant)' }}>
              The earlier version of MindEase already proved the concept on the national stage.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="p-8 md:p-10 text-center glass-widget"
            >
              <div className="inline-flex p-4 rounded-[var(--radius-lg)] mb-5" style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--secondary) 10%, white), color-mix(in srgb, var(--secondary) 4%, white))',
              }}>
                <Trophy size={28} style={{ color: 'var(--secondary)' }} strokeWidth={1.8} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
                Winner — HACKMoR 2026
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
                The previous MindEase prototype won the national-level hackathon at Manav Rachna University.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="p-8 md:p-10 text-center glass-widget"
            >
              <div className="inline-flex p-4 rounded-[var(--radius-lg)] mb-5" style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--tertiary) 10%, white), color-mix(in srgb, var(--tertiary) 4%, white))',
              }}>
                <Award size={28} style={{ color: 'var(--tertiary)' }} strokeWidth={1.8} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
                Grand Finale — Tech-BIP
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
                Selected for the Technology Business Idea Pitch Grand Finale at EDII, Ahmedabad.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-12 md:p-16 rounded-[var(--radius-3xl)]"
            style={{ 
              background: 'linear-gradient(135deg, #006491 0%, #0089c7 50%, #5dade2 100%)',
              boxShadow: '0 24px 64px -12px rgba(0, 100, 145, 0.3), 0 12px 32px -8px rgba(0, 100, 145, 0.15)',
            }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'white', letterSpacing: '-0.03em' }}>
              Ready to begin?
            </h2>
            <p className="text-xl mb-10 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.7 }}>
              Start small. Build a habit that sticks — one check-in at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button 
                  variant="outline" 
                  size="xl"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
                >
                  Get Started — It's Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  variant="ghost" 
                  size="xl"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
