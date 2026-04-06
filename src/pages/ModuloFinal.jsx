import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

export default function ModuloFinal() {
  const { profile } = useAuth()
  const [modulo, setModulo] = useState(null)
  const [goleador, setGoleador] = useState('')
  const [balonOro, setBalonOro] = useState('')
  const [cerrado, setCerrado] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('modulo_final').select('*').eq('user_id', profile.id).single()
      if (data) {
        setModulo(data)
        setGoleador(data.goleador_torneo || '')
        setBalonOro(data.balon_de_oro || '')
        if (data.calculado) setCerrado(true)
      }
    }
    load()
  }, [profile])

  async function handleSave() {
    if (!goleador.trim() || !balonOro.trim()) { setError('Debes completar ambos campos'); return }
    setSaving(true)
    setError('')
    const data = { user_id: profile.id, goleador_torneo: goleador.trim(), balon_de_oro: balonOro.trim() }
    let err
    if (modulo) {
      ({ error: err } = await supabase.from('modulo_final').update(data).eq('id', modulo.id))
    } else {
      ({ error: err } = await supabase.from('modulo_final').insert(data))
    }
    if (err) { setError(err.message); setSaving(false); return }
    setSaved(true)
    setSaving(false)
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500"
  const inputStyle = { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="px-5 pt-10 pb-6" style={{ background: 'linear-gradient(160deg, var(--bg-tertiary) 0%, var(--bg-primary) 80%)' }}>
        <h1 className="text-2xl font-extrabold text-white">🐐 Módulo The GOAT</h1>
        <p className="text-gray-400 text-sm mt-1">Disponible durante la jornada 1 de grupos</p>
      </div>

      <div className="px-5 mt-4">
        {/* Explicación puntos */}
        <div className="rounded-2xl p-4 mb-5" style={{ backgroundColor: 'rgba(113,69,214,0.1)', border: '1px solid rgba(113,69,214,0.3)' }}>
          <p className="text-sm text-purple-300 font-semibold mb-2">¿Cómo funciona?</p>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">30</p>
              <p className="text-xs text-gray-400">pts Goleador</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">30</p>
              <p className="text-xs text-gray-400">pts Balón de Oro</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">60</p>
              <p className="text-xs text-gray-400">pts máx</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Solo puedes modificarlo durante la primera jornada. Después queda fijo.</p>
        </div>

        {cerrado && (
          <div className="rounded-2xl p-3 mb-4 text-center" style={{ backgroundColor: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.3)' }}>
            <p className="text-red-400 text-sm font-semibold">🔒 El módulo final está cerrado</p>
          </div>
        )}

        <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              ⚽ Goleador del torneo
            </label>
            <input
              value={goleador}
              onChange={e => setGoleador(e.target.value)}
              disabled={cerrado}
              placeholder="ej: Erling Haaland"
              className={inputClass}
              style={inputStyle}
            />
            <p className="text-xs text-gray-500 mt-1">Jugador que más goles marcará en todo el Mundial</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              🏆 Balón de Oro del torneo
            </label>
            <input
              value={balonOro}
              onChange={e => setBalonOro(e.target.value)}
              disabled={cerrado}
              placeholder="ej: Kylian Mbappé"
              className={inputClass}
              style={inputStyle}
            />
            <p className="text-xs text-gray-500 mt-1">Mejor jugador del torneo según la FIFA</p>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}

        {!cerrado && (
          <button onClick={handleSave} disabled={saving || saved}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg mt-5 disabled:opacity-60"
            style={{ backgroundColor: saved ? '#1D9E75' : '#7145D6' }}>
            {saved ? '✓ Guardado' : saving ? 'Guardando...' : modulo ? 'Actualizar pronóstico' : 'Guardar pronóstico'}
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
