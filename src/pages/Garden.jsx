import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sprout, Droplets, Sun, Award } from 'lucide-react'
import Card from '../components/ui/Card'
import useLocalStorage from '../hooks/useLocalStorage'
import { useToast } from '../hooks/useToast'
import { plantTypes } from '../data/mockData'

const DAY_MS = 1000 * 60 * 60 * 24

const Garden = () => {
  const [plants, setPlants] = useLocalStorage('gardenPlants', [], v => Array.isArray(v))
  const [showPicker, setShowPicker] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (plants.length === 0) return
    const now = Date.now()
    let didGrow = false
    const updated = plants.map(p => {
      if (p.growth >= 100) return p
      const last = p.lastWatered ? new Date(p.lastWatered).getTime() : p.id
      const daysSince = Math.max(0, Math.floor((now - last) / DAY_MS))
      if (daysSince < 1) return p
      const growth = Math.min(100, p.growth + daysSince * 8)
      didGrow = true
      return { ...p, growth }
    })
    if (didGrow) setPlants(updated)
  }, [plants, setPlants])

  const handlePlant = (plantType) => {
    if (plants.length >= 6) {
      showToast('Your garden is full! Water existing plants 🌿', 'info')
      return
    }
    setPlants([...plants, { id: Date.now(), type: plantType.id, name: plantType.name, emoji: plantType.emoji, growth: 0, lastWatered: new Date().toISOString() }])
    setShowPicker(false)
    showToast(`${plantType.emoji} ${plantType.name} planted!`, 'success')
  }

  const handleWater = (plantId) => {
    const plant = plants.find(p => p.id === plantId)
    if (!plant) return
    if (plant.growth >= 100) {
      showToast('Fully grown! 🎉', 'info')
      return
    }
    setPlants(plants.map(p => p.id === plantId && p.growth < 100 ? { ...p, growth: Math.min(100, p.growth + 20), lastWatered: new Date().toISOString() } : p))
    showToast('Watered! +20 growth 💧', 'success')
  }

  const getPlantEmoji = (plant, growth) => {
    const emojis = { sunflower: ['🫘', '🌱', '🌿', '🌻'], rose: ['🫘', '🌱', '🪴', '🌹'], tulip: ['🫘', '🌱', '🌿', '🌷'], cactus: ['🫘', '🌵', '🌵', '🌵'], tree: ['🫘', '🌱', '🌳', '🌳'] }
    const stage = growth >= 100 ? 3 : growth >= 60 ? 2 : growth >= 30 ? 1 : 0
    return emojis[plant.type]?.[stage] || '🌱'
  }

  return (
    <div className="max-w-6xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Habit Garden</h1>
          <p className="text-lg" style={{ color: 'var(--on-surface-variant)' }}>Complete activities to grow your plants</p>
        </div>
        <Card padding="sm" className="flex items-center gap-3">
          <Sprout size={20} style={{ color: 'var(--secondary)' }} />
          <span className="font-medium" style={{ color: 'var(--on-surface)' }}>{plants.length}/6 plants</span>
        </Card>
      </div>

      <Card padding="lg">
        {plants.length === 0 && (
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🪴</div>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Plant your first seed</h3>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>Each habit you complete helps your garden grow. Tap the + below to begin.</p>
          </div>
        )}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 min-h-[220px]">
          {plants.map((plant) => (
            <motion.div key={plant.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-3">
              <button onClick={() => handleWater(plant.id)} disabled={plant.growth >= 100}
                className="w-24 h-24 rounded-[20px] flex items-center justify-center text-5xl transition-all hover:scale-110"
                style={{ backgroundColor: 'var(--surface-container)' }}>
                {getPlantEmoji(plant, plant.growth)}
              </button>
              <span className="text-xs text-center" style={{ color: 'var(--on-surface-variant)' }}>{plant.name}</span>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-container-highest)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${plant.growth}%`, backgroundColor: 'var(--secondary)' }} />
              </div>
              {plant.growth < 100 && (
                <button onClick={() => handleWater(plant.id)} className="p-1.5 rounded-[10px] transition-colors"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--primary-container) 20%, transparent)', color: 'var(--primary)' }}>
                  <Droplets size={14} />
                </button>
              )}
            </motion.div>
          ))}
          {Array.from({ length: Math.max(0, 6 - plants.length) }).map((_, i) => (
            <button key={`empty-${i}`} onClick={() => setShowPicker(true)}
              className="w-24 h-24 rounded-[20px] flex items-center justify-center text-3xl transition-colors"
              style={{ border: '2px dashed var(--outline-variant)', color: 'var(--on-surface-variant)' }}>
              +
            </button>
          ))}
        </div>
      </Card>

      {showPicker && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowPicker(false)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
            <Card padding="lg" className="max-w-md w-full">
              <h2 className="text-2xl font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Choose a Plant</h2>
              <div className="grid grid-cols-2 gap-4">
                {plantTypes.map((plant) => (
                  <button key={plant.id} onClick={() => handlePlant(plant)}
                    className="p-5 rounded-[16px] text-center transition-colors"
                    style={{ backgroundColor: 'var(--surface-container-low)' }}>
                    <span className="text-4xl block mb-2">{plant.emoji}</span>
                    <span className="text-sm font-semibold block" style={{ color: 'var(--on-surface)' }}>{plant.name}</span>
                    <span className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>{plant.growthTime} days</span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-3 gap-5">
        {[
          { icon: Award, label: 'Fully Grown', value: plants.filter(p => p.growth >= 100).length, color: 'var(--secondary-container)', iconColor: 'var(--secondary)' },
          { icon: Sun, label: 'Total Growth', value: plants.reduce((acc, p) => acc + p.growth, 0), color: 'var(--primary-container)', iconColor: 'var(--primary)' },
          { icon: Sprout, label: 'Plants Planted', value: plants.length, color: 'var(--tertiary-container)', iconColor: 'var(--tertiary)' },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-[14px]" style={{ backgroundColor: `color-mix(in srgb, ${stat.color} 25%, transparent)` }}>
                <stat.icon size={20} style={{ color: stat.iconColor }} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>{stat.value}</div>
                <div className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Garden
