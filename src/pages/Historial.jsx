import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'
import FlagEmoji from '../components/FlagEmoji'

const FASES = ['todos', 'grupos', 'octavos', 'cuartos', 'semis', 'final']

export default function Historial() {
  const { profile } = useAuth()
  const [pronosticos, setPronosticos] = useState([])
  const [filtroFase, setFiltroFase] = useState('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase
        .from('pronosticos')
        .select('*, partidos(*)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
      const { data } = await query
      setPronosticos(data || [])
      setLoading(false)
    }
    load()
  }, [profile])

  const filtrados = filtroFase === 'todos'
    ? pronosticos
    : pronosticos.filter(p => p.partidos?.fase === filtroFase)

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#1A1730' }}>
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(160deg, #2d1f5e 0%, #1A1730 80%)' }}>
        <h1 className="text-2xl font-extrabold text-white">📋 Historial</h1>
        <p className="text-gray-400 text-sm mt-1">Todos tus pronósticos</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 px-5 mt-4 overflow-x-auto pb-1">
        {FASES.map(f => (
          <button key={f} onClick={() => setFiltroFase(f)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all"
            style={{
              backgroundColor: filtroFase === f ? '#7145D6' : '#231E3D',
              color: filtroFase === f ? '#fff' : '#9ca3af'
            }}>
            {f === 'todos' ? 'Todos' : f}
          </button>
        ))}
      </div>

      <div className="px-5 mt-4">
        {loading ? (
          <div className="text-center text-gray-400 py-10">Cargando...</div>
        ) : filtrados.length === 0 ? (
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#231E3D' }}>
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-400">No hay pronósticos en esta fase</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtrados.map(pr => {
              const p = pr.partidos
              if (!p) return null
              const fecha = new Date(p.fecha_hora).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })

              return (
                <div key={pr.id} className="rounded-2xl p-4" style={{ backgroundColor: '#231E3D', border: '1px solid #3d3560' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400 capitalize">{p.fase} · {fecha}</span>
                    {pr.calculado ? (
                      <span className="font-extrabold text-sm" style={{ color: '#7145D6' }}>{pr.pts_total} pts</span>
                    ) : p.estado === 'terminado' ? (
                      <span className="text-xs text-gray-500">Calculando...</span>
                    ) : (
                      <span className="text-xs text-green-400">Pendiente</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <FlagEmoji emoji={p.flag_local} size="md" team={p.equipo_local} />
                      <span className="text-sm font-bold text-white">{p.equipo_local}</span>
                    </div>
                    <div className="flex flex-col items-center px-2">
                      <span className="font-extrabold text-white">{pr.goles_local} - {pr.goles_visitante}</span>
                      <span className="text-xs text-gray-500">tu pronóstico</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-sm font-bold text-white">{p.equipo_visitante}</span>
                      <FlagEmoji emoji={p.flag_visitante} size="md" team={p.equipo_visitante} />
                    </div>
                  </div>

                  {p.estado === 'terminado' && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                      <span>Resultado real:</span>
                      <span className="font-bold text-white">{p.goles_local} - {p.goles_visitante}</span>
                    </div>
                  )}

                  {pr.calculado && (
                    <div className="mt-2 flex gap-3 justify-center text-xs">
                      {pr.pts_marcador > 0 && <span className="text-green-400">+{pr.pts_marcador} marcador</span>}
                      {pr.pts_resultado > 0 && <span className="text-green-400">+{pr.pts_resultado} resultado</span>}
                      {pr.pts_quintero_gol > 0 && <span className="text-purple-400">+{pr.pts_quintero_gol} Q.gol</span>}
                      {pr.pts_quintero_asistencia > 0 && <span className="text-purple-400">+{pr.pts_quintero_asistencia} Q.asist</span>}
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
