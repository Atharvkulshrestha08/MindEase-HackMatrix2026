import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2, Square, RotateCcw, RotateCw, Crown, Lock } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { playlists } from '../data/mockData'
import { playAmbience, stopAmbience, setVolume, getVolume } from '../lib/audioEngine'
import { isPremium, canPlaySong, consumeSong, getSongsRemaining, getDaysUntilReset, setPlan, getFreeSongLimit } from '../lib/subscription'
import { useToast } from '../hooks/useToast'

const formatTime = (s) => {
  if (!Number.isFinite(s) || s <= 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

const Music = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolumeState] = useState(getVolume())
  const [uploadedTrack, setUploadedTrack] = useState(null)
  const [audioTime, setAudioTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [premium, setPremium] = useState(isPremium())
  const [remaining, setRemaining] = useState(getSongsRemaining())
  const [showUpgrade, setShowUpgrade] = useState(false)
  const uploadAudioRef = useRef(null)
  const blobUrlRef = useRef(null)
  const consumedSongRef = useRef(null)
  const modeRef = useRef(null)
  const { showToast } = useToast()

  const startSong = (key) => {
    if (consumedSongRef.current === key) return true
    if (!canPlaySong()) {
      setShowUpgrade(true)
      showToast('Free song limit reached', 'error')
      return false
    }
    consumeSong()
    setRemaining(getSongsRemaining())
    consumedSongRef.current = key
    return true
  }

  const handlePlaylistSelect = (playlist) => {
    if (!startSong(`${playlist.id}-0`)) return
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    modeRef.current = 'playlist'
    setSelectedPlaylist(playlist)
    setCurrentTrack(0)
    setUploadedTrack(null)
    setAudioTime(0)
    setAudioDuration(0)
    playAmbience(playlist.id, 0)
    setIsPlaying(true)
    showToast(`${playlist.icon} ${playlist.title} playing`, 'success')
  }

  const togglePlay = () => {
    if (uploadedTrack) {
      const audio = uploadAudioRef.current
      if (!audio) return
      if (audio.paused) {
        audio.play()
      } else {
        audio.pause()
      }
      return
    }
    if (!selectedPlaylist) return
    if (isPlaying) {
      stopAmbience()
      setIsPlaying(false)
    } else {
      if (!startSong(`${selectedPlaylist.id}-${currentTrack}`)) return
      playAmbience(selectedPlaylist.id, currentTrack)
      setIsPlaying(true)
    }
  }

  const changeTrack = (index) => {
    if (uploadedTrack) return
    const next = Math.max(0, Math.min(tracks.length - 1, index))
    if (next === currentTrack) return
    if (!startSong(`${selectedPlaylist.id}-${next}`)) return
    setCurrentTrack(next)
    if (isPlaying) playAmbience(selectedPlaylist.id, next)
  }

  const handleStop = () => {
    const audio = uploadAudioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setAudioTime(0)
    stopAmbience()
    setIsPlaying(false)
  }

  const handleSkipAudio = (delta) => {
    const audio = uploadAudioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + delta))
    setAudioTime(audio.currentTime)
  }

  const handleSeekAudio = (e) => {
    const audio = uploadAudioRef.current
    if (!audio) return
    audio.currentTime = parseFloat(e.target.value)
    setAudioTime(audio.currentTime)
  }

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value) / 100
    setVolume(v)
    setVolumeState(v)
    if (uploadAudioRef.current) uploadAudioRef.current.volume = v
  }

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!startSong(`upload-${file.name}-${file.size}`)) {
      e.target.value = ''
      return
    }
    if (uploadAudioRef.current) {
      uploadAudioRef.current.pause()
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    const url = URL.createObjectURL(file)
    blobUrlRef.current = url
    modeRef.current = 'upload'
    setUploadedTrack({ name: file.name, url })
    setSelectedPlaylist(null)
    setCurrentTrack(0)
    setAudioTime(0)
    setAudioDuration(0)
    stopAmbience()
    setIsPlaying(true)
    e.target.value = ''
    showToast('Track uploaded 🎵', 'success')
  }

  const unlockPremium = () => {
    setPlan('premium')
    setPremium(true)
    setRemaining(Infinity)
    setShowUpgrade(false)
    showToast('Premium unlocked 🎉', 'success')
  }

  useEffect(() => {
    const audioEl = uploadAudioRef.current
    return () => {
      stopAmbience()
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
      if (audioEl) {
        audioEl.pause()
        audioEl.src = ''
        audioEl.load()
      }
    }
  }, [])

  const tracks = [
    { title: 'Gentle Rain', duration: '3:45' },
    { title: 'Forest Birds', duration: '4:12' },
    { title: 'Ocean Waves', duration: '5:30' },
    { title: 'Soft Piano', duration: '3:58' },
    { title: 'Wind Chimes', duration: '4:22' },
  ]

  const progressPct = uploadedTrack && audioDuration ? Math.min(100, (audioTime / audioDuration) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Music Space</h1>
        <p className="text-lg mb-4" style={{ color: 'var(--on-surface-variant)' }}>Ambient sounds to help you relax and focus</p>

        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full" style={{
          backgroundColor: premium ? 'color-mix(in srgb, var(--secondary) 10%, white)' : 'color-mix(in srgb, var(--primary) 8%, white)',
          border: `1px solid ${premium ? 'color-mix(in srgb, var(--secondary) 20%, transparent)' : 'color-mix(in srgb, var(--primary) 15%, transparent)'}`,
        }}>
          {premium ? (
            <><Crown size={16} style={{ color: 'var(--secondary)' }} /><span className="text-sm font-semibold" style={{ color: 'var(--secondary)' }}>Premium · Unlimited songs</span></>
          ) : (
            <><Music2 size={16} style={{ color: 'var(--primary)' }} /><span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
              {remaining} of {getFreeSongLimit()} free songs left
            </span></>
          )}
        </div>
        {!premium && remaining <= 0 && (
          <p className="text-sm mt-2" style={{ color: 'var(--error)' }}>
            Limit reached — upgrade to keep listening, or your free songs reset in {getDaysUntilReset()} days.
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
        {playlists.map((playlist, index) => (
          <motion.div key={playlist.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card hover padding="lg" className={`cursor-pointer w-[280px] h-[220px] flex flex-col items-center justify-center text-center ${selectedPlaylist?.id === playlist.id ? 'ring-2' : ''}`}
              style={selectedPlaylist?.id === playlist.id ? { '--tw-ring-color': 'var(--primary)' } : {}}
              onClick={() => handlePlaylistSelect(playlist)}>
              <div className="text-5xl mb-5">{playlist.icon}</div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>{playlist.title}</h3>
              <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{playlist.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Featured Track */}
      <div className="mt-4 mb-4 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Featured Track</h2>
        <Card padding="none" className="overflow-hidden bg-black rounded-[var(--radius-xl)] shadow-lg">
          <div className="h-64 relative w-full">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/EyjMgH7EBww" 
              title="Featured Music Track" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </Card>
      </div>

      {/* Premium Integration Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Your Personal Music</h2>
        <div className="flex flex-wrap justify-center gap-6">
          
          <Card padding="lg" className="relative w-[320px] overflow-hidden group">
            {!premium ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-[2px] transition-all" style={{ backgroundColor: 'rgba(248, 249, 255, 0.7)' }}>
                <div className="px-4 py-1.5 rounded-full mb-3 shadow-md font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #f5b041, #f39c12)', color: 'white' }}>
                  Premium Feature
                </div>
                <Button size="sm" variant="primary" onClick={unlockPremium}>Unlock Premium</Button>
              </div>
            ) : (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary) 8%, rgba(248, 249, 255, 0.85))' }}>
                <Crown size={22} style={{ color: 'var(--secondary)' }} className="mb-2" />
                <span className="font-semibold text-sm" style={{ color: 'var(--secondary)' }}>Unlocked</span>
              </div>
            )}
            <div className={premium ? '' : 'opacity-40'}>
              <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center mx-auto" style={{ backgroundColor: '#1DB954' }}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="white"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.66 12.9c.42.24.54.84.3 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.781-.18-.6.18-1.2.78-1.381 4.26-1.26 11.28-1.02 15.72 1.621.539.3.719 1.02.419 1.56-.299.54-1.02.72-1.56.42z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: 'var(--on-surface)' }}>Connect Spotify</h3>
              <p className="text-sm text-center" style={{ color: 'var(--on-surface-variant)' }}>Listen to your own playlists during meditation.</p>
            </div>
          </Card>

          <Card padding="lg" className="relative w-[320px] overflow-hidden group cursor-pointer hover:shadow-lg transition-all" onClick={() => document.getElementById('music-upload')?.click()}>
            <input type="file" id="music-upload" className="hidden" accept="audio/*" onChange={handleUpload} />
            <div>
              <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center mx-auto" style={{ backgroundColor: 'var(--primary)' }}>
                <Music2 size={32} color="white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: 'var(--on-surface)' }}>Upload Music</h3>
              <p className="text-sm text-center" style={{ color: 'var(--on-surface-variant)' }}>Add your own calming tracks directly from your device.</p>
              {uploadedTrack && (
                <p className="text-xs font-semibold text-center mt-3" style={{ color: 'var(--secondary)' }}>Now playing: {uploadedTrack.name}</p>
              )}
            </div>
          </Card>

        </div>
      </div>

      {(selectedPlaylist || uploadedTrack) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card padding="lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-36 h-36 rounded-[24px] flex items-center justify-center" style={{ backgroundColor: uploadedTrack ? 'color-mix(in srgb, var(--primary) 15%, white)' : `color-mix(in srgb, ${selectedPlaylist.color} 20%, transparent)` }}>
                <Music2 size={52} style={{ color: uploadedTrack ? 'var(--primary)' : selectedPlaylist.color }} />
              </div>
              <div className="flex-1 text-center md:text-left w-full">
                <h3 className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>{uploadedTrack ? uploadedTrack.name : tracks[currentTrack].title}</h3>
                <p style={{ color: 'var(--on-surface-variant)' }}>{uploadedTrack ? 'Your uploaded track' : selectedPlaylist.title}</p>
                <div className="mt-5">
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-container-highest)' }}>
                    <div className="h-full rounded-full" style={{ width: `${progressPct}%`, backgroundColor: uploadedTrack ? 'var(--primary)' : selectedPlaylist.color, transition: 'width 0.2s linear' }} />
                  </div>
                  <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                    <span>{uploadedTrack ? formatTime(audioTime) : (isPlaying ? 'Playing' : 'Paused')}</span>
                    <span>{uploadedTrack ? formatTime(audioDuration) : tracks[currentTrack].duration}</span>
                  </div>
                  {uploadedTrack && (
                    <input
                      type="range"
                      min="0"
                      max={audioDuration || 0}
                      step="0.1"
                      value={audioTime}
                      onChange={handleSeekAudio}
                      className="w-full mt-2 accent-[var(--primary)]"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {uploadedTrack ? (
                  <button onClick={() => handleSkipAudio(-10)} title="Rewind 10 seconds" className="p-2.5 rounded-full transition-colors hover:bg-[var(--surface-container)]"
                    style={{ color: 'var(--on-surface-variant)' }}><RotateCcw size={22} /></button>
                ) : (
                  <button onClick={() => changeTrack(currentTrack - 1)} disabled={!!uploadedTrack} className="p-2.5 rounded-full transition-colors disabled:opacity-30"
                    style={{ color: 'var(--on-surface-variant)' }}><SkipBack size={26} /></button>
                )}
                <button onClick={togglePlay} className="p-5 rounded-full transition-colors"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }}>
                  {isPlaying ? <Pause size={30} /> : <Play size={30} className="ml-1" />}
                </button>
                {uploadedTrack ? (
                  <button onClick={() => handleSkipAudio(10)} title="Forward 10 seconds" className="p-2.5 rounded-full transition-colors hover:bg-[var(--surface-container)]"
                    style={{ color: 'var(--on-surface-variant)' }}><RotateCw size={22} /></button>
                ) : (
                  <button onClick={() => changeTrack(currentTrack + 1)} disabled={!!uploadedTrack} className="p-2.5 rounded-full transition-colors disabled:opacity-30"
                    style={{ color: 'var(--on-surface-variant)' }}><SkipForward size={26} /></button>
                )}
                <button onClick={handleStop} title="Stop" className="p-2.5 rounded-full transition-colors hover:bg-[var(--surface-container)]"
                  style={{ color: 'var(--error)' }}><Square size={22} /></button>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <Volume2 size={20} style={{ color: 'var(--on-surface-variant)' }} />
                <input type="range" min="0" max="100" value={Math.round(volume * 100)} onChange={handleVolume} className="w-28 accent-[var(--primary)]" />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {selectedPlaylist && !uploadedTrack && (
        <Card padding="none">
          <div className="divide-y" style={{ borderColor: 'var(--outline-variant)' }}>
            {tracks.map((track, index) => (
              <button key={track.title} onClick={() => changeTrack(index)}
                className="w-full flex items-center justify-between p-5 transition-colors"
                style={{ backgroundColor: currentTrack === index ? 'color-mix(in srgb, var(--primary-container) 10%, transparent)' : 'transparent' }}>
                <div className="flex items-center gap-4">
                  <span className="w-7" style={{ color: 'var(--on-surface-variant)' }}>
                    {currentTrack === index && isPlaying ? <Music2 size={16} style={{ color: 'var(--primary)' }} /> : index + 1}
                  </span>
                  <span className="font-medium" style={{ color: 'var(--on-surface)' }}>{track.title}</span>
                </div>
                <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{track.duration}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      <audio
        ref={uploadAudioRef}
        src={uploadedTrack?.url}
        autoPlay
        className="hidden"
        onPlay={() => { if (modeRef.current === 'upload') setIsPlaying(true) }}
        onPause={() => { if (modeRef.current === 'upload') setIsPlaying(false) }}
        onEnded={() => { if (modeRef.current === 'upload') { setIsPlaying(false); setAudioTime(0) } }}
        onLoadedMetadata={(e) => { setAudioDuration(e.target.duration || 0); setAudioTime(0) }}
        onTimeUpdate={(e) => setAudioTime(e.target.currentTime)}
      />

      {showUpgrade && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={() => setShowUpgrade(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}>
            <Card padding="xl" className="max-w-md text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 10%, white)' }}>
                <Lock size={28} style={{ color: 'var(--error)' }} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>Free song limit reached</h3>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--on-surface-variant)' }}>
                You've used all {getFreeSongLimit()} free songs for this cycle. Upgrade to Premium for unlimited listening, or your free songs reset in {getDaysUntilReset()} days.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="primary" onClick={unlockPremium}>Unlock Premium</Button>
                <Button variant="ghost" onClick={() => setShowUpgrade(false)}>Later</Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Music
