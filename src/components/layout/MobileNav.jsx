import { NavLink } from 'react-router-dom'
import { Home, Activity, BookOpen, Music, BarChart3 } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', path: '/app/dashboard' },
  { icon: Activity, label: 'Activities', path: '/app/activities' },
  { icon: BookOpen, label: 'Journal', path: '/app/journal' },
  { icon: Music, label: 'Music', path: '/app/music' },
  { icon: BarChart3, label: 'Insights', path: '/app/insights' },
]

const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden safe-area-bottom">
      <div 
        className="flex justify-around items-center h-[72px] px-2"
        style={{
          background: 'rgba(248, 249, 255, 0.92)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          borderTop: '1px solid var(--outline-variant)',
          boxShadow: '0 -4px 16px -4px rgba(0, 20, 40, 0.06)',
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-[var(--radius-md)] transition-all duration-200"
            style={({ isActive }) => ({
              minWidth: '56px',
              minHeight: '48px',
              justifyContent: 'center',
              color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
            })}
          >
            {({ isActive }) => (
              <>
                <div className="p-2 rounded-[var(--radius-sm)] transition-all duration-200" style={{
                  background: isActive ? 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, white), color-mix(in srgb, var(--primary) 6%, white))' : 'transparent',
                }}>
                  <item.icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 500, letterSpacing: '0.02em' }}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav
