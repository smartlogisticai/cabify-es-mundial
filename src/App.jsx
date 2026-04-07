import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { initGlobalButtonSounds, startAmbient } from './lib/sounds'
import { ThemeProvider } from './context/ThemeContext'

initGlobalButtonSounds()
import { AuthProvider } from './context/AuthContext'
import { RequireAuth, RequireActive, RequireAdmin } from './components/ProtectedRoute'

import Splash from './pages/Splash'
import Login from './pages/Login'
import Registro from './pages/Registro'
import BienvenidaRegistro from './pages/BienvenidaRegistro'
import Pago from './pages/Pago'
import PagoConfirmado from './pages/PagoConfirmado'
import Home from './pages/Home'
import Pronostico from './pages/Pronostico'
import ModuloFinal from './pages/ModuloFinal'
import Tabla from './pages/Tabla'
import Resultados from './pages/Resultados'
import Historial from './pages/Historial'
import Perfil from './pages/Perfil'
import PerfilPublico from './pages/PerfilPublico'
import AdminLayout from './pages/admin/AdminLayout'
import AdminPagos from './pages/admin/AdminPagos'
import AdminResultados from './pages/admin/AdminResultados'
import AdminTabla from './pages/admin/AdminTabla'

export default function App() {
  useEffect(() => {
    const start = () => startAmbient()
    document.addEventListener('click', start, { once: true, passive: true })
    document.addEventListener('touchstart', start, { once: true, passive: true })
    return () => {
      document.removeEventListener('click', start)
      document.removeEventListener('touchstart', start)
    }
  }, [])

  return (
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bienvenida-registro" element={<BienvenidaRegistro />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/pago" element={<RequireAuth><Pago /></RequireAuth>} />
          <Route path="/pago-confirmado" element={<RequireAuth><PagoConfirmado /></RequireAuth>} />

          <Route path="/home" element={<RequireActive><Home /></RequireActive>} />
          <Route path="/pronostico/:id" element={<RequireActive><Pronostico /></RequireActive>} />
          <Route path="/modulo-final" element={<RequireActive><ModuloFinal /></RequireActive>} />
          <Route path="/tabla" element={<RequireActive><Tabla /></RequireActive>} />
          <Route path="/resultados" element={<RequireActive><Resultados /></RequireActive>} />
          <Route path="/historial" element={<RequireActive><Historial /></RequireActive>} />
          <Route path="/perfil" element={<RequireActive><Perfil /></RequireActive>} />
          <Route path="/perfil/:userId" element={<RequireActive><PerfilPublico /></RequireActive>} />

          <Route path="/admin" element={
            <RequireAuth><RequireAdmin><AdminLayout /></RequireAdmin></RequireAuth>
          }>
            <Route index element={<Navigate to="/admin/pagos" replace />} />
            <Route path="pagos" element={<AdminPagos />} />
            <Route path="resultados" element={<AdminResultados />} />
            <Route path="tabla" element={<AdminTabla />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  )
}
