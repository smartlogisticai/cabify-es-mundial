import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Crowd ambience via Web Audio API ────────────────────────────────────────
function buildCrowdAmbience(ctx) {
  const now = ctx.currentTime
  const fadeIn = 2.5
  const hold = 4.5
  const fadeOut = 2.0
  const total = fadeIn + hold + fadeOut   // ~9 s

  // ── Pink noise (stadium roar base) ──
  const rate = ctx.sampleRate
  const buf = ctx.createBuffer(1, rate * 4, rate)
  const d = buf.getChannelData(0)
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0
  for (let i = 0; i < rate * 4; i++) {
    const w = Math.random() * 2 - 1
    b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759
    b2 = 0.96900*b2 + w*0.1538520; b3 = 0.86650*b3 + w*0.3104856
    b4 = 0.55000*b4 + w*0.5329522; b5 = -0.7616*b5 - w*0.0168980
    d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362) / 7
    b6 = w * 0.115926
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buf
  noise.loop = true

  // ── EQ: shape noise to "voices" range 200–3000 Hz ──
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'; hp.frequency.value = 200

  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'; lp.frequency.value = 3200

  const mid = ctx.createBiquadFilter()
  mid.type = 'peaking'; mid.frequency.value = 700
  mid.Q.value = 0.8; mid.gain.value = 9

  // ── Stadium echo: delay with feedback ──
  const delay = ctx.createDelay(1.0)
  delay.delayTime.value = 0.18
  const fb = ctx.createGain()
  fb.gain.value = 0.38
  delay.connect(fb); fb.connect(delay)

  const delayMix = ctx.createGain()
  delayMix.gain.value = 0.28

  // ── LFO: slow crowd-wave amplitude swell ──
  const waveGain = ctx.createGain()
  waveGain.gain.value = 0.07
  const lfo = ctx.createOscillator()
  const lfoAmt = ctx.createGain()
  lfo.type = 'sine'; lfo.frequency.value = 0.18
  lfoAmt.gain.value = 0.025
  lfo.connect(lfoAmt); lfoAmt.connect(waveGain.gain)

  // ── Master: fade in → hold → fade out ──
  const master = ctx.createGain()
  master.gain.setValueAtTime(0, now)
  master.gain.linearRampToValueAtTime(0.13, now + fadeIn)
  master.gain.setValueAtTime(0.13, now + fadeIn + hold)
  master.gain.linearRampToValueAtTime(0, now + total)

  // ── Connect graph ──
  noise.connect(hp); hp.connect(lp); lp.connect(mid)
  mid.connect(waveGain)
  mid.connect(delay); delay.connect(delayMix)
  waveGain.connect(master)
  delayMix.connect(master)
  master.connect(ctx.destination)

  noise.start(now); lfo.start(now)
  noise.stop(now + total + 0.1); lfo.stop(now + total + 0.1)

  return { noise, lfo, master, total }
}

function playStadiumCrowd() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  try {
    const ctx = new AudioCtx()
    const nodes = buildCrowdAmbience(ctx)

    // If browser suspended (autoplay policy), resume on first interaction
    if (ctx.state === 'suspended') {
      const resume = () => {
        ctx.resume()
        document.removeEventListener('click', resume)
        document.removeEventListener('touchstart', resume)
      }
      document.addEventListener('click', resume, { once: true })
      document.addEventListener('touchstart', resume, { once: true })
    }

    return { ctx, ...nodes }
  } catch (_) {
    return null
  }
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const sound = playStadiumCrowd()
    return () => {
      if (sound) {
        try {
          sound.master.gain.linearRampToValueAtTime(0, sound.ctx.currentTime + 0.3)
          setTimeout(() => sound.ctx.close(), 400)
        } catch (_) {}
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-white"
      style={{ background: 'linear-gradient(160deg, #1A1730 0%, #2d1f5e 100%)' }}>

      {/* Logo / Trophy */}
      <div className="text-8xl mb-4">🏆</div>

      <h1 className="text-4xl font-extrabold text-center mb-2">
        Cabify es Mundial
      </h1>
      <p className="text-lg text-purple-300 font-semibold mb-2">Mundial 2026</p>
      <p className="text-center text-gray-300 max-w-xs mb-10">
        Pronostica los partidos, acumula puntos y compite por premios reales con tus compañeros de Cabify Colombia.
      </p>

      <div className="w-full max-w-xs flex flex-col gap-3">
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 rounded-xl font-bold text-white text-lg"
          style={{ backgroundColor: '#7145D6' }}
        >
          Entrar
        </button>
        <button
          onClick={() => navigate('/bienvenida-registro')}
          className="w-full py-3 rounded-xl font-bold text-lg border-2"
          style={{ borderColor: '#7145D6', color: '#7145D6', background: 'transparent' }}
        >
          Registrarme
        </button>
      </div>

      <p className="mt-8 text-xs text-gray-500">Solo para empleados de Cabify Colombia</p>
    </div>
  )
}
