import { motion } from 'framer-motion'
import { Phone, Clock, AlertTriangle } from 'lucide-react'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { emergencyResources } from '../data/mockData'

const Resources = () => {
  return (
    <div className="max-w-4xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Emergency Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[24px]"
        style={{ backgroundColor: 'color-mix(in srgb, var(--error) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--error) 20%, transparent)' }}>
        <div className="flex items-start gap-5">
          <div className="p-3 rounded-[14px]" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 12%, transparent)' }}>
            <AlertTriangle size={26} style={{ color: 'var(--error)' }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>In Crisis?</h2>
            <p className="text-base mb-5" style={{ color: 'var(--on-surface-variant)' }}>If you or someone you know is in immediate danger, please call emergency services immediately.</p>
            <Button variant="danger" size="lg" icon={Phone} onClick={() => window.open('tel:112', '_self')}>Call Emergency: 112</Button>
          </div>
        </div>
      </motion.div>

      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Emergency Resources</h1>
        <p className="text-lg" style={{ color: 'var(--on-surface-variant)' }}>Professional support is always available</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {emergencyResources.map((resource, index) => (
          <motion.div key={resource.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card padding="lg" className="h-full">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>{resource.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{resource.description}</p>
                </div>
                <div className="p-3 rounded-[14px]" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-container) 20%, transparent)' }}>
                  <Phone size={20} style={{ color: 'var(--primary)' }} />
                </div>
              </div>
              <div className="flex flex-col gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <Phone size={16} style={{ color: 'var(--on-surface-variant)' }} />
                  <a href={`tel:${resource.number}`} className="font-semibold" style={{ color: 'var(--primary)' }}>{resource.number}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} style={{ color: 'var(--on-surface-variant)' }} />
                  <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{resource.available}</span>
                </div>
              </div>
              <Button variant="outline" fullWidth icon={Phone} onClick={() => window.open(`tel:${resource.number}`)}>Call Now</Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle size={24} style={{ color: 'var(--error)' }} />
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Understanding the Data</h2>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>Visualizations on global suicide trends.</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-[16px] overflow-hidden shadow-sm" style={{ border: '1px solid var(--outline-variant)' }}>
            <img src="/images/suicide-data/years and suicide.png" alt="Suicide by years" className="w-full h-auto object-cover" />
            <div className="p-3 text-center text-sm font-medium" style={{ backgroundColor: 'var(--surface-container-low)', color: 'var(--on-surface)' }}>Trends Over Years</div>
          </div>
          <div className="rounded-[16px] overflow-hidden shadow-sm" style={{ border: '1px solid var(--outline-variant)' }}>
            <img src="/images/suicide-data/age & suicide.png" alt="Suicide by age" className="w-full h-auto object-cover" />
            <div className="p-3 text-center text-sm font-medium" style={{ backgroundColor: 'var(--surface-container-low)', color: 'var(--on-surface)' }}>Breakdown by Age Group</div>
          </div>
          <div className="rounded-[16px] overflow-hidden shadow-sm" style={{ border: '1px solid var(--outline-variant)' }}>
            <img src="/images/suicide-data/gender and suicide.png" alt="Suicide by gender" className="w-full h-auto object-cover" />
            <div className="p-3 text-center text-sm font-medium" style={{ backgroundColor: 'var(--surface-container-low)', color: 'var(--on-surface)' }}>Gender Disparities</div>
          </div>
          <div className="rounded-[16px] overflow-hidden shadow-sm" style={{ border: '1px solid var(--outline-variant)' }}>
            <img src="/images/suicide-data/gdp and suicide.png" alt="Suicide vs GDP" className="w-full h-auto object-cover" />
            <div className="p-3 text-center text-sm font-medium" style={{ backgroundColor: 'var(--surface-container-low)', color: 'var(--on-surface)' }}>GDP & Economic Impact</div>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <CardHeader title="Quick Self-Help" subtitle="Things you can do right now" />
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { title: 'Deep Breathing', description: 'Take 5 slow, deep breaths. In for 4, hold for 4, out for 6.', emoji: '🌬️' },
            { title: 'Ground Yourself', description: 'Name 5 things you can see, 4 you can touch, 3 you hear.', emoji: '🌍' },
            { title: 'Move Your Body', description: 'Stand up, stretch, or take a short walk if possible.', emoji: '🏃' },
            { title: 'Reach Out', description: "Text or call someone you trust. You don't have to face this alone.", emoji: '💬' },
          ].map((tip) => (
            <div key={tip.title} className="p-5 rounded-[16px]" style={{ backgroundColor: 'var(--surface-container-low)' }}>
              <span className="text-3xl mb-3 block">{tip.emoji}</span>
              <h4 className="font-semibold mb-1" style={{ color: 'var(--on-surface)' }}>{tip.title}</h4>
              <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{tip.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="md">
        <p className="text-sm text-center" style={{ color: 'var(--on-surface-variant)' }}>
          MindEase is not a substitute for professional medical advice. If you're in crisis, please reach out to the helplines above.
        </p>
      </Card>
    </div>
  )
}

export default Resources
