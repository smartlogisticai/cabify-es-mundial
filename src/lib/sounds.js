/**
 * sounds.js — sound effects + stadium background audio
 *
 * Short effects use Web Audio API. Background ambience uses an HTML Audio
 * element (stadium.MP3) so it loops perfectly without CPU generation.
 * Mute state is stored in localStorage and shared via module-level variable.
 */
import stadiumSrc from '../assets/stadium.MP3'

// ─── Mute state (module-level, shared across all imports) ────────────────────
let __muted = typeof localStorage !== 'undefined'
  && localStorage.getItem('sounds_muted') === 'true'

export function isMuted() { return __muted }

export function setMuted(value) {
  __muted = value
  try { localStorage.setItem('sounds_muted', String(value)) } catch (_) {}
  if (value) stopAmbient(600)
  else startAmbient()
}

// ─── AudioContext singleton (for short effects) ───────────────────────────────
let _ctx = null

// ─── Background audio element ─────────────────────────────────────────────────
let _bgAudio = null
let _fadeInterval = null

function getCtx() {
  if (__muted) return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!_ctx || _ctx.state === 'closed') _ctx = new AC()
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

// ─── Soft click — 65 ms ──────────────────────────────────────────────────────
export function playClick() {
  const c = getCtx(); if (!c) return
  const now = c.currentTime
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(260, now)
  osc.frequency.exponentialRampToValueAtTime(85, now + 0.055)
  g.gain.setValueAtTime(0.10, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.065)
  osc.connect(g); g.connect(c.destination)
  osc.start(now); osc.stop(now + 0.07)
}

// ─── Short tick — 12 ms  (+/- buttons) ───────────────────────────────────────
export function playTick() {
  const c = getCtx(); if (!c) return
  const now = c.currentTime
  const size = Math.floor(c.sampleRate * 0.011)
  const buf = c.createBuffer(1, size, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < size; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / size)
  const src = c.createBufferSource()
  src.buffer = buf
  const hp = c.createBiquadFilter()
  hp.type = 'highpass'; hp.frequency.value = 4500
  const g = c.createGain()
  g.gain.setValueAtTime(0.15, now)
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.012)
  src.connect(hp); hp.connect(g); g.connect(c.destination)
  src.start(now)
}

// ─── Goal sound — whistle (FM) + crowd burst — 750 ms ────────────────────────
export function playGoal() {
  const c = getCtx(); if (!c) return
  const now = c.currentTime
  const T = 0.75 // total duration

  // Whistle via FM
  const mod = c.createOscillator()
  const modG = c.createGain()
  const carrier = c.createOscillator()
  const whistleG = c.createGain()
  mod.type = 'sine'; mod.frequency.value = 68; modG.gain.value = 480
  carrier.type = 'sine'; carrier.frequency.value = 2750
  mod.connect(modG); modG.connect(carrier.frequency)
  whistleG.gain.setValueAtTime(0, now)
  whistleG.gain.linearRampToValueAtTime(0.28, now + 0.02)
  whistleG.gain.setValueAtTime(0.28, now + 0.28)
  whistleG.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
  carrier.connect(whistleG); whistleG.connect(c.destination)
  mod.start(now); carrier.start(now)
  mod.stop(now + 0.52); carrier.stop(now + 0.52)

  // Short crowd yelp (pink noise, 0.65 s)
  const len = Math.floor(c.sampleRate * 0.65)
  const cbuf = c.createBuffer(1, len, c.sampleRate)
  const cd = cbuf.getChannelData(0)
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1
    b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759
    b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856
    b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980
    cd[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)/7; b6=w*0.115926
  }
  const cheer = c.createBufferSource()
  cheer.buffer = cbuf
  const hp = c.createBiquadFilter()
  hp.type = 'highpass'; hp.frequency.value = 280
  const mid = c.createBiquadFilter()
  mid.type = 'peaking'; mid.frequency.value = 700; mid.Q.value = 0.8; mid.gain.value = 8
  const cheerG = c.createGain()
  cheerG.gain.setValueAtTime(0, now + 0.08)
  cheerG.gain.linearRampToValueAtTime(0.20, now + 0.22)
  cheerG.gain.setValueAtTime(0.20, now + 0.48)
  cheerG.gain.linearRampToValueAtTime(0, now + T)
  cheer.connect(hp); hp.connect(mid); mid.connect(cheerG); cheerG.connect(c.destination)
  cheer.start(now + 0.08); cheer.stop(now + T + 0.05)
}

// ─── Success arpeggio — C5·E5·G5·C6 — 550 ms ─────────────────────────────────
export function playSuccess() {
  const c = getCtx(); if (!c) return
  const now = c.currentTime
  ;[523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
    const t = now + i * 0.09
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.15, t + 0.015)
    g.gain.setValueAtTime(0.15, t + 0.07)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
    osc.connect(g); g.connect(c.destination)
    osc.start(t); osc.stop(t + 0.30)
  })
}

// ─── Global button listener ───────────────────────────────────────────────────
export function initGlobalButtonSounds() {
  document.addEventListener('click', (e) => {
    if (__muted) return
    const btn = e.target.closest('button:not([disabled]):not([data-nosound])')
    if (!btn) return
    const s = btn.dataset.sound
    if (s === 'tick') playTick()
    else if (s === 'success') playSuccess()
    else playClick()
  }, { passive: true })
}

// ─── Ambient stadium crowd — stadium.MP3 (global, persistent) ────────────────
export function startAmbient() {
  if (__muted) return
  if (_bgAudio && !_bgAudio.paused) return  // already playing

  if (!_bgAudio) {
    _bgAudio = new Audio(stadiumSrc)
    _bgAudio.loop = true
    _bgAudio.volume = 0
  }

  _bgAudio.play().then(() => {
    // Fade in to 0.15 over 2 seconds (40 steps × 50 ms)
    clearInterval(_fadeInterval)
    const target = 0.15
    const steps = 40
    const stepVol = target / steps
    let i = 0
    _fadeInterval = setInterval(() => {
      i++
      _bgAudio.volume = Math.min(target, i * stepVol)
      if (i >= steps) clearInterval(_fadeInterval)
    }, 50)
  }).catch(() => {})
}

export function stopAmbient(fadeMs = 800) {
  if (!_bgAudio || _bgAudio.paused) return
  clearInterval(_fadeInterval)
  const steps = 20
  const stepMs = fadeMs / steps
  const startVol = _bgAudio.volume
  let i = 0
  _fadeInterval = setInterval(() => {
    i++
    _bgAudio.volume = Math.max(0, startVol * (1 - i / steps))
    if (i >= steps) {
      clearInterval(_fadeInterval)
      _bgAudio.pause()
    }
  }, stepMs)
}
