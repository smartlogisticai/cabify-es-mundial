import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

function agruparPorFecha(partidos) {
  const grupos = {}
  for (const p of partidos) {
    const fecha = new Date(p.fecha_hora).toLocaleDateString('es-CO', {
      timeZone: 'America/Bogota',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    const key = new Date(p.fecha_hora).toLocaleDateString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    if (!grupos[key]) grupos[key] = { label: fecha, partidos: [] }
    grupos[key].partidos.push(p)
  }
  return Object.entries(grupos)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v)
}

function esHoy(fechaHora) {
  const hoy = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })
  const dia = new Date(fechaHora).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })
  return hoy === dia
}

export default function Home() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [partidos, setPartidos] = useState([])
  const [misPronosticos, setMisPronosticos] = useState({})
  const [clasificacion, setClasificacion] = useState(null)
  const [participantes, setParticipantes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [jornada, setJornada] = useState('todas')

  useEffect(() => {
    async function load() {
      const [{ data: pts }, { data: ps }, { data: total }, { data: prono }] = await Promise.all([
        supabase.from('clasificacion_fases').select('puntos,posicion').eq('user_id', profile.id).eq('fase', 'total').single(),
        supabase.from('partidos').select('*').eq('fase', 'grupos').order('fecha_hora'),
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
  const ahora = new Date()

  const partidosFiltrados = jornada === 'todas'
    ? partidos
    : partidos.filter(p => p.jornada === Number(jornada))

  const gruposPorFecha = agruparPorFecha(partidosFiltrados)

  // Pendientes de pronosticar (abiertos, sin pronóstico aún)
  const pendientes = partidos.filter(p =>
    !misPronosticos[p.id] && new Date(p.cierre_pronosticos) > ahora
  ).length

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1730' }}>
      <div className="text-white text-lg">Cargando...</div>
    </div>
  )

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#1A1730' }}>

      {/* Header */}
      <div className="px-5 pt-10 pb-5" style={{ background: 'linear-gradient(160deg, #2d1f5e 0%, #1A1730 100%)' }}>
        <p className="text-gray-400 text-sm">Hola, {profile?.alias || profile?.nombre} 👋</p>
        <h1 className="text-2xl font-extrabold text-white mt-1">Cabify es Mundial</h1>

        {/* Stats row */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 rounded-2xl p-3 text-center" style={{ backgroundColor: '#231E3D' }}>
            <p className="text-xs text-gray-400 mb-1">Tu posición</p>
            <p className="text-2xl font-extrabold text-white">#{clasificacion?.posicion || '—'}</p>
          </div>
          <div className="flex-1 rounded-2xl p-3 text-center" style={{ backgroundColor: '#231E3D' }}>
            <p className="text-xs text-gray-400 mb-1">Tus puntos</p>
            <p className="text-2xl font-extrabold" style={{ color: '#7145D6' }}>{clasificacion?.puntos ?? 0}</p>
          </div>
          <div className="flex-1 rounded-2xl p-3 text-center" style={{ backgroundColor: '#231E3D' }}>
            <p className="text-xs text-gray-400 mb-1">Pozo total</p>
            <p className="text-lg font-extrabold text-green-400">${(pozo / 1000).toFixed(0)}K</p>
          </div>
        </div>

        {/* Alerta pendientes */}
        {pendientes > 0 && (
          <div className="mt-3 px-4 py-2 rounded-xl flex items-center gap-2"
            style={{ backgroundColor: 'rgba(113,69,214,0.2)', border: '1px solid rgba(113,69,214,0.4)' }}>
            <span className="text-base">⚠️</span>
            <p className="text-xs font-semibold" style={{ color: '#c4b5fd' }}>
              Tienes <span className="font-extrabold text-white">{pendientes}</span> partido{pendientes > 1 ? 's' : ''} sin pronosticar
            </p>
          </div>
        )}
      </div>

      {/* Filtros de jornada */}
      <div className="flex gap-2 px-5 mt-4">
        {['todas', '1', '2', '3'].map(j => (
          <button key={j} onClick={() => setJornada(j)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{
              backgroundColor: jornada === j ? '#7145D6' : '#231E3D',
              color: jornada === j ? '#fff' : '#9ca3af',
            }}>
            {j === 'todas' ? 'Todos' : `Jornada ${j}`}
          </button>
        ))}
      </div>

      {/* Lista de partidos agrupados por fecha */}
      <div className="px-5 mt-4 flex flex-col gap-6">
        {gruposPorFecha.length === 0 ? (
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#231E3D' }}>
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-400">No hay partidos en esta jornada</p>
          </div>
        ) : (
          gruposPorFecha.map(grupo => {
            const hayHoy = grupo.partidos.some(p => esHoy(p.fecha_hora))
            return (
              <div key={grupo.label}>
                {/* Cabecera de fecha */}
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-sm font-bold capitalize text-white">{grupo.label}</p>
                  {hayHoy && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ backgroundColor: '#7145D6', color: '#fff' }}>
                      HOY
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {grupo.partidos.map(p => {
                    const tienePron = misPronosticos[p.id]
                    const cerrado = ahora > new Date(p.cierre_pronosticos)
                    const terminado = p.estado === 'terminado'
                    const hora = new Date(p.fecha_hora).toLocaleTimeString('es-CO', {
                      timeZone: 'America/Bogota',
                      hour: '2-digit',
                      minute: '2-digit',
                    })

                    let borderColor = '#3d3560'
                    if (tienePron && !terminado) borderColor = '#1D9E75'
                    if (p.es_colombia) borderColor = '#7145D6'

                    return (
                      <div key={p.id}
                        onClick={() => !cerrado && !terminado && navigate(`/pronostico/${p.id}`)}
                        className={`rounded-2xl p-4 ${!cerrado && !terminado ? 'cursor-pointer active:scale-95 transition-transform' : 'opacity-70'}`}
                        style={{ backgroundColor: '#231E3D', border: `1px solid ${borderColor}` }}>

                        {/* Fila superior: fase/jornada + estado */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-400 capitalize">Jornada {p.jornada}</span>
                          <div className="flex items-center gap-1.5">
                            {tienePron && (
                              <span className="text-xs font-bold text-green-400">✓</span>
                            )}
                            {terminado ? (
                              <span className="text-xs font-semibold"
                                style={{ color: '#9ca3af' }}>
                                {p.goles_local} - {p.goles_visitante}
                              </span>
                            ) : cerrado ? (
                              <span className="text-xs font-semibold" style={{ color: '#E53935' }}>🔒 Cerrado</span>
                            ) : (
                              <span className="text-xs font-semibold" style={{ color: '#1D9E75' }}>⏰ {hora}</span>
                            )}
                          </div>
                        </div>

                        {/* Equipos */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-2xl flex-shrink-0">{p.flag_local}</span>
                            <span className="font-bold text-white text-sm truncate">{p.equipo_local}</span>
                          </div>
                          <span className="text-gray-500 font-bold text-sm px-2 flex-shrink-0">VS</span>
                          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                            <span className="font-bold text-white text-sm truncate text-right">{p.equipo_visitante}</span>
                            <span className="text-2xl flex-shrink-0">{p.flag_visitante}</span>
                          </div>
                        </div>

                        {/* Badges inferiores */}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {p.es_colombia && (
                            <span className="px-2 py-0.5 rounded-lg text-xs font-bold"
                              style={{ backgroundColor: 'rgba(113,69,214,0.2)', color: '#a78bfa' }}>
                              🇨🇴 Módulo Quintero
                            </span>
                          )}
                          {tienePron && !cerrado && !terminado && (
                            <span className="text-xs font-semibold text-green-400">Pronóstico guardado · toca para editar</span>
                          )}
                          {!tienePron && !cerrado && !terminado && (
                            <span className="text-xs text-gray-500">Toca para pronosticar →</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}

        {/* Link módulo final */}
        <div className="rounded-2xl p-4 flex items-center justify-between cursor-pointer"
          style={{ backgroundColor: '#231E3D', border: '1px solid rgba(113,69,214,0.4)' }}
          onClick={() => navigate('/modulo-final')}>
          <div>
            <p className="font-bold text-white">🌟 Módulo Final</p>
            <p className="text-xs text-gray-400">Goleador del torneo · Balón de Oro · 60 pts</p>
          </div>
          <span className="text-gray-400 text-sm">→</span>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
