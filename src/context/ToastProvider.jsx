import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import ToastContext from './toast-context'

let toastId = 0

const ICONS = { success: CheckCircle2, info: Info, error: AlertTriangle }
const COLORS = { success: 'var(--secondary)', info: 'var(--primary)', error: 'var(--error)' }

const Toast = ({ toast }) => {
  const Icon = ICONS[toast.type] || ICONS.info
  const color = COLORS[toast.type] || COLORS.info
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl shadow-lg"
      style={{ backgroundColor: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)' }}
    >
      <Icon size={18} style={{ color }} />
      <span className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--on-surface)' }}>{toast.message}</span>
    </motion.div>
  )
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => dismiss(id), 2800)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[120] flex flex-col items-center gap-2 pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map(t => <Toast key={t.id} toast={t} />)}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
