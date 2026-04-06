import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-white"
      style={{ background: 'linear-gradient(160deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%)' }}>

      {/* Logo / Trophy */}
      <div className="text-8xl mb-4">🏆</div>

      <h1 className="text-4xl font-extrabold text-center mb-2">
        Cabify es Mundial
      </h1>
      <p className="text-lg text-purple-300 font-semibold mb-2">Mundial 2026</p>
      <p className="text-center text-gray-300 max-w-xs mb-10">
        Pronostica los partidos, acumula puntos y compite por premios reales con tus compañeros de Cabify Colombia.
      </p>

      <div className="w-full max-w-xs flex flex-col gap-3">
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 rounded-xl font-bold text-white text-lg"
          style={{ backgroundColor: '#7145D6' }}
        >
          Entrar
        </button>
        <button
          onClick={() => navigate('/bienvenida-registro')}
          className="w-full py-3 rounded-xl font-bold text-lg border-2"
          style={{ borderColor: '#7145D6', color: '#7145D6', background: 'transparent' }}
        >
          Registrarme
        </button>
      </div>

      <p className="mt-8 text-xs text-gray-500">Solo para empleados de Cabify Colombia</p>
    </div>
  )
}
