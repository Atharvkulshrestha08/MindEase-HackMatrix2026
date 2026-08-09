import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, Brain, Activity, BookOpen, Music, BarChart3, PieChart,
  Sprout, Users, Heart, Settings, Gamepad2, LogOut
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

const mainItems = [
  { icon: Home, label: 'Home', path: '/app/dashboard' },
  { icon: Brain, label: 'Companion', path: '/app/companion' },
  { icon: Activity, label: 'Activities', path: '/app/activities' },
  { icon: BookOpen, label: 'Journal', path: '/app/journal' },
  { icon: Music, label: 'Music', path: '/app/music' },
  { icon: Gamepad2, label: 'Games', path: '/app/entertainment' },
]

const moreItems = [
  { icon: BarChart3, label: 'Insights', path: '/app/insights' },
  { icon: Sprout, label: 'Garden', path: '/app/garden' },
  { icon: Users, label: 'Community', path: '/app/community' },
  { icon: Heart, label: 'Resources', path: '/app/resources' },
  { icon: PieChart, label: 'Data', path: '/app/data-explorer' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
]

const DockIcon = ({ item, isMore = false }) => {
  return (
    <NavLink to={item.path} className="relative group flex items-center justify-center">
      {({ isActive }) => (
        <motion.div
          whileHover={{ scale: 1.3, y: -10 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-12 h-12 rounded-2xl transition-colors duration-200"
          style={{ 
            backgroundColor: isActive ? 'var(--primary-container)' : 'transparent',
            color: isActive ? 'var(--on-primary-container)' : 'var(--on-surface-variant)'
          }}
        >
          <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
          
          {/* Tooltip */}
          <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg z-50"
            style={{ backgroundColor: 'var(--on-surface)', color: 'var(--surface)' }}
          >
            {item.label}
          </div>
          
          {/* Active Indicator */}
          {isActive && (
            <motion.div 
              layoutId={isMore ? "moreActiveTab" : "mainActiveTab"}
              className="absolute -bottom-2 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--primary)' }}
            />
          )}
        </motion.div>
      )}
    </NavLink>
  )
}

const Dock = () => {
  const { signOut } = useAuth()
  const [showMore, setShowMore] = useState(false)

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-3 w-max max-w-[95vw]">
      
      {/* "More" Menu Popover */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[98]"
              onClick={() => setShowMore(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="glass-widget p-3 flex flex-wrap justify-center items-center gap-2 max-w-full relative z-[99]"
            >
              {moreItems.map(item => (
                <DockIcon key={item.path} item={item} isMore={true} />
              ))}
              
              <div className="hidden sm:block w-[1px] h-8 mx-1 opacity-20" style={{ backgroundColor: 'var(--on-surface)' }} />
              
              <button onClick={signOut} className="relative group flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.3, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center justify-center w-12 h-12 rounded-2xl text-red-500 transition-colors duration-200"
                >
                  <LogOut size={24} strokeWidth={2} />
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg z-50"
                    style={{ backgroundColor: 'var(--on-surface)', color: 'var(--surface)' }}
                  >
                    Sign Out
                  </div>
                </motion.div>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Dock */}
      <motion.div 
        className="glass-dock px-3 py-3 rounded-3xl flex items-center gap-1 sm:gap-2 max-w-full overflow-x-auto no-scrollbar relative z-[99]"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        {mainItems.map(item => (
          <DockIcon key={item.path} item={item} />
        ))}
        
        <div className="w-[1px] h-8 mx-1 sm:mx-2 opacity-20 flex-shrink-0" style={{ backgroundColor: 'var(--on-surface)' }} />
        
        <button onClick={() => setShowMore(!showMore)} className="relative group flex items-center justify-center flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.3, y: -10 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center w-12 h-12 rounded-2xl transition-colors duration-200"
            style={{ 
              backgroundColor: showMore ? 'var(--surface-container-high)' : 'transparent',
              color: 'var(--on-surface)'
            }}
          >
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            </div>
            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg z-50"
              style={{ backgroundColor: 'var(--on-surface)', color: 'var(--surface)' }}
            >
              More
            </div>
          </motion.div>
        </button>
      </motion.div>
    </div>
  )
}

export default Dock
