import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import FlagEmoji from '../components/FlagEmoji'

export default function Resultados() {
  const [partidos, setPartidos] = useState([])
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [abiertos, setAbiertos] = useState({})
  const [pronosticos, setPronosticos] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('partidos')
        .select('*')
        .gte('fecha_hora', fecha + 'T00:00:00')
        .lte('fecha_hora', fecha + 'T23:59:59')
        .order('fecha_hora')
      setPartidos(data || [])
      setLoading(false)
    }
    load()
  }, [fecha])

  async function loadPronosticos(partidoId) {
    if (pronosticos[partidoId]) return
    const cerrado = partidos.find(p => p.id === partidoId)
    if (!cerrado || new Date() < new Date(cerrado.cierre_pronosticos)) return
    const { data } = await supabase
      .from('pronosticos')
      .select('*, users(alias, nombre)')
      .eq('partido_id', partidoId)
    setPronosticos(prev => ({ ...prev, [partidoId]: data || [] }))
  }

  function toggleAccordion(id) {
    const next = !abiertos[id]
    setAbiertos(prev => ({ ...prev, [id]: next }))
    if (next) loadPronosticos(id)
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#1A1730' }}>
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(160deg, #2d1f5e 0%, #1A1730 80%)' }}>
        <h1 className="text-2xl font-extrabold text-white">⚽ Resultados</h1>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          className="mt-3 px-3 py-2 rounded-xl text-white text-sm outline-none"
          style={{ backgroundColor: '#231E3D', border: '1px solid #3d3560' }}
        />
      </div>

      <div className="px-5 mt-4">
        {loading ? (
          <div className="text-center text-gray-400 py-10">Cargando...</div>
        ) : partidos.length === 0 ? (
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#231E3D' }}>
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-400">No hay partidos este día</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {partidos.map(p => {
              const terminado = p.estado === 'terminado'
              const hora = new Date(p.fecha_hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

              return (
                <div key={p.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#231E3D', border: '1px solid #3d3560' }}>
                  {/* Cabecera partido */}
                  <button className="w-full px-4 py-4 text-left" onClick={() => toggleAccordion(p.id)}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 capitalize">{p.fase} · J{p.jornada}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.estado === 'en_vivo' ? 'bg-green-500/20 text-green-400' : terminado ? 'bg-gray-500/20 text-gray-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {p.estado === 'en_vivo' ? '🔴 En vivo' : terminado ? 'Terminado' : `⏰ ${hora}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <FlagEmoji emoji={p.flag_local} size="md" />
                        <span className="font-bold text-white text-sm">{p.equipo_local}</span>
                      </div>
                      {terminado ? (
                        <span className="font-extrabold text-white text-xl px-3">
                          {p.goles_local} - {p.goles_visitante}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-bold px-3">VS</span>
                      )}
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="font-bold text-white text-sm">{p.equipo_visitante}</span>
                        <FlagEmoji emoji={p.flag_visitante} size="md" />
                      </div>
                    </div>
                    {terminado && p.es_colombia && (
                      <div className="mt-2 flex gap-3 text-xs">
                        <span style={{ color: p.quintero_gol ? '#1D9E75' : '#9ca3af' }}>⚽ Quintero gol: {p.quintero_gol ? 'Sí' : 'No'}</span>
                        <span style={{ color: p.quintero_asistencia ? '#1D9E75' : '#9ca3af' }}>🎯 Asistencia: {p.quintero_asistencia ? 'Sí' : 'No'}</span>
                      </div>
                    )}
                    <div className="text-right mt-1">
                      <span className="text-xs text-gray-500">{abiertos[p.id] ? '▲ Ocultar' : '▼ Ver pronósticos'}</span>
                    </div>
                  </button>

                  {/* Accordion pronósticos */}
                  {abiertos[p.id] && (
                    <div className="border-t px-4 py-3" style={{ borderColor: '#3d3560' }}>
                      {!terminado ? (
                        <p className="text-xs text-gray-500 text-center">Los pronósticos se revelan al cerrar el partido</p>
                      ) : (pronosticos[p.id] || []).length === 0 ? (
                        <p className="text-xs text-gray-500 text-center">Sin pronósticos registrados</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {(pronosticos[p.id] || []).map(pr => (
                            <div key={pr.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-300">{pr.users?.alias || pr.users?.nombre}</span>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-white">{pr.goles_local} - {pr.goles_visitante}</span>
                                {pr.calculado && (
                                  <span className="font-extrabold" style={{ color: '#7145D6' }}>{pr.pts_total} pts</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
