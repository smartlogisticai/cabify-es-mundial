import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

export default function Home() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [partidos, setPartidos] = useState([])
  const [misPronosticos, setMisPronosticos] = useState({})
  const [clasificacion, setClasificacion] = useState(null)
  const [participantes, setParticipantes] = useState(0)
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    async function load() {
      const [{ data: pts }, { data: ps }, { data: total }, { data: prono }] = await Promise.all([
        supabase.from('clasificacion_fases').select('puntos,posicion').eq('user_id', profile.id).eq('fase', 'total').single(),
        supabase.from('partidos').select('*').gte('fecha_hora', today + 'T00:00:00').lte('fecha_hora', today + 'T23:59:59').order('fecha_hora'),
        supabase.from('users').select('id', { count: 'exact' }).eq('estado', 'activo'),
        supabase.from('pronosticos').select('partido_id').eq('user_id', profile.id),
      ])
      setClasificacion(pts)
      setPartidos(ps || [])
      setParticipantes(total?.length || 0)
      const map = {}
      ;(prono || []).forEach(p => { map[p.partido_id] = true })
      setMisPronosticos(map)
      setLoading(false)
    }
    if (profile) load()
  }, [profile])

  const pozo = participantes * 30000

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1730' }}>
    <div className="text-white text-lg">Cargando...</div>
  </div>

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#1A1730' }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6" style={{ background: 'linear-gradient(160deg, #2d1f5e 0%, #1A1730 100%)' }}>
        <p className="text-gray-400 text-sm">Hola, {profile?.alias || profile?.nombre} 👋</p>
        <h1 className="text-2xl font-extrabold text-white mt-1">Cabify es Mundial</h1>

        {/* Stats row */}
        <div className="flex gap-3 mt-5">
          <div className="flex-1 rounded-2xl p-4 text-center" style={{ backgroundColor: '#231E3D' }}>
            <p className="text-xs text-gray-400 mb-1">Tu posición</p>
            <p className="text-2xl font-extrabold text-white">#{clasificacion?.posicion || '—'}</p>
          </div>
          <div className="flex-1 rounded-2xl p-4 text-center" style={{ backgroundColor: '#231E3D' }}>
            <p className="text-xs text-gray-400 mb-1">Tus puntos</p>
            <p className="text-2xl font-extrabold" style={{ color: '#7145D6' }}>{clasificacion?.puntos ?? 0}</p>
          </div>
          <div className="flex-1 rounded-2xl p-4 text-center" style={{ backgroundColor: '#231E3D' }}>
            <p className="text-xs text-gray-400 mb-1">Pozo total</p>
            <p className="text-lg font-extrabold text-green-400">${(pozo / 1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>

      {/* Partidos del día */}
      <div className="px-5 mt-4">
        <h2 className="text-lg font-bold text-white mb-3">Partidos de hoy</h2>

        {partidos.length === 0 ? (
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#231E3D' }}>
            <p className="text-4xl mb-2">😴</p>
            <p className="text-gray-400">No hay partidos hoy</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {partidos.map(p => {
              const tienePron = misPronosticos[p.id]
              const cerrado = new Date() > new Date(p.cierre_pronosticos)
              const hora = new Date(p.fecha_hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

              return (
                <div key={p.id}
                  onClick={() => !cerrado && navigate(`/pronostico/${p.id}`)}
                  className="rounded-2xl p-4 cursor-pointer"
                  style={{ backgroundColor: '#231E3D', border: tienePron ? '1px solid #1D9E75' : '1px solid #3d3560' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400 capitalize">{p.fase} · J{p.jornada}</span>
                    <span className="text-xs font-semibold" style={{ color: cerrado ? '#E53935' : '#1D9E75' }}>
                      {cerrado ? '🔒 Cerrado' : `⏰ ${hora}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{p.flag_local}</span>
                      <span className="font-bold text-white text-sm">{p.equipo_local}</span>
                    </div>
                    <span className="text-gray-400 font-bold">VS</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{p.equipo_visitante}</span>
                      <span className="text-2xl">{p.flag_visitante}</span>
                    </div>
                  </div>
                  {p.es_colombia && (
                    <div className="mt-2 px-2 py-1 rounded-lg text-xs font-bold text-center"
                      style={{ backgroundColor: 'rgba(113,69,214,0.2)', color: '#a78bfa' }}>
                      🇨🇴 Módulo Quintero disponible
                    </div>
                  )}
                  {tienePron && !cerrado && (
                    <div className="mt-2 text-xs text-center font-semibold text-green-400">✓ Pronóstico guardado · Toca para editar</div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Link módulo final */}
        <div className="mt-4 rounded-2xl p-4 flex items-center justify-between cursor-pointer"
          style={{ backgroundColor: '#231E3D', border: '1px solid rgba(113,69,214,0.4)' }}
          onClick={() => navigate('/modulo-final')}>
          <div>
            <p className="font-bold text-white">Módulo Final</p>
            <p className="text-xs text-gray-400">Goleador del torneo · Balón de Oro</p>
          </div>
          <span className="text-2xl">🌟</span>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
