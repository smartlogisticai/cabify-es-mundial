import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import teamImg from '../assets/team.jpeg'

export default function PagoConfirmado() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
      style={{ backgroundColor: 'var(--bg-primary)' }}>

      <div className="w-full max-w-sm flex flex-col items-center text-center gap-6">

        {/* Imagen del equipo */}
        <img
          src={teamImg}
          alt="Equipo Cabify"
          className="w-64 h-64 rounded-3xl object-cover object-center shadow-lg"
          style={{ border: '2px solid rgba(113,69,214,0.4)' }}
        />

        {/* Título */}
        <div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            ¡Gracias por tu pago! 🎉
          </h1>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Estamos trabajando en tu activación. Pronto el equipo administrativo
            activará tu usuario y podrás comenzar a pronosticar.
          </p>
        </div>

        {/* Ícono reloj */}
        <div className="text-5xl">⏳</div>

        {/* Tarjeta de estado */}
        <div className="w-full rounded-2xl p-4"
          style={{ backgroundColor: 'rgba(113,69,214,0.1)', border: '1px solid rgba(113,69,214,0.3)' }}>
          <p className="text-xs text-purple-300 font-semibold">Estado de tu cuenta</p>
          <p className="text-white font-bold mt-1">Pendiente de activación</p>
          <p className="text-xs text-gray-400 mt-1">
            Recibirás acceso completo una vez el administrador confirme tu pago.
          </p>
        </div>

        {/* Link instrucciones */}
        <button
          onClick={() => navigate('/pago')}
          className="text-sm font-semibold"
          style={{ color: 'var(--text-accent)' }}>
          ¿Aún no has pagado? Ver instrucciones →
        </button>

        {/* Cerrar sesión */}
        <button onClick={handleSignOut}
          className="w-full py-3 rounded-xl font-semibold text-gray-400 border"
          style={{ borderColor: 'var(--border)', backgroundColor: 'transparent' }}>
          Cerrar sesión
        </button>

      </div>
    </div>
  )
}
