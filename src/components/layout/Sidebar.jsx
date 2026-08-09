import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, Brain, Activity, BookOpen, Music, BarChart3, PieChart,
  Sprout, Users, Heart, Settings, X, LogOut, Gamepad2 
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { icon: Home, label: 'Home', path: '/app/dashboard' },
  { icon: Brain, label: 'AI Companion', path: '/app/companion' },
  { icon: Activity, label: 'Activities', path: '/app/activities' },
  { icon: BookOpen, label: 'Journal', path: '/app/journal' },
  { icon: Music, label: 'Music', path: '/app/music' },
  { icon: Gamepad2, label: 'Cartoons & Games', path: '/app/entertainment' },
  { icon: BarChart3, label: 'Insights', path: '/app/insights' },
  { icon: Sprout, label: 'Garden', path: '/app/garden' },
  { icon: Users, label: 'Community', path: '/app/community' },
  { icon: Heart, label: 'Resources', path: '/app/resources' },
  { icon: PieChart, label: 'Data Explorer', path: '/app/data-explorer' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
]

const Sidebar = ({ isOpen, onClose }) => {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: 'rgba(13, 28, 46, 0.3)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed left-0 top-0 h-full z-50 flex flex-col lg:translate-x-0 lg:z-40"
        style={{
          width: '280px',
          backgroundColor: 'rgba(248, 249, 255, 0.92)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          borderRight: '1px solid var(--outline-variant)',
        }}
      >
        {/* Logo */}
        <div className="px-6 pt-8 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ 
              color: 'var(--primary)', 
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #006491, #0089c7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              MindEase
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--on-surface-variant)', letterSpacing: '0.01em' }}>
              Your wellness companion
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-[var(--radius-sm)] lg:hidden transition-colors"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-container)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} style={{ color: 'var(--on-surface-variant)' }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="flex items-center gap-3.5 px-4 py-3 rounded-[var(--radius-md)] transition-all duration-200"
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--on-surface-variant)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                boxShadow: isActive ? '0 2px 8px -2px rgba(0, 100, 145, 0.35)' : 'none',
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  // Check if it's the active link by inline style
                  const style = e.currentTarget.style
                  if (style.backgroundColor !== 'var(--primary)' && style.backgroundColor !== 'rgb(0, 100, 145)') {
                    e.currentTarget.style.backgroundColor = 'var(--surface-container)'
                  }
                }
              }}
              onMouseLeave={(e) => {
                const style = e.currentTarget.style
                if (style.backgroundColor !== 'var(--primary)' && style.backgroundColor !== 'rgb(0, 100, 145)') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <item.icon size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Daily Goal */}
        <div className="px-3 py-3">
          <div className="p-4 rounded-[var(--radius-lg)]" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, transparent), color-mix(in srgb, var(--secondary) 5%, transparent))' }}>
            <p className="text-xs font-semibold mb-2.5" style={{ color: 'var(--primary)', letterSpacing: '0.03em' }}>Daily Goal</p>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-container-highest)' }}>
              <div className="h-full rounded-full" style={{ width: '65%', background: 'linear-gradient(90deg, #006491, #00a856)' }} />
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--on-surface-variant)' }}>3 of 5 activities done</p>
          </div>
        </div>

        {/* Sign Out */}
        <div className="px-3 pb-4" style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '12px' }}>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-[var(--radius-md)] transition-all duration-200"
            style={{ color: 'var(--on-surface-variant)', fontSize: '14px', fontWeight: 500 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--error) 8%, transparent)'
              e.currentTarget.style.color = 'var(--error)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--on-surface-variant)'
            }}
          >
            <LogOut size={20} strokeWidth={1.8} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
