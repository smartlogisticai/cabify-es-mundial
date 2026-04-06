import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const FASES = [
  { key: 'grupos', label: 'Grupos', premio: '20%' },
  { key: 'eliminatorias', label: '16avos - Semis', premio: '20%' },
  { key: 'final', label: 'Final', premio: '60%' },
  { key: 'total', label: 'Total', premio: '' },
]

export default function AdminTabla() {
  const [fase, setFase] = useState('grupos')
  const [tabla, setTabla] = useState([])
  const [loading, setLoading] = useState(true)
  const [declaring, setDeclaring] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('clasificacion_fases')
        .select('*, users(alias, nombre, email)')
        .eq('fase', fase)
        .order('puntos', { ascending: false })
      setTabla(data || [])
      setLoading(false)
    }
    load()
  }, [fase])

  async function declararGanador() {
    if (!window.confirm(`¿Declarar ganadores de la fase "${fase}"? Esto es irreversible.`)) return
    setDeclaring(true)
    // Update positions
    for (let i = 0; i < tabla.length; i++) {
      await supabase.from('clasificacion_fases')
        .update({ posicion: i + 1 })
        .eq('id', tabla[i].id)
    }
    setMsg(`Ganadores de fase "${fase}" declarados correctamente`)
    setDeclaring(false)
  }

  return (
    <div className="min-h-screen pb-10" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="px-5 pt-10 pb-5" style={{ background: 'linear-gradient(160deg, var(--bg-tertiary) 0%, var(--bg-primary) 80%)' }}>
        <p className="text-xs text-purple-400 font-bold mb-1">PANEL ADMIN</p>
        <h1 className="text-2xl font-extrabold text-white">📊 Clasificación</h1>
      </div>

      {/* Pestañas */}
      <div className="flex px-5 mt-4 gap-2">
        {FASES.map(f => (
          <button key={f.key} onClick={() => setFase(f.key)}
            className="flex-1 py-2 rounded-xl text-xs font-bold"
            style={{ backgroundColor: fase === f.key ? '#7145D6' : 'var(--bg-secondary)', color: fase === f.key ? '#fff' : '#9ca3af' }}>
            {f.label}
          </button>
        ))}
      </div>

      {msg && (
        <div className="mx-5 mt-4 px-4 py-3 rounded-xl text-sm font-semibold text-green-300"
          style={{ backgroundColor: 'rgba(29,158,117,0.15)' }}>
          ✓ {msg}
        </div>
      )}

      <div className="px-5 mt-4">
        {loading ? (
          <div className="text-center text-gray-400 py-10">Cargando...</div>
        ) : (
          <>
            <div className="flex flex-col gap-2 mb-5">
              {tabla.map((row, idx) => {
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null
                return (
                  <div key={row.id} className="rounded-2xl px-4 py-3 flex items-center gap-3"
                    style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    <span className="w-8 text-center font-bold text-sm text-gray-400">
                      {medal || `#${idx + 1}`}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{row.users?.alias || row.users?.nombre}</p>
                      <p className="text-xs text-gray-500">{row.users?.email}</p>
                    </div>
                    <span className="font-extrabold text-white">{row.puntos} <span className="text-xs text-gray-400 font-normal">pts</span></span>
                  </div>
                )
              })}
            </div>

            {fase !== 'total' && (
              <button onClick={declararGanador} disabled={declaring || tabla.length === 0}
                className="w-full py-3 rounded-2xl font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: '#7145D6' }}>
                {declaring ? 'Declarando...' : `🏆 Declarar ganador de fase "${FASES.find(f => f.key === fase)?.label}"`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
