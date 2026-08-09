import { useNavigate } from 'react-router-dom'
import { User, Bell, Shield, LogOut, Moon, Sun, Database, Sparkles, Trash2, AlertTriangle, Download, Upload } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { useDarkMode } from '../hooks/useDarkMode'
import useLocalStorage from '../hooks/useLocalStorage'
import { buildDemoMoodLogs, buildDemoJournalEntries, buildDemoPlants } from '../lib/demoData'

const DATA_KEYS = ['moodLogs', 'journalEntries', 'gardenPlants', 'companionMessages', 'mindease_profile', 'darkMode', 'notificationsEnabled']

const Settings = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useDarkMode()
  const [notifications, setNotifications] = useLocalStorage('notificationsEnabled', true, v => typeof v === 'boolean')
  const [, setMoodLogs] = useLocalStorage('moodLogs', [], v => Array.isArray(v))
  const [, setJournalEntries] = useLocalStorage('journalEntries', [], v => Array.isArray(v))
  const [, setGardenPlants] = useLocalStorage('gardenPlants', [], v => Array.isArray(v))
  const { showToast } = useToast()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    showToast('Signed out successfully', 'info')
  }

  const loadDemoData = () => {
    setMoodLogs(buildDemoMoodLogs())
    setJournalEntries(buildDemoJournalEntries())
    setGardenPlants(buildDemoPlants())
    showToast('Demo data loaded — replace it with your own anytime', 'success')
  }

  const clearAllData = () => {
    setMoodLogs([])
    setJournalEntries([])
    setGardenPlants([])
    showToast('All app data cleared', 'info')
  }

  const handleExport = () => {
    const payload = {}
    DATA_KEYS.forEach(key => {
      const raw = window.localStorage.getItem(key)
      if (raw !== null) {
        try { payload[key] = JSON.parse(raw) } catch { payload[key] = raw }
      }
    })
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mindease-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    showToast('Backup downloaded 📦', 'success')
  }

  const handleImportFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result)
        if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) throw new Error('Invalid backup file')
        DATA_KEYS.forEach(key => {
          if (key in payload) window.localStorage.setItem(key, JSON.stringify(payload[key]))
        })
        showToast('Backup restored — reloading…', 'success')
        setTimeout(() => window.location.reload(), 800)
      } catch {
        showToast("Couldn't read that file — please use a MindEase backup", 'error')
      }
    }
    reader.readAsText(file)
  }

  const handleToggle = (label, nextValue, onChange) => {
    onChange(nextValue)
    showToast(`${label} ${nextValue ? 'enabled' : 'disabled'}`, 'success')
  }

  const Toggle = ({ checked, onChange }) => (
    <div onClick={(e) => { e.stopPropagation(); onChange(!checked) }}
      className="w-14 h-7 rounded-full cursor-pointer transition-colors relative"
      style={{ backgroundColor: checked ? 'var(--primary)' : 'var(--surface-container-highest)' }}>
      <div className="w-6 h-6 rounded-full bg-white absolute top-0.5 transition-transform"
        style={{ left: checked ? '30px' : '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
    </div>
  )

  const settingsGroups = [
    { title: 'Account', items: [
      { icon: User, label: 'Profile', description: user?.user_metadata?.full_name || 'User' },
      { icon: Bell, label: 'Notifications', description: notifications ? 'On' : 'Off', toggle: true, checked: notifications, onChange: (v) => handleToggle('Notifications', v, setNotifications) },
    ]},
    { title: 'Appearance', items: [
      { icon: darkMode ? Moon : Sun, label: 'Dark Mode', description: darkMode ? 'On' : 'Off', toggle: true, checked: darkMode, onChange: (v) => handleToggle('Dark mode', v, setDarkMode) },
    ]},
    { title: 'Support', items: [
      { icon: Shield, label: 'Privacy Policy', description: 'How we protect your data' },
      { icon: Shield, label: 'Terms of Service', description: 'Usage terms' },
    ]},
  ]

  return (
    <div className="max-w-2xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Settings</h1>
        <p className="text-lg" style={{ color: 'var(--on-surface-variant)' }}>Manage your account and preferences</p>
      </div>

      <Card padding="lg">
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 rounded-full flex items-center justify-center text-3xl"
            style={{ width: '72px', height: '72px', backgroundColor: 'color-mix(in srgb, var(--primary-container) 30%, transparent)' }}>🧘</div>
          <div>
            <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>{user?.user_metadata?.full_name || 'User'}</h2>
            <p style={{ color: 'var(--on-surface-variant)' }}>{user?.email}</p>
          </div>
        </div>
      </Card>

      {settingsGroups.map((group) => (
        <Card key={group.title} padding="none">
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--outline-variant)' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>{group.title}</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--outline-variant)' }}>
            {group.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-5 transition-colors"
                style={{ cursor: item.toggle ? 'pointer' : 'default' }}
                onClick={item.toggle ? () => item.onChange(!item.checked) : undefined}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-[12px]" style={{ backgroundColor: 'var(--surface-container)' }}>
                    <item.icon size={20} style={{ color: 'var(--on-surface-variant)' }} />
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: 'var(--on-surface)' }}>{item.label}</div>
                    <div className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{item.description}</div>
                  </div>
                </div>
                {item.toggle ? <Toggle checked={item.checked} onChange={item.onChange} /> : null}
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card padding="lg">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-[14px]" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-container) 30%, transparent)' }}>
            <Sparkles size={22} style={{ color: 'var(--primary)' }} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Load demo data</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--on-surface-variant)' }}>
              Sample mood check-ins, journal entries, and garden plants — clearly marked so you can explore the full experience before starting fresh. Your existing data is replaced.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" icon={Database} onClick={loadDemoData}>Load demo data</Button>
              <Button size="sm" variant="outline" icon={Download} onClick={handleExport}>Export backup</Button>
              <Button size="sm" variant="outline" icon={Upload} onClick={() => document.getElementById('import-backup-input')?.click()}>Import backup</Button>
              <Button size="sm" variant="danger" icon={Trash2} onClick={clearAllData}>Clear all data</Button>
              <input id="import-backup-input" type="file" accept="application/json,.json" className="hidden" onChange={handleImportFile} />
            </div>
          </div>
        </div>
      </Card>

      <Card padding="lg" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 6%, var(--surface))' }}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-[14px]" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 12%, transparent)' }}>
            <AlertTriangle size={22} style={{ color: 'var(--error)' }} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Your data stays on this device</h3>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
              MindEase stores everything locally in your browser. Nothing is uploaded. Clearing your browser data removes your journal, moods, and progress.
            </p>
          </div>
        </div>
      </Card>

      <Card padding="none">
        <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-3 p-5 transition-colors"
          style={{ color: 'var(--error)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--error) 8%, transparent)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <LogOut size={20} /><span className="font-medium">Sign Out</span>
        </button>
      </Card>
    </div>
  )
}

export default Settings
