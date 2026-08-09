let ctx = null
let master = null
let activeType = null
let cleanupFns = []
let currentVolume = 0.7

const createNoiseBuffer = (audioCtx, seconds = 2, brown = false) => {
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * seconds, audioCtx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1
    if (brown) {
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    } else {
      data[i] = white
    }
  }
  return buffer
}

const addOsc = (type, freq, detune, gain, oscType = 'sine') => {
  const osc = ctx.createOscillator()
  osc.type = oscType
  osc.frequency.value = freq
  if (detune) osc.detune.value = detune
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, ctx.currentTime)
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 3)
  osc.connect(g)
  g.connect(master)
  osc.start()
  cleanupFns.push(() => { try { osc.stop() } catch { /* noop */ } })
  return { osc, gain: g }
}

const addNoise = (type, gain, filterType = 'lowpass', freq = 1000, brown = false) => {
  const src = ctx.createBufferSource()
  src.buffer = createNoiseBuffer(ctx, 2, brown)
  src.loop = true
  const filter = ctx.createBiquadFilter()
  filter.type = filterType
  filter.frequency.value = freq
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, ctx.currentTime)
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 3)
  src.connect(filter)
  filter.connect(g)
  g.connect(master)
  src.start()
  cleanupFns.push(() => { try { src.stop() } catch { /* noop */ } })
  return { src, filter, gain: g }
}

const addLFO = (target, min, max, rate) => {
  const lfo = ctx.createOscillator()
  lfo.frequency.value = rate
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = (max - min) / 2
  lfo.connect(lfoGain)
  lfoGain.connect(target)
  const offset = ctx.createGain()
  offset.gain.value = min + (max - min) / 2
  offset.connect(target)
  lfo.start()
  cleanupFns.push(() => { try { lfo.stop() } catch { /* noop */ } })
}

const buildPatches = {
  lofi: (variant) => {
    const base = 220 + variant * 5
    const chord = [1, 1.5, 2, 2.5]
    chord.forEach((ratio, i) => {
      const osc = addOsc('lofi', base * ratio, (Math.random() - 0.5) * 12, i === 0 ? 0.05 : 0.035, 'triangle')
      addLFO(osc.gain.gain, 0.015, 0.05, 0.08 + i * 0.02)
    })
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 900
    filter.connect(master)
    const crackle = addNoise('lofi', 0.008, 'highpass', 3500, false)
    crackle.src.disconnect(crackle.filter)
    crackle.filter.disconnect(crackle.gain)
    crackle.src.connect(filter)
    filter.connect(crackle.gain)
  },
  nature: (variant) => {
    addLFO(addNoise('nature', 0.14, 'lowpass', 950 + variant * 40, false).filter.frequency, 700, 1300, 0.3)
    addNoise('nature', 0.1, 'lowpass', 420, true)
  },
  focus: (variant) => {
    addOsc('focus', 110 + variant, 0, 0.05)
    addOsc('focus', 220 + variant * 2, 0, 0.04)
    addOsc('focus', 220 + variant * 2 + 0.7, 0, 0.035)
    addOsc('focus', 440 + variant * 2, 0, 0.02)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1200
    filter.connect(master)
    addLFO(filter.frequency, 800, 1600, 0.05)
  },
  calm: (variant) => {
    const base = 196 + variant * 4
    addOsc('calm', base * 0.5, 0, 0.05)
    addOsc('calm', base * 0.75, 0, 0.04)
    addOsc('calm', base, 4, 0.03, 'sine')
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 600
    filter.connect(master)
    addLFO(filter.frequency, 400, 800, 0.04)
  },
}

export const playAmbience = (type, variant = 0) => {
  if (!buildPatches[type]) return
  stopAmbience()
  ctx = new (window.AudioContext || window.webkitAudioContext)()
  master = ctx.createGain()
  master.gain.value = currentVolume
  master.connect(ctx.destination)
  activeType = type
  buildPatches[type](variant)
}

export const stopAmbience = () => {
  if (!ctx) return
  const ctxToClose = ctx
  const masterToFade = master
  try {
    cleanupFns.forEach(fn => fn())
    cleanupFns = []
    const now = ctxToClose.currentTime
    masterToFade?.gain.linearRampToValueAtTime(0.0001, now + 0.3)
    setTimeout(() => { ctxToClose.close().catch(() => {}) }, 400)
  } catch { /* noop */ }
  ctx = null
  master = null
  activeType = null
}

export const setVolume = (v) => {
  currentVolume = v
  if (master && ctx) {
    master.gain.setTargetAtTime(v, ctx.currentTime, 0.02)
  }
}

export const getVolume = () => currentVolume
export const isPlaying = () => activeType !== null
export const getActiveType = () => activeType
