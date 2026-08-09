import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className,
  containerClassName,
  style,
  ...props
}, ref) => {
  return (
    <div className={clsx('flex flex-col gap-2', containerClassName)}>
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-body)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--on-surface-variant)' }}>
            <Icon size={18} strokeWidth={1.8} />
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-4 py-3.5',
            'transition-all duration-200',
            'placeholder:opacity-40',
            'focus:outline-none',
            Icon && 'pl-12',
            error ? 'border-2 border-red-400 focus:border-red-500' : 'border-2 border-transparent focus:border-[var(--primary)]',
            className
          )}
          style={{
            backgroundColor: 'var(--surface-container-low)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--on-surface)',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            boxShadow: 'inset 0 1px 2px rgba(0,20,40,0.04)',
            ...style,
          }}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className="text-xs" style={{ color: error ? 'var(--error)' : 'var(--on-surface-variant)' }}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className,
  containerClassName,
  style,
  ...props
}, ref) => {
  return (
    <div className={clsx('flex flex-col gap-2', containerClassName)}>
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-body)' }}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={clsx(
          'w-full px-4 py-3.5 resize-none',
          'transition-all duration-200',
          'placeholder:opacity-40',
          'focus:outline-none',
          error ? 'border-2 border-red-400 focus:border-red-500' : 'border-2 border-transparent focus:border-[var(--primary)]',
          className
        )}
        style={{
          backgroundColor: 'var(--surface-container-low)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--on-surface)',
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          lineHeight: '1.65',
          boxShadow: 'inset 0 1px 2px rgba(0,20,40,0.04)',
          ...style,
        }}
        {...props}
      />
      {(error || helperText) && (
        <p className="text-xs" style={{ color: error ? 'var(--error)' : 'var(--on-surface-variant)' }}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Input
