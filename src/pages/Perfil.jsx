import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

export default function Perfil() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState([])
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'false')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('clasificacion_fases')
        .select('*')
        .eq('user_id', profile.id)
      setStats(data || [])
    }
    if (profile) load()
  }, [profile])

  function toggleDark() {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('darkMode', String(next))
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const faseStats = [
    { key: 'grupos', label: 'Grupos' },
    { key: 'eliminatorias', label: '16avos - Semis' },
    { key: 'final', label: 'Final' },
    { key: 'total', label: 'Total' },
  ]

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#1A1730' }}>
      <div className="px-5 pt-10 pb-6" style={{ background: 'linear-gradient(160deg, #2d1f5e 0%, #1A1730 80%)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold text-white"
            style={{ backgroundColor: '#7145D6' }}>
            {(profile?.alias || profile?.nombre || '?')[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">{profile?.alias}</h1>
            <p className="text-gray-400 text-sm">{profile?.nombre}</p>
            <p className="text-gray-500 text-xs">{profile?.email}</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        {/* Estadísticas por fase */}
        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: '#231E3D' }}>
          <h2 className="font-bold text-white mb-3">Estadísticas por fase</h2>
          <div className="grid grid-cols-2 gap-3">
            {faseStats.map(f => {
              const s = stats.find(st => st.fase === f.key)
              return (
                <div key={f.key} className="rounded-xl p-3 text-center"
                  style={{ backgroundColor: '#2d2752' }}>
                  <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                  <p className="text-xl font-extrabold" style={{ color: f.key === 'total' ? '#7145D6' : '#fff' }}>
                    {s?.puntos ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">pts</p>
                  {s?.posicion && (
                    <p className="text-xs text-gray-400 mt-1">Pos. #{s.posicion}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Configuración */}
        <div className="rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: '#231E3D', border: '1px solid #3d3560' }}>
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="font-semibold text-white">Modo oscuro</p>
              <p className="text-xs text-gray-400">Apariencia de la app</p>
            </div>
            <button onClick={toggleDark}
              className="w-12 h-6 rounded-full transition-all relative"
              style={{ backgroundColor: darkMode ? '#7145D6' : '#3d3560' }}>
              <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow"
                style={{ left: darkMode ? '26px' : '2px' }} />
            </button>
          </div>
        </div>

        {/* Cuenta */}
        <div className="rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: '#231E3D', border: '1px solid #3d3560' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: '#3d3560' }}>
            <p className="text-xs text-gray-400">Estado de cuenta</p>
            <p className="font-bold mt-0.5" style={{ color: profile?.estado === 'activo' ? '#1D9E75' : '#fbbf24' }}>
              {profile?.estado === 'activo' ? '✓ Activo' : '⏳ Pendiente'}
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-gray-400">Rol</p>
            <p className="font-bold text-white capitalize mt-0.5">{profile?.rol}</p>
          </div>
        </div>

        <button onClick={handleSignOut}
          className="w-full py-3 rounded-2xl font-bold text-red-400 border"
          style={{ borderColor: '#E53935', backgroundColor: 'rgba(229,57,53,0.08)' }}>
          Cerrar sesión
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
