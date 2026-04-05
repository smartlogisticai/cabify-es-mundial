import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1730' }}>
    <div className="text-white">Cargando...</div>
  </div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export function RequireActive({ children }) {
  const { profile, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1730' }}>
    <div className="text-white">Cargando...</div>
  </div>
  if (!profile) return <Navigate to="/login" replace />
  if (profile.estado === 'pendiente') return <Navigate to="/pago-confirmado" replace />
  if (profile.estado === 'inactivo') return <Navigate to="/login" replace />
  return children
}

export function RequireAdmin({ children }) {
  const { profile, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1730' }}>
    <div className="text-white">Cargando...</div>
  </div>
  if (!profile || profile.rol !== 'admin') return <Navigate to="/home" replace />
  return children
}
