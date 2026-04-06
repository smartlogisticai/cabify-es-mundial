import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminResultados() {
  const [partidos, setPartidos] = useState([])
  const [editando, setEditando] = useState({})
  const [saving, setSaving] = useState(null)
  const [msg, setMsg] = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('partidos')
        .select('*')
        .gte('fecha_hora', today + 'T00:00:00')
        .order('fecha_hora')
      setPartidos(data || [])
    }
    load()
  }, [])

  function startEdit(p) {
    setEditando(prev => ({
      ...prev,
      [p.id]: {
        goles_local: p.goles_local ?? 0,
        goles_visitante: p.goles_visitante ?? 0,
        quintero_gol: p.quintero_gol ?? false,
        quintero_asistencia: p.quintero_asistencia ?? false,
      }
    }))
  }

  async function guardar(p) {
    setSaving(p.id)
    setMsg('')
    const vals = editando[p.id]
    const { error } = await supabase.from('partidos').update({
      goles_local: vals.goles_local,
      goles_visitante: vals.goles_visitante,
      quintero_gol: p.es_colombia ? vals.quintero_gol : null,
      quintero_asistencia: p.es_colombia ? vals.quintero_asistencia : null,
      estado: 'terminado',
    }).eq('id', p.id)
    if (!error) {
      setMsg(`Resultado de ${p.equipo_local} vs ${p.equipo_visitante} guardado`)
      setEditando(prev => { const n = {...prev}; delete n[p.id]; return n })
    }
    setSaving(null)
  }

  async function calcularPuntajes(p) {
    setSaving(p.id + '_calc')
    // Trigger via Supabase Edge Function call (invoked here)
    const { error } = await supabase.functions.invoke('calcular-puntajes', {
      body: { partido_id: p.id }
    })
    if (!error) setMsg(`Puntajes calculados para ${p.equipo_local} vs ${p.equipo_visitante}`)
    setSaving(null)
  }

  return (
    <div className="min-h-screen pb-10" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="px-5 pt-10 pb-5" style={{ background: 'linear-gradient(160deg, var(--bg-tertiary) 0%, var(--bg-primary) 80%)' }}>
        <p className="text-xs text-purple-400 font-bold mb-1">PANEL ADMIN</p>
        <h1 className="text-2xl font-extrabold text-white">⚽ Resultados</h1>
        <p className="text-gray-400 text-sm mt-1">Partidos de hoy · ingreso manual de respaldo</p>
      </div>

      {msg && (
        <div className="mx-5 mt-4 px-4 py-3 rounded-xl text-sm font-semibold text-green-300"
          style={{ backgroundColor: 'rgba(29,158,117,0.15)' }}>
          ✓ {msg}
        </div>
      )}

      <div className="px-5 mt-4 flex flex-col gap-4">
        {partidos.length === 0 && (
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <p className="text-gray-400">No hay partidos hoy</p>
          </div>
        )}

        {partidos.map(p => {
          const ed = editando[p.id]
          const hora = new Date(p.fecha_hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

          return (
            <div key={p.id} className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-gray-400 capitalize">{p.fase} · {hora}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.estado === 'terminado' ? 'bg-gray-500/20 text-gray-300' : p.estado === 'en_vivo' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {p.estado}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{p.flag_local}</span>
                  <span className="font-bold text-white text-sm">{p.equipo_local}</span>
                </div>
                {p.estado === 'terminado' && !ed && (
                  <span className="font-extrabold text-white">{p.goles_local} - {p.goles_visitante}</span>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{p.equipo_visitante}</span>
                  <span className="text-2xl">{p.flag_visitante}</span>
                </div>
              </div>

              {ed ? (
                <div>
                  {/* Marcador editable */}
                  <div className="flex items-center gap-4 justify-center mb-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditando(prev => ({...prev, [p.id]: {...ed, goles_local: Math.max(0, ed.goles_local - 1)}}))}
                        className="w-8 h-8 rounded-lg font-bold" style={{ backgroundColor: 'var(--border)', color: '#fff' }}>−</button>
                      <span className="text-2xl font-extrabold text-white w-8 text-center">{ed.goles_local}</span>
                      <button onClick={() => setEditando(prev => ({...prev, [p.id]: {...ed, goles_local: ed.goles_local + 1}}))}
                        className="w-8 h-8 rounded-lg font-bold" style={{ backgroundColor: '#7145D6', color: '#fff' }}>+</button>
                    </div>
                    <span className="text-gray-400 font-bold text-xl">:</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditando(prev => ({...prev, [p.id]: {...ed, goles_visitante: Math.max(0, ed.goles_visitante - 1)}}))}
                        className="w-8 h-8 rounded-lg font-bold" style={{ backgroundColor: 'var(--border)', color: '#fff' }}>−</button>
                      <span className="text-2xl font-extrabold text-white w-8 text-center">{ed.goles_visitante}</span>
                      <button onClick={() => setEditando(prev => ({...prev, [p.id]: {...ed, goles_visitante: ed.goles_visitante + 1}}))}
                        className="w-8 h-8 rounded-lg font-bold" style={{ backgroundColor: '#7145D6', color: '#fff' }}>+</button>
                    </div>
                  </div>

                  {p.es_colombia && (
                    <div className="flex flex-col gap-2 mb-4">
                      {[['quintero_gol', 'Quintero hizo gol'], ['quintero_asistencia', 'Quintero hizo asistencia']].map(([key, label]) => (
                        <label key={key} className="flex items-center justify-between">
                          <span className="text-sm text-white">{label}</span>
                          <button onClick={() => setEditando(prev => ({...prev, [p.id]: {...ed, [key]: !ed[key]}}))}
                            className="w-12 h-6 rounded-full relative"
                            style={{ backgroundColor: ed[key] ? '#7145D6' : 'var(--border)' }}>
                            <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
                              style={{ left: ed[key] ? '26px' : '2px' }} />
                          </button>
                        </label>
                      ))}
                    </div>
                  )}

                  <button onClick={() => guardar(p)} disabled={saving === p.id}
                    className="w-full py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                    style={{ backgroundColor: '#1D9E75' }}>
                    {saving === p.id ? 'Guardando...' : '✓ Guardar resultado'}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => startEdit(p)}
                    className="flex-1 py-2 rounded-xl text-sm font-bold"
                    style={{ backgroundColor: 'var(--border)', color: '#fff' }}>
                    ✏️ Ingresar resultado
                  </button>
                  {p.estado === 'terminado' && (
                    <button onClick={() => calcularPuntajes(p)} disabled={saving === p.id + '_calc'}
                      className="flex-1 py-2 rounded-xl text-sm font-bold disabled:opacity-60"
                      style={{ backgroundColor: '#7145D6', color: '#fff' }}>
                      {saving === p.id + '_calc' ? '...' : '🔢 Calcular pts'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
