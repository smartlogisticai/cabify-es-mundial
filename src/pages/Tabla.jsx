import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="px-5 pt-10 pb-4" style={{ background: 'linear-gradient(160deg, var(--bg-tertiary) 0%, var(--bg-primary) 80%)' }}>
        <h1 className="text-2xl font-extrabold text-white">🏅 Clasificación</h1>
      </div>

      {/* Pestañas de fase */}
      <div className="flex px-5 mt-4 gap-2">
        {FASES.map(f => (
          <button key={f.key} onClick={() => setFase(f.key)}
            className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              backgroundColor: fase === f.key ? '#7145D6' : 'var(--bg-secondary)',
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
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
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
                    backgroundColor: isMe ? 'rgba(113,69,214,0.25)' : 'var(--bg-secondary)',
                    border: isMe ? '2px solid #7145D6' : '1px solid var(--border)'
                  }}>
                  <span className="w-8 text-center font-bold text-gray-400 text-sm">
                    {medal || `#${idx + 1}`}
                  </span>
                  <div className="flex-1">
                    <button
                      data-nosound
                      onClick={() => navigate(`/perfil/${row.user_id}`)}
                      className="font-bold text-white text-sm text-left active:opacity-70">
                      {row.users?.alias || row.users?.nombre}
                      {isMe && <span className="ml-2 text-xs" style={{ color: 'var(--text-accent)' }}>(tú)</span>}
                    </button>
                  </div>
                  <span className="font-extrabold text-lg" style={{ color: isMe ? 'var(--text-accent)' : '#fff' }}>
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
