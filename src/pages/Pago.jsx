import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Pago() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
      style={{ backgroundColor: '#1A1730' }}>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⏳</div>
          <h1 className="text-2xl font-extrabold text-white">Pago pendiente</h1>
          <p className="text-gray-400 mt-1">Tu cuenta está pendiente de confirmación</p>
        </div>

        {/* Estado cuenta */}
        <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: '#231E3D', border: '1px solid #3d3560' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Cuenta</p>
              <p className="font-bold text-white">{profile?.nombre || '...'}</p>
              <p className="text-sm text-gray-400">{profile?.email}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold text-yellow-300"
              style={{ backgroundColor: 'rgba(234,179,8,0.15)' }}>
              PENDIENTE
            </span>
          </div>
        </div>

        {/* Instrucciones de pago */}
        <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: '#231E3D', border: '1px solid #7145D6' }}>
          <h2 className="font-bold text-white mb-3">📱 Instrucciones de pago</h2>
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <p>1. Realiza una transferencia de <span className="font-bold text-white">$30.000 COP</span></p>
            <p>2. Envía el pago al tesorero por <span className="font-bold text-purple-300">Nequi o transferencia bancaria</span></p>
            <p>3. Avísale al tesorero que ya pagaste, mencionando tu nombre y alias</p>
            <p>4. El admin confirmará tu pago y podrás comenzar a pronosticar</p>
          </div>
        </div>

        {/* Info torneo */}
        <div className="rounded-2xl p-4 mb-8 text-center" style={{ backgroundColor: 'rgba(113,69,214,0.1)', border: '1px solid rgba(113,69,214,0.3)' }}>
          <p className="text-sm text-purple-300">🏆 Pozo máximo del torneo</p>
          <p className="text-2xl font-extrabold text-white mt-1">$1.500.000 COP</p>
          <p className="text-xs text-gray-400 mt-1">Con 50 participantes · 100% va a premios</p>
        </div>

        <button onClick={() => navigate('/pago-confirmado')}
          className="w-full py-4 rounded-2xl font-bold text-white text-base mb-3"
          style={{ backgroundColor: '#7145D6' }}>
          ✅ Ya hice mi pago
        </button>

        <button onClick={handleSignOut}
          className="w-full py-3 rounded-xl font-semibold text-gray-400 border"
          style={{ borderColor: '#3d3560', backgroundColor: 'transparent' }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
