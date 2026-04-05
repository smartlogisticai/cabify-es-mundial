import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const adminNav = [
  { to: '/admin/pagos', label: '💰 Pagos' },
  { to: '/admin/resultados', label: '⚽ Resultados' },
  { to: '/admin/tabla', label: '📊 Tabla' },
]

export default function AdminLayout() {
  const { pathname } = useLocation()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div style={{ backgroundColor: '#1A1730', minHeight: '100vh' }}>
      {/* Top nav */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3"
        style={{ backgroundColor: '#231E3D', borderBottom: '1px solid #3d3560' }}>
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-white text-sm">⚙️ Panel Admin</span>
          <Link to="/home" className="text-xs px-2 py-1 rounded-lg"
            style={{ backgroundColor: 'rgba(113,69,214,0.2)', color: '#a78bfa' }}>
            ← App
          </Link>
        </div>
        <button onClick={handleSignOut} className="text-xs text-gray-400">Cerrar sesión</button>
      </div>

      <div className="flex gap-1 px-4 py-2" style={{ backgroundColor: '#231E3D' }}>
        {adminNav.map(n => (
          <Link key={n.to} to={n.to}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-center transition-all"
            style={{
              backgroundColor: pathname.startsWith(n.to) ? '#7145D6' : 'transparent',
              color: pathname.startsWith(n.to) ? '#fff' : '#9ca3af'
            }}>
            {n.label}
          </Link>
        ))}
      </div>

      <Outlet />
    </div>
  )
}
