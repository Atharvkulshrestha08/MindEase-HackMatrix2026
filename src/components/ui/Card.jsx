import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

const Card = forwardRef(({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  animate = true,
  ...props
}, ref) => {
  const variants = {
    default: { backgroundColor: 'var(--surface-container-lowest)' },
    elevated: { backgroundColor: 'var(--surface-container-lowest)' },
    glass: { background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: '24px', boxShadow: 'var(--shadow-sm), inset 0 1px 2px rgba(255, 255, 255, 0.8)' },
    primary: { background: 'linear-gradient(135deg, #006491 0%, #0089c7 50%, #5dade2 100%)', color: 'white' },
    secondary: { background: 'linear-gradient(135deg, #006d3d 0%, #00a856 100%)', color: 'white' },
    tertiary: { backgroundColor: 'var(--tertiary)', color: 'white' },
    warm: { background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)', color: '#78350f' },
  }

  const paddings = {
    none: '',
    sm: { padding: '16px' },
    md: { padding: '24px' },
    lg: { padding: '32px' },
    xl: { padding: '40px' },
  }

  const shadows = {
    default: 'var(--shadow-sm)',
    elevated: 'var(--shadow-lg)',
  }

  const Component = animate ? motion.div : 'div'
  const animateProps = animate ? {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  } : {}

  return (
    <Component
      ref={ref}
      className={clsx(
        'overflow-hidden rounded-[var(--radius-xl)]',
        hover && 'cursor-pointer',
        className
      )}
      style={{
        ...variants[variant],
        ...paddings[padding],
        boxShadow: shadows[variant] || 'var(--shadow-sm)',
        transition: hover ? 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)' : undefined,
        ...(hover ? {
          transform: 'translateY(0)',
        } : {}),
      }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
        e.currentTarget.style.transform = 'translateY(-3px)'
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.boxShadow = shadows[variant] || 'var(--shadow-sm)'
        e.currentTarget.style.transform = 'translateY(0)'
      } : undefined}
      {...animateProps}
      {...props}
    >
      {children}
    </Component>
  )
})

Card.displayName = 'Card'

export const CardHeader = ({ title, subtitle, icon: Icon, action, className }) => (
  <div className={clsx('flex items-start justify-between mb-6', className)}>
    <div className="flex items-center gap-4">
      {Icon && (
        <div className="p-3 rounded-[var(--radius-md)]" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, transparent), color-mix(in srgb, var(--primary) 5%, transparent))' }}>
          <Icon size={22} style={{ color: 'var(--primary)' }} strokeWidth={2} />
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>{title}</h3>
        {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--on-surface-variant)' }}>{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
)

export default Card
