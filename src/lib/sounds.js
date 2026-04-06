/**
 * sounds.js — Web Audio API sound effects (no external files)
 *
 * Usage:
 *   import { playGoal, playSuccess } from '../lib/sounds'
 *
 * Global button sounds are activated via initGlobalButtonSounds() in App.jsx.
 * Add  data-sound="tick"     to +/- buttons  (short tick)
 * Add  data-nosound           to buttons that handle sound manually
 * All other <button> elements get a soft click automatically.
 */

let _ctx = null

function getCtx() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!_ctx || _ctx.state === 'closed') _ctx = new AC()
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

// ─── Soft click (main buttons) ───────────────────────────────────────────────
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

// ─── Short tick (score +/- buttons) ──────────────────────────────────────────
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

// ─── Goal sound: whistle + crowd burst ───────────────────────────────────────
export function playGoal() {
  const c = getCtx(); if (!c) return
  const now = c.currentTime

  // Whistle via FM synthesis
  const mod = c.createOscillator()
  const modG = c.createGain()
  const carrier = c.createOscillator()
  const whistleG = c.createGain()
  mod.type = 'sine'; mod.frequency.value = 68
  modG.gain.value = 480
  carrier.type = 'sine'; carrier.frequency.value = 2750
  mod.connect(modG); modG.connect(carrier.frequency)
  whistleG.gain.setValueAtTime(0, now)
  whistleG.gain.linearRampToValueAtTime(0.30, now + 0.025)
  whistleG.gain.setValueAtTime(0.30, now + 0.32)
  whistleG.gain.exponentialRampToValueAtTime(0.001, now + 0.7)
  carrier.connect(whistleG); whistleG.connect(c.destination)
  mod.start(now); carrier.start(now)
  mod.stop(now + 0.75); carrier.stop(now + 0.75)

  // Crowd cheer (pink noise burst)
  const len = c.sampleRate * 2
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
  cheerG.gain.setValueAtTime(0, now + 0.12)
  cheerG.gain.linearRampToValueAtTime(0.24, now + 0.5)
  cheerG.gain.setValueAtTime(0.24, now + 1.5)
  cheerG.gain.linearRampToValueAtTime(0, now + 2.3)
  cheer.connect(hp); hp.connect(mid); mid.connect(cheerG); cheerG.connect(c.destination)
  cheer.start(now + 0.12); cheer.stop(now + 2.4)
}

// ─── Success arpeggio (admin confirm payment) ─────────────────────────────────
export function playSuccess() {
  const c = getCtx(); if (!c) return
  const now = c.currentTime
  // C5 – E5 – G5 – C6
  ;[523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
    const t = now + i * 0.11
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.16, t + 0.02)
    g.gain.setValueAtTime(0.16, t + 0.09)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.38)
    osc.connect(g); g.connect(c.destination)
    osc.start(t); osc.stop(t + 0.42)
  })
}

// ─── Global listener: auto-sound all <button> elements ───────────────────────
export function initGlobalButtonSounds() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button:not([disabled]):not([data-nosound])')
    if (!btn) return
    const s = btn.dataset.sound
    if (s === 'tick') playTick()
    else if (s === 'success') playSuccess()
    else playClick()
  }, { passive: true })
}
