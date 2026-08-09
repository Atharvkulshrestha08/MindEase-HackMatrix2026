import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles, Crown, ArrowLeft, Zap, Shield, Brain, Heart } from 'lucide-react'
import Button from '../components/ui/Button'
import PurchaseButton from '../components/ui/PurchaseButton'
import { setPlan } from '../lib/subscription'
import { useToast } from '../hooks/useToast'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Everything you need to get started on your wellness journey.',
    color: '#006491',
    featured: false,
    features: [
      { text: 'Daily mood check-ins', included: true },
      { text: 'Breathing exercises (3 techniques)', included: true },
      { text: 'Guided meditation (3 & 5 min)', included: true },
      { text: 'Journal with writing prompts', included: true },
      { text: 'AI companion (basic responses)', included: true },
      { text: 'Community access', included: true },
      { text: 'Emergency resources', included: true },
      { text: 'Basic mood insights (7-day)', included: true },
      { text: 'AI-powered reframing', included: false },
      { text: 'Extended meditation sessions', included: false },
      { text: 'Advanced analytics & trends', included: false },
      { text: 'Custom soundscapes', included: false },
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹149',
    period: '/month',
    description: 'Unlock the full MindEase experience with AI-powered insights.',
    color: '#006d3d',
    featured: true,
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'AI-powered cognitive reframing', included: true },
      { text: 'Extended meditation (10, 15, 20 min)', included: true },
      { text: 'Advanced mood analytics (30-day)', included: true },
      { text: 'Custom ambient soundscapes', included: true },
      { text: 'Personalized activity recommendations', included: true },
      { text: 'Mood correlation insights', included: true },
      { text: 'Habit Garden premium plants', included: true },
      { text: 'Priority AI companion responses', included: true },
      { text: 'Sleep stories & wind-down routines', included: true },
      { text: 'Weekly wellness reports', included: true },
      { text: 'Dark mode', included: true },
    ]
  }
]

const highlights = [
  { icon: Brain, label: 'AI-Powered', desc: 'Smart companion that learns your patterns' },
  { icon: Shield, label: 'Privacy First', desc: 'Your data stays on your device' },
  { icon: Heart, label: 'Evidence-Based', desc: 'CBT & mindfulness techniques' },
  { icon: Zap, label: '5-Min Sessions', desc: 'Fits into your busiest days' },
]

const Pricing = () => {
  const { showToast } = useToast()

  const handleUpgrade = () => {
    setPlan('premium')
    showToast('Premium unlocked 🎉', 'success')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface)' }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 glass-strong"
        style={{ borderBottom: '1px solid var(--outline-variant)' }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <ArrowLeft size={20} style={{ color: 'var(--on-surface-variant)' }} />
            <span className="text-2xl font-bold" style={{
              fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, #006491, #0089c7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
            }}>
              MindEase
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--secondary) 10%, white), color-mix(in srgb, var(--secondary) 5%, white))',
              border: '1px solid color-mix(in srgb, var(--secondary) 15%, transparent)',
            }}
          >
            <Crown size={16} style={{ color: 'var(--secondary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>Simple, transparent pricing</span>
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', letterSpacing: '-0.035em' }}
          >
            Choose your path to
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #006d3d, #00a856)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>better wellness.</span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-6" style={{ color: 'var(--on-surface-variant)' }}>
            Start free. Upgrade when you're ready. Cancel anytime.
            <br />No commitments, no hidden fees.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative rounded-[var(--radius-2xl)] overflow-hidden"
              style={{
                backgroundColor: 'var(--surface-container-lowest)',
                boxShadow: plan.featured
                  ? '0 16px 48px -8px rgba(0, 109, 61, 0.18), 0 8px 24px -6px rgba(0, 109, 61, 0.10)'
                  : 'var(--shadow-md)',
                border: plan.featured ? '2px solid var(--secondary)' : '1px solid var(--outline-variant)',
              }}
            >
              {plan.featured && (
                <div className="text-center py-2.5" style={{
                  background: 'linear-gradient(135deg, #006d3d 0%, #00a856 100%)',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  <Sparkles size={14} className="inline mr-1.5" style={{ verticalAlign: '-2px' }} />
                  Most Popular
                </div>
              )}

              <div className="p-8 md:p-10">
                {/* Plan Header */}
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
                  {plan.name}
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--on-surface-variant)' }}>{plan.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-bold" style={{
                    fontFamily: 'var(--font-heading)',
                    color: plan.color,
                    letterSpacing: '-0.03em',
                  }}>
                    {plan.price}
                  </span>
                  <span className="text-lg" style={{ color: 'var(--on-surface-variant)' }}>{plan.period}</span>
                </div>

                {/* CTA Button */}
                {plan.featured ? (
                  <PurchaseButton
                    color={plan.color}
                    text="Upgrade to Premium"
                    onClick={handleUpgrade}
                    style={{ width: '100%', justifyContent: 'center' }}
                  />
                ) : (
                  <Link to="/signup" style={{ display: 'block' }}>
                    <Button variant="outline" fullWidth size="lg">
                      Get Started Free
                    </Button>
                  </Link>
                )}

                {/* Features */}
                <div className="mt-8 pt-8" style={{ borderTop: '1px solid var(--outline-variant)' }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-5" style={{ color: 'var(--on-surface-variant)', letterSpacing: '0.06em' }}>
                    What's included
                  </p>
                  <ul className="flex flex-col gap-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-3">
                        <CheckCircle2
                          size={18}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: feature.included ? plan.color : 'var(--outline-variant)' }}
                          strokeWidth={feature.included ? 2 : 1.5}
                        />
                        <span
                          className="text-sm"
                          style={{
                            color: feature.included ? 'var(--on-surface)' : 'var(--outline)',
                            textDecoration: feature.included ? 'none' : 'line-through',
                          }}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, var(--surface-container-low) 0%, var(--surface) 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', letterSpacing: '-0.03em' }}>
            Why students love MindEase
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-[var(--radius-xl)]"
                style={{
                  backgroundColor: 'var(--surface-container-lowest)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--outline-variant)',
                }}
              >
                <div className="inline-flex p-3.5 rounded-[var(--radius-lg)] mb-4" style={{
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, white), color-mix(in srgb, var(--primary) 4%, white))',
                }}>
                  <item.icon size={24} style={{ color: 'var(--primary)' }} strokeWidth={1.8} />
                </div>
                <h4 className="font-semibold mb-1.5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>{item.label}</h4>
                <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)', letterSpacing: '-0.03em' }}>
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { q: 'Is MindEase really free?', a: 'Yes! The free plan includes mood tracking, breathing exercises, guided meditation, journaling, AI companion, community access, and more. No credit card required.' },
              { q: 'Can I cancel Premium anytime?', a: 'Absolutely. There are no contracts or commitments. Cancel your subscription anytime from the Settings page and you\'ll keep access until the end of your billing period.' },
              { q: 'Is my data private?', a: 'Your data stays on your device by default (localStorage). We never sell or share personal data. MindEase is designed with privacy as a core principle.' },
              { q: 'Is MindEase a replacement for therapy?', a: 'No. MindEase is a daily wellness tool, not a substitute for professional mental health care. If you\'re in crisis, please use our Emergency Resources page for professional helplines.' },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-6 rounded-[var(--radius-xl)]"
                style={{
                  backgroundColor: 'var(--surface-container-lowest)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <h4 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>{faq.q}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ borderTop: '1px solid var(--outline-variant)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <div className="text-2xl font-bold mb-2" style={{
                fontFamily: 'var(--font-heading)',
                background: 'linear-gradient(135deg, #006491, #0089c7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.03em',
              }}>MindEase</div>
              <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>© {new Date().getFullYear()} MindEase. Built for wellness.</p>
            </div>
            <div className="flex gap-8">
              {['Privacy', 'Terms', 'Help'].map((link) => (
                <a key={link} href="#" className="text-sm transition-colors" style={{ color: 'var(--on-surface-variant)' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--on-surface-variant)'}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Pricing
