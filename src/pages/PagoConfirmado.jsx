import teamImg from '../assets/team.jpeg'

export default function PagoConfirmado() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
      style={{ backgroundColor: '#1A1730' }}>

      <div className="w-full max-w-sm flex flex-col items-center text-center gap-6">

        {/* Imagen del equipo */}
        <img
          src={teamImg}
          alt="Equipo Cabify"
          className="w-64 rounded-3xl object-cover shadow-lg"
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
          <p className="text-white font-bold mt-1">Pago notificado · Pendiente de activación</p>
          <p className="text-xs text-gray-400 mt-1">
            Recibirás acceso completo una vez el administrador confirme tu pago.
          </p>
        </div>

      </div>
    </div>
  )
}
