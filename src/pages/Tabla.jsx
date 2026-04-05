import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

const FASES = [
  { key: 'grupos', label: 'Grupos' },
  { key: 'eliminatorias', label: '16avos - Semis' },
  { key: 'final', label: 'Final' },
]

export default function Tabla() {
  const { profile } = useAuth()
  const [fase, setFase] = useState('grupos')
  const [tabla, setTabla] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('clasificacion_fases')
        .select('*, users(alias, nombre)')
        .eq('fase', fase)
        .order('puntos', { ascending: false })
      setTabla(data || [])
      setLoading(false)
    }
    load()
  }, [fase])

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#1A1730' }}>
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(160deg, #2d1f5e 0%, #1A1730 80%)' }}>
        <h1 className="text-2xl font-extrabold text-white">🏅 Clasificación</h1>
      </div>

      {/* Pestañas de fase */}
      <div className="flex px-5 mt-4 gap-2">
        {FASES.map(f => (
          <button key={f.key} onClick={() => setFase(f.key)}
            className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              backgroundColor: fase === f.key ? '#7145D6' : '#231E3D',
              color: fase === f.key ? '#fff' : '#9ca3af'
            }}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="px-5 mt-4">
        {loading ? (
          <div className="text-center text-gray-400 py-10">Cargando...</div>
        ) : tabla.length === 0 ? (
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#231E3D' }}>
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-400">Aún no hay puntos en esta fase</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {tabla.map((row, idx) => {
              const isMe = row.user_id === profile.id
              const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null

              return (
                <div key={row.id}
                  className="rounded-2xl px-4 py-3 flex items-center gap-3"
                  style={{
                    backgroundColor: isMe ? 'rgba(113,69,214,0.25)' : '#231E3D',
                    border: isMe ? '2px solid #7145D6' : '1px solid #3d3560'
                  }}>
                  <span className="w-8 text-center font-bold text-gray-400 text-sm">
                    {medal || `#${idx + 1}`}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">
                      {row.users?.alias || row.users?.nombre}
                      {isMe && <span className="ml-2 text-xs" style={{ color: '#a78bfa' }}>(tú)</span>}
                    </p>
                  </div>
                  <span className="font-extrabold text-lg" style={{ color: isMe ? '#a78bfa' : '#fff' }}>
                    {row.puntos}
                    <span className="text-xs text-gray-400 font-normal ml-1">pts</span>
                  </span>
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
