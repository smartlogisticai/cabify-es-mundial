import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/home', icon: '🏠', label: 'Inicio' },
  { to: '/tabla', icon: '🏅', label: 'Tabla' },
  { to: '/resultados', icon: '⚽', label: 'Resultados' },
  { to: '/historial', icon: '📋', label: 'Historial' },
  { to: '/perfil', icon: '👤', label: 'Perfil' },
]

const adminItems = [
  { to: '/admin/pagos', icon: '💰', label: 'Pagos' },
  { to: '/admin/resultados', icon: '⚽', label: 'Resultados' },
  { to: '/admin/tabla', icon: '📊', label: 'Tabla' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const { profile } = useAuth()
  const isAdmin = profile?.rol === 'admin'

  const items = isAdmin ? adminItems : navItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50"
      style={{ backgroundColor: '#231E3D', borderTop: '1px solid #3d3560' }}>

      {isAdmin && (
        <div className="flex items-center justify-center gap-1 px-3 pt-1">
          <span className="text-xs font-bold" style={{ color: '#7145D6' }}>⚙️ Panel Admin</span>
        </div>
      )}

      <div className="flex justify-around items-center py-2">
        {items.map(item => {
          const active = pathname === item.to || pathname.startsWith(item.to + '/')
          return (
            <Link key={item.to} to={item.to}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all"
              style={{ color: active ? '#7145D6' : '#9ca3af' }}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          )
        })}

        {isAdmin && (
          <Link to="/home"
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl"
            style={{ color: '#9ca3af' }}>
            <span className="text-xl">🏠</span>
            <span className="text-xs font-semibold">Inicio</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
