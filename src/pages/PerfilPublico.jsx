import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import FlagEmoji from '../components/FlagEmoji'

const FASE_STATS = [
  { key: 'grupos', label: 'Grupos' },
  { key: 'eliminatorias', label: '16avos-Semis' },
  { key: 'final', label: 'Final' },
  { key: 'total', label: 'Total' },
]

export default function PerfilPublico() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [pronosticos, setPronosticos] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: user }, { data: prons }, { data: clasi }] = await Promise.all([
        supabase.from('users').select('alias, nombre').eq('id', userId).single(),
        supabase.from('pronosticos')
          .select('*, partidos(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase.from('clasificacion_fases')
          .select('*')
          .eq('user_id', userId),
      ])
      setUsuario(user)
      setPronosticos((prons || []).filter(pr => pr.partidos?.estado === 'terminado'))
      setStats(clasi || [])
      setLoading(false)
    }
    load()
  }, [userId])

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="px-5 pt-10 pb-6" style={{ background: 'linear-gradient(160deg, var(--bg-tertiary) 0%, var(--bg-primary) 80%)' }}>
        <button onClick={() => navigate(-1)} className="text-gray-400 text-sm mb-4">← Volver</button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-extrabold text-white"
            style={{ backgroundColor: '#7145D6' }}>
            {(usuario?.alias || usuario?.nombre || '?')[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">{usuario?.alias || '...'}</h1>
            {usuario?.nombre && <p className="text-gray-400 text-sm">{usuario.nombre}</p>}
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        {/* Puntos por fase */}
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <h2 className="font-bold text-white mb-3 text-sm">Puntos por fase</h2>
          <div className="grid grid-cols-4 gap-2">
            {FASE_STATS.map(f => {
              const s = stats.find(st => st.fase === f.key)
              return (
                <div key={f.key} className="rounded-xl p-2 text-center" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <p className="text-xs text-gray-400 mb-1 leading-tight">{f.label}</p>
                  <p className="text-lg font-extrabold"
                    style={{ color: f.key === 'total' ? '#7145D6' : 'var(--text-primary)' }}>
                    {s?.puntos ?? 0}
                  </p>
                  {s?.posicion && <p className="text-xs text-gray-500">#{s.posicion}</p>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Historial de pronósticos (solo partidos terminados) */}
        <h2 className="font-bold text-white mb-3 text-sm">Pronósticos jugados</h2>
        {loading ? (
          <div className="text-center text-gray-400 py-10">Cargando...</div>
        ) : pronosticos.length === 0 ? (
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-400">Sin pronósticos registrados</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pronosticos.map(pr => {
              const p = pr.partidos
              if (!p) return null
              const fecha = new Date(p.fecha_hora).toLocaleDateString('es-CO', {
                day: 'numeric', month: 'short', timeZone: 'America/Bogota',
              })
              return (
                <div key={pr.id} className="rounded-2xl p-4"
                  style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400 capitalize">{p.fase} · {fecha}</span>
                    {pr.calculado && (
                      <span className="font-extrabold text-sm" style={{ color: '#7145D6' }}>{pr.pts_total} pts</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <FlagEmoji emoji={p.flag_local} size="md" team={p.equipo_local} />
                      <span className="text-sm font-bold text-white">{p.equipo_local}</span>
                    </div>
                    <div className="flex flex-col items-center px-2">
                      <span className="font-extrabold text-white">{pr.goles_local} - {pr.goles_visitante}</span>
                      <span className="text-xs text-gray-500">pronóstico</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-sm font-bold text-white">{p.equipo_visitante}</span>
                      <FlagEmoji emoji={p.flag_visitante} size="md" team={p.equipo_visitante} />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                    <span>Resultado real:</span>
                    <span className="font-bold text-white">{p.goles_local} - {p.goles_visitante}</span>
                  </div>

                  {pr.calculado && (
                    <div className="mt-2 flex gap-3 justify-center text-xs flex-wrap">
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
