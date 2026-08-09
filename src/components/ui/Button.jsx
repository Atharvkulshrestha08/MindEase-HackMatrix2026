import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  fullWidth,
  icon: Icon,
  iconPosition = 'left',
  style,
  ...props
}, ref) => {
  const baseStyles = {
    primary: {
      background: 'linear-gradient(135deg, #006491 0%, #0089c7 100%)',
      color: 'white',
      boxShadow: '0 2px 8px -2px rgba(0, 100, 145, 0.35), 0 1px 3px -1px rgba(0, 100, 145, 0.15)',
    },
    secondary: {
      background: 'linear-gradient(135deg, #006d3d 0%, #00a856 100%)',
      color: 'white',
      boxShadow: '0 2px 8px -2px rgba(0, 109, 61, 0.35), 0 1px 3px -1px rgba(0, 109, 61, 0.15)',
    },
    tertiary: {
      backgroundColor: 'var(--tertiary)',
      color: 'var(--on-tertiary)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary)',
      border: '1.5px solid var(--outline-variant)',
      boxShadow: 'none',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--on-surface-variant)',
      boxShadow: 'none',
    },
    danger: {
      backgroundColor: 'var(--error)',
      color: 'var(--on-error)',
      boxShadow: '0 2px 8px -2px rgba(186, 26, 26, 0.35)',
    },
  }

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '13px', borderRadius: '10px' },
    md: { padding: '10px 20px', fontSize: '14px', borderRadius: '12px' },
    lg: { padding: '14px 28px', fontSize: '15px', borderRadius: '14px' },
    xl: { padding: '18px 36px', fontSize: '16px', borderRadius: '16px' },
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2.5 font-medium',
        'transition-all duration-200',
        'active:scale-[0.97]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        fullWidth && 'w-full',
        className
      )}
      style={{
        ...baseStyles[variant],
        ...sizes[size],
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
        '--tw-ring-color': 'var(--primary)',
      }}
      onMouseEnter={(e) => {
        if (disabled) return
        if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 6%, transparent)'
          e.currentTarget.style.borderColor = 'var(--primary)'
        } else if (variant === 'ghost') {
          e.currentTarget.style.backgroundColor = 'var(--surface-container)'
        } else {
          e.currentTarget.style.filter = 'brightness(1.08)'
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = variant === 'primary'
            ? '0 4px 16px -2px rgba(0, 100, 145, 0.4), 0 2px 6px -2px rgba(0, 100, 145, 0.2)'
            : variant === 'secondary'
            ? '0 4px 16px -2px rgba(0, 109, 61, 0.4), 0 2px 6px -2px rgba(0, 109, 61, 0.2)'
            : '0 4px 16px -2px rgba(0, 0, 0, 0.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.borderColor = 'var(--outline-variant)'
        } else if (variant === 'ghost') {
          e.currentTarget.style.backgroundColor = 'transparent'
        } else {
          e.currentTarget.style.filter = ''
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = baseStyles[variant]?.boxShadow || ''
        }
      }}
      {...props}
    >
      {loading ? (
        <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 15 : size === 'xl' ? 22 : 18} strokeWidth={2} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 15 : size === 'xl' ? 22 : 18} strokeWidth={2} />}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
