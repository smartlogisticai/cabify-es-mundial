import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'
import FlagEmoji from '../components/FlagEmoji'

const FASES = ['todos', 'grupos', 'octavos', 'cuartos', 'semis', 'final']

export default function Historial() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [pronosticos, setPronosticos] = useState([])
  const [filtroFase, setFiltroFase] = useState('todos')
  const [loading, setLoading] = useState(true)
  const ahora = new Date()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('pronosticos')
        .select('*, partidos(*)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
      setPronosticos(data || [])
      setLoading(false)
    }
    load()
  }, [profile])

  const filtrados = filtroFase === 'todos'
    ? pronosticos
    : pronosticos.filter(p => p.partidos?.fase === filtroFase)

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(160deg, var(--bg-tertiary) 0%, var(--bg-primary) 80%)' }}>
        <h1 className="text-2xl font-extrabold text-white">📋 Historial</h1>
        <p className="text-gray-400 text-sm mt-1">Todos tus pronósticos</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 px-5 mt-4 overflow-x-auto pb-1">
        {FASES.map(f => (
          <button key={f} onClick={() => setFiltroFase(f)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all"
            style={{
              backgroundColor: filtroFase === f ? '#7145D6' : 'var(--bg-secondary)',
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
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-400">No hay pronósticos en esta fase</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtrados.map(pr => {
              const p = pr.partidos
              if (!p) return null

              const editable = new Date(p.cierre_pronosticos) > ahora && p.estado !== 'terminado'
              const fecha = new Date(p.fecha_hora).toLocaleDateString('es-CO', {
                day: 'numeric', month: 'short', timeZone: 'America/Bogota',
              })

              return (
                <div key={pr.id} className="rounded-2xl p-4"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: `1px solid ${editable ? '#1D9E75' : 'var(--border)'}`,
                  }}>

                  {/* Fila superior: fase/fecha + estado edición + puntos */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {/* Indicador editable / cerrado */}
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: editable ? '#1D9E75' : '#6b7280' }} />
                      <span className="text-xs text-gray-400 capitalize">{p.fase} · {fecha}</span>
                    </div>

                    {pr.calculado ? (
                      <span className="font-extrabold text-sm" style={{ color: '#7145D6' }}>{pr.pts_total} pts</span>
                    ) : p.estado === 'terminado' ? (
                      <span className="text-xs text-gray-500">Calculando...</span>
                    ) : editable ? (
                      <span className="text-xs font-semibold text-green-400">Abierto</span>
                    ) : (
                      <span className="text-xs text-gray-500">Cerrado</span>
                    )}
                  </div>

                  {/* Equipos y marcador */}
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

                  {/* Resultado real */}
                  {p.estado === 'terminado' && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                      <span>Resultado real:</span>
                      <span className="font-bold text-white">{p.goles_local} - {p.goles_visitante}</span>
                    </div>
                  )}

                  {/* Desglose de puntos */}
                  {pr.calculado && (
                    <div className="mt-2 flex gap-3 justify-center text-xs">
                      {pr.pts_marcador > 0 && <span className="text-green-400">+{pr.pts_marcador} marcador</span>}
                      {pr.pts_resultado > 0 && <span className="text-green-400">+{pr.pts_resultado} resultado</span>}
                      {pr.pts_quintero_gol > 0 && <span className="text-purple-400">+{pr.pts_quintero_gol} Q.gol</span>}
                      {pr.pts_quintero_asistencia > 0 && <span className="text-purple-400">+{pr.pts_quintero_asistencia} Q.asist</span>}
                    </div>
                  )}

                  {/* Botón editar */}
                  {editable && (
                    <button
                      onClick={() => navigate(`/pronostico/${p.id}`)}
                      className="w-full mt-3 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                      style={{ backgroundColor: 'rgba(29,158,117,0.15)', color: '#1D9E75', border: '1px solid rgba(29,158,117,0.4)' }}>
                      ✏️ Editar pronóstico
                    </button>
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
