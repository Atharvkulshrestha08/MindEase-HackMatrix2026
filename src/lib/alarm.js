let alarmCtx = null
let master = null
let active = false
let timer = null

/**
 * Start a loud two-tone siren to draw attention in an emergency.
 * Safe to call from a user gesture (e.g. an onClick handler).
 */
export const startAlarm = () => {
  if (active) return
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return
  const ctx = new AudioCtx()
  alarmCtx = ctx
  active = true

  master = ctx.createGain()
  master.gain.value = 0.45
  master.connect(ctx.destination)

  const osc = ctx.createOscillator()
  osc.type = 'square'
  osc.frequency.value = 880
  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(0.0001, ctx.currentTime)
  oscGain.gain.setTargetAtTime(0.5, ctx.currentTime, 0.02)
  osc.connect(oscGain)
  oscGain.connect(master)
  osc.start()

  let high = false
  timer = setInterval(() => {
    if (!alarmCtx) return
    high = !high
    osc.frequency.setTargetAtTime(high ? 1245 : 880, alarmCtx.currentTime, 0.12)
  }, 600)
}

export const stopAlarm = () => {
  if (!active) return
  active = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  const ctx = alarmCtx
  const masterNode = master
  alarmCtx = null
  master = null
  try {
    masterNode?.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05)
    setTimeout(() => {
      try { ctx?.close() } catch { /* noop */ }
    }, 350)
  } catch { /* noop */ }
}

export const isAlarmActive = () => active
