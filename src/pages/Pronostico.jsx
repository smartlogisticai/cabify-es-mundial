import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'
import FlagEmoji from '../components/FlagEmoji'

export default function Pronostico() {
  const { id } = useParams()
  const { profile } = useAuth()
  const navigate = useNavigate()

  const [partido, setPartido] = useState(null)
  const [pronostico, setPronostico] = useState(null)
  const [golesLocal, setGolesLocal] = useState(0)
  const [golesVisitante, setGolesVisitante] = useState(0)
  const [quinteroGol, setQuinteroGol] = useState(false)
  const [quinteroAsistencia, setQuinteroAsistencia] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: p } = await supabase.from('partidos').select('*').eq('id', id).single()
      setPartido(p)
      const { data: pr } = await supabase.from('pronosticos')
        .select('*').eq('partido_id', id).eq('user_id', profile.id).single()
      if (pr) {
        setPronostico(pr)
        setGolesLocal(pr.goles_local)
        setGolesVisitante(pr.goles_visitante)
        setQuinteroGol(pr.quintero_gol || false)
        setQuinteroAsistencia(pr.quintero_asistencia || false)
      }
      setLoading(false)
    }
    load()
  }, [id, profile])

  const cerrado = partido ? new Date() > new Date(partido.cierre_pronosticos) : false

  function calcResultado(gl, gv) {
    if (gl > gv) return 'local'
    if (gl < gv) return 'visitante'
    return 'empate'
  }

  const resultado = calcResultado(golesLocal, golesVisitante)
  const ptsMarcador = 10 + Math.max(0, (golesLocal + golesVisitante) - 4)

  function handleSetResultado(res) {
    if (cerrado) return
    if (res === 'local' && golesLocal <= golesVisitante) {
      setGolesLocal(golesVisitante + 1)
    } else if (res === 'empate') {
      const eq = Math.max(golesLocal, golesVisitante)
      setGolesLocal(eq)
      setGolesVisitante(eq)
    } else if (res === 'visitante' && golesVisitante <= golesLocal) {
      setGolesVisitante(golesLocal + 1)
    }
  }

  async function handleSave() {
    if (cerrado) return
    setSaving(true)
    setError('')
    const data = {
      user_id: profile.id,
      partido_id: id,
      goles_local: golesLocal,
      goles_visitante: golesVisitante,
      resultado,
      quintero_gol: partido.es_colombia ? quinteroGol : null,
      quintero_asistencia: partido.es_colombia ? quinteroAsistencia : null,
    }
    let err
    if (pronostico) {
      ({ error: err } = await supabase.from('pronosticos').update(data).eq('id', pronostico.id))
    } else {
      ({ error: err } = await supabase.from('pronosticos').insert(data))
    }
    if (err) { setError(err.message); setSaving(false); return }
    setSaved(true)
    setSaving(false)
    setTimeout(() => navigate('/home'), 1200)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1730' }}>
      <div className="text-white">Cargando...</div>
    </div>
  )
  if (!partido) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1730' }}>
      <div className="text-white">Partido no encontrado</div>
    </div>
  )

  const hora = new Date(partido.fecha_hora).toLocaleString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Bogota',
  })

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#1A1730' }}>

      {/* Header */}
      <div className="px-5 pt-10 pb-5" style={{ background: 'linear-gradient(160deg, #2d1f5e 0%, #1A1730 80%)' }}>
        <button onClick={() => navigate(-1)} className="text-gray-400 mb-4 text-sm">← Volver</button>
        <p className="text-xs text-gray-400 capitalize mb-1">{partido.fase} · Jornada {partido.jornada}</p>
        <p className="text-xs text-gray-400 capitalize">{hora}</p>
        {cerrado && (
          <div className="mt-2 px-3 py-1 rounded-full text-xs font-bold text-red-300 inline-block"
            style={{ backgroundColor: 'rgba(229,57,53,0.15)' }}>
            🔒 Pronósticos cerrados
          </div>
        )}
      </div>

      <div className="px-5 mt-4">

        {/* Tarjeta principal: equipos + marcador */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: '#231E3D' }}>

          {/* Fila: local | marcador | visitante */}
          <div className="grid grid-cols-3 items-center gap-3">

            {/* Local */}
            <div className="flex flex-col items-center gap-2">
              <FlagEmoji emoji={partido.flag_local} size="xl" team={partido.equipo_local} />
              <span className="text-xs font-bold text-white text-center leading-tight">
                {partido.equipo_local}
              </span>
              {!cerrado && (
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setGolesLocal(g => Math.max(0, g - 1))}
                    className="w-9 h-9 rounded-xl font-bold text-lg active:scale-90 transition-transform"
                    style={{ backgroundColor: '#3d3560', color: '#fff' }}>−</button>
                  <button
                    onClick={() => setGolesLocal(g => g + 1)}
                    className="w-9 h-9 rounded-xl font-bold text-lg active:scale-90 transition-transform"
                    style={{ backgroundColor: '#7145D6', color: '#fff' }}>+</button>
                </div>
              )}
            </div>

            {/* Marcador central */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <span className="text-5xl font-extrabold text-white">{golesLocal}</span>
                <span className="text-3xl font-bold" style={{ color: '#6b7280' }}>:</span>
                <span className="text-5xl font-extrabold text-white">{golesVisitante}</span>
              </div>
              <span className="text-xs font-semibold mt-1" style={{ color: '#a78bfa' }}>
                {resultado === 'local' ? `Gana ${partido.equipo_local}` :
                  resultado === 'visitante' ? `Gana ${partido.equipo_visitante}` : 'Empate'}
              </span>
            </div>

            {/* Visitante */}
            <div className="flex flex-col items-center gap-2">
              <FlagEmoji emoji={partido.flag_visitante} size="xl" team={partido.equipo_visitante} />
              <span className="text-xs font-bold text-white text-center leading-tight">
                {partido.equipo_visitante}
              </span>
              {!cerrado && (
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setGolesVisitante(g => Math.max(0, g - 1))}
                    className="w-9 h-9 rounded-xl font-bold text-lg active:scale-90 transition-transform"
                    style={{ backgroundColor: '#3d3560', color: '#fff' }}>−</button>
                  <button
                    onClick={() => setGolesVisitante(g => g + 1)}
                    className="w-9 h-9 rounded-xl font-bold text-lg active:scale-90 transition-transform"
                    style={{ backgroundColor: '#7145D6', color: '#fff' }}>+</button>
                </div>
              )}
            </div>
          </div>

          {/* Botones de resultado */}
          <div className="flex gap-2 mt-5">
            {[
              { key: 'local', top: 'Gana', bottom: partido.equipo_local },
              { key: 'empate', top: 'Empate', bottom: null },
              { key: 'visitante', top: 'Gana', bottom: partido.equipo_visitante },
            ].map(({ key, top, bottom }) => {
              const activo = resultado === key
              return (
                <button key={key}
                  disabled={cerrado}
                  onClick={() => handleSetResultado(key)}
                  className="flex-1 py-3 px-1 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                  style={{
                    backgroundColor: activo ? '#7145D6' : '#2e2a4a',
                    border: activo ? '2px solid #9f72f7' : '2px solid transparent',
                  }}>
                  <span className="text-xs font-bold text-white">{top}</span>
                  {bottom && (
                    <span className="text-[10px] font-semibold mt-0.5 truncate w-full text-center"
                      style={{ color: activo ? '#e9d5ff' : '#9ca3af' }}>
                      {bottom}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Módulo Quintero */}
        {partido.es_colombia && (
          <div className="rounded-2xl p-5 mt-4" style={{ backgroundColor: '#231E3D', border: '2px solid #7145D6' }}>
            <h3 className="font-bold text-white mb-1">🇨🇴 Módulo Quintero</h3>
            <p className="text-xs text-gray-400 mb-4">¿Qué hará Juan Fernando Quintero en este partido?</p>

            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-white">Quintero hace gol</p>
                  <p className="text-xs text-gray-400">+5 puntos si aciertas</p>
                </div>
                <button disabled={cerrado} onClick={() => setQuinteroGol(v => !v)}
                  className="w-12 h-6 rounded-full transition-all relative disabled:opacity-40 flex-shrink-0"
                  style={{ backgroundColor: quinteroGol ? '#7145D6' : '#3d3560' }}>
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow"
                    style={{ left: quinteroGol ? '26px' : '2px' }} />
                </button>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-white">Quintero hace asistencia</p>
                  <p className="text-xs text-gray-400">+5 puntos si aciertas</p>
                </div>
                <button disabled={cerrado} onClick={() => setQuinteroAsistencia(v => !v)}
                  className="w-12 h-6 rounded-full transition-all relative disabled:opacity-40 flex-shrink-0"
                  style={{ backgroundColor: quinteroAsistencia ? '#7145D6' : '#3d3560' }}>
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow"
                    style={{ left: quinteroAsistencia ? '26px' : '2px' }} />
                </button>
              </label>
            </div>
          </div>
        )}

        {/* Puntos posibles */}
        <div className="rounded-2xl p-4 mt-4" style={{ backgroundColor: 'rgba(113,69,214,0.08)', border: '1px solid rgba(113,69,214,0.25)' }}>
          <p className="text-xs text-gray-400 mb-2">Puntos posibles en este partido</p>
          <div className="flex gap-4 flex-wrap">
            <div className="text-center">
              <p className="text-lg font-extrabold" style={{ color: '#a78bfa' }}>{ptsMarcador}</p>
              <p className="text-xs text-gray-400">Marcador exacto</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-extrabold text-white">5</p>
              <p className="text-xs text-gray-400">Resultado correcto</p>
            </div>
            {partido.es_colombia && <>
              <div className="text-center">
                <p className="text-lg font-extrabold text-white">5</p>
                <p className="text-xs text-gray-400">Quintero gol</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-white">5</p>
                <p className="text-xs text-gray-400">Quintero asist.</p>
              </div>
            </>}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}

        {!cerrado && (
          <button onClick={handleSave} disabled={saving || saved}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg mt-5 disabled:opacity-60 active:scale-95 transition-transform"
            style={{ backgroundColor: saved ? '#1D9E75' : '#7145D6' }}>
            {saved ? '✓ Pronóstico guardado' : saving ? 'Guardando...' : pronostico ? 'Actualizar pronóstico' : 'Guardar pronóstico'}
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
