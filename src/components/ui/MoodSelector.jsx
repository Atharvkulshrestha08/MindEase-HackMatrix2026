import { motion } from 'framer-motion'

const moods = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'calm', emoji: '😌', label: 'Calm' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'sad', emoji: '😔', label: 'Sad' },
]

const MoodSelector = ({ selectedMood, onSelect, size = 'md' }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {moods.map((mood, index) => {
        const isSelected = selectedMood === mood.value
        return (
          <motion.button
            key={mood.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
            onClick={() => onSelect(mood.value)}
            className="flex flex-col items-center gap-2.5 transition-all duration-300"
            style={{
              padding: size === 'sm' ? '12px 16px' : '18px 22px',
              backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface-container-lowest)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: isSelected
                ? '0 4px 16px -2px rgba(0, 100, 145, 0.35), 0 2px 6px -2px rgba(0, 100, 145, 0.15)'
                : 'var(--shadow-xs)',
              border: isSelected ? 'none' : '1.5px solid var(--outline-variant)',
              transform: isSelected ? 'scale(1.08)' : undefined,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = 'var(--outline-variant)'
                e.currentTarget.style.boxShadow = 'var(--shadow-xs)'
                e.currentTarget.style.transform = ''
              }
            }}
          >
            <span style={{ 
              fontSize: size === 'sm' ? '28px' : '34px',
              transform: isSelected ? 'scale(1.1)' : undefined,
              transition: 'transform 0.3s ease',
              display: 'block',
            }}>
              {mood.emoji}
            </span>
            <span style={{ 
              fontSize: size === 'sm' ? '12px' : '13px',
              fontWeight: 600,
              letterSpacing: '0.01em',
              color: isSelected ? 'white' : 'var(--on-surface-variant)',
            }}>
              {mood.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

export default MoodSelector
