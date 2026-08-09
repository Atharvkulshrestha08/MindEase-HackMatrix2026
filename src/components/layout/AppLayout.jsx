import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Bell, User } from 'lucide-react'
import Dock from './Dock'
import OnboardingModal from '../OnboardingModal'
import SOSButton from '../SOSButton'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'

const AppLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'streak', title: '3 Day Streak!', message: 'You logged in 3 days in a row. Keep it up!', time: '2h ago', read: false },
    { id: 2, type: 'reminder', title: 'Daily Journal', message: 'Time to reflect on your day.', time: '5h ago', read: false },
    { id: 3, type: 'reminder', title: 'Meditation', message: 'Take 5 minutes to breathe and relax.', time: '1d ago', read: true }
  ])
  const location = useLocation()
  const { user } = useAuth()
  const { profile, isComplete, saveProfile } = useProfile()
  const { scrollY } = useScroll()

  // Animate header slightly when scrolling down
  const headerWidth = useTransform(scrollY, [0, 100], ['100%', '95%'])
  const headerY = useTransform(scrollY, [0, 100], [0, 10])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const displayName = profile?.name || user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
      
      {/* Animated Floating Header */}
      <motion.header 
        style={{ width: headerWidth, y: headerY }}
        className="fixed top-4 left-0 right-0 z-40 mx-auto max-w-7xl px-4"
      >
        <div className="glass-pill rounded-[24px] px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-[#00ad54] to-[#008c43] shadow-md">
              M
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--on-surface)' }}>
              MindEase
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-xs font-medium" style={{ color: 'var(--on-surface-variant)' }}>{getGreeting()},</p>
              <p className="text-sm font-bold" style={{ color: 'var(--on-surface)' }}>{displayName}</p>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-[var(--radius-md)] relative transition-colors"
                style={{ backgroundColor: showNotifications ? 'var(--surface-container-high)' : 'transparent' }}
                onMouseEnter={(e) => !showNotifications && (e.currentTarget.style.backgroundColor = 'var(--surface-container)')}
                onMouseLeave={(e) => !showNotifications && (e.currentTarget.style.backgroundColor = 'transparent')}
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell size={20} style={{ color: 'var(--on-surface-variant)' }} strokeWidth={1.8} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--error)' }} />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute right-0 top-full mt-3 w-80 rounded-[var(--radius-xl)] shadow-lg overflow-hidden glass-widget"
                  >
                    <div className="p-4 border-b border-white/20 flex justify-between items-center" style={{ backgroundColor: 'var(--surface-container-low)' }}>
                      <h3 className="font-bold" style={{ color: 'var(--on-surface)' }}>Notifications</h3>
                      <button 
                        className="text-xs font-medium px-2 py-1 rounded" 
                        style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-container)' }}
                        onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            className="p-4 border-b border-white/20 flex gap-3 transition-colors hover:bg-white/40 cursor-pointer"
                            style={{ opacity: notif.read ? 0.6 : 1 }}
                          >
                            <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: notif.read ? 'transparent' : 'var(--primary)' }} />
                            <div>
                              <p className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>{notif.title}</p>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--on-surface-variant)' }}>{notif.message}</p>
                              <p className="text-[10px] mt-1.5 opacity-60" style={{ color: 'var(--on-surface-variant)' }}>{notif.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200"
              style={{ 
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, white), color-mix(in srgb, var(--secondary) 8%, white))',
                border: '1.5px solid var(--outline-variant)',
              }}
            >
              <User size={18} style={{ color: 'var(--primary)' }} strokeWidth={1.8} />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main id="main-content" className="pt-28 pb-32 min-h-screen px-4 md:px-8 mx-auto max-w-7xl" tabIndex="-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* macOS-style Floating Dock */}
      <Dock />
      <SOSButton />

      {!isComplete && (
        <OnboardingModal initialName={user?.user_metadata?.full_name?.split(' ')[0] || ''} onComplete={saveProfile} />
      )}
    </div>
  )
}

export default AppLayout
