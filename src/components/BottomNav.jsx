import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/home', icon: '🏠', label: 'Inicio' },
  { to: '/tabla', icon: '🏅', label: 'Tabla' },
  { to: '/resultados', icon: '⚽', label: 'Resultados' },
  { to: '/historial', icon: '📋', label: 'Historial' },
  { to: '/perfil', icon: '👤', label: 'Perfil' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 z-50"
      style={{ backgroundColor: '#231E3D', borderTop: '1px solid #3d3560' }}>
      {navItems.map(item => {
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
    </nav>
  )
}
