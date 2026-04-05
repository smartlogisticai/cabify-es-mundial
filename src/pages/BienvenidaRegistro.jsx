import { useNavigate } from 'react-router-dom'
import quinteroImg from '../assets/quintero.jpeg'

export default function BienvenidaRegistro() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-end pb-12 px-6">

      {/* Imagen de fondo a pantalla completa */}
      <img
        src={quinteroImg}
        alt="Quintero"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Overlay degradado morado-oscuro */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(26,23,48,0.3) 0%, rgba(26,23,48,0.6) 40%, rgba(26,23,48,0.97) 75%)' }}
      />

      {/* Contenido encima del overlay */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center gap-5">

        {/* Trofeo */}
        <div className="text-6xl">🏆</div>

        {/* Título */}
        <h1 className="text-3xl font-extrabold text-white leading-tight">
          Cabify es Mundial
        </h1>

        {/* Texto legal/disclaimer */}
        <p className="text-sm text-gray-300 leading-relaxed">
          Esta plataforma es exclusiva para empleados de Cabify Colombia.
          Su uso es personal, sin ánimo de lucro, creada para hacer el
          Mundial 2026 más emocionante entre compañeros.
        </p>

        {/* Botón principal */}
        <button
          onClick={() => navigate('/registro')}
          className="w-full py-4 rounded-2xl font-bold text-white text-base mt-2 active:scale-95 transition-transform"
          style={{ backgroundColor: '#7145D6' }}>
          Entendido, continuar →
        </button>

        {/* Link login */}
        <button
          onClick={() => navigate('/login')}
          className="text-sm font-semibold"
          style={{ color: '#a78bfa' }}>
          ¿Ya tienes cuenta? Entrar
        </button>

      </div>
    </div>
  )
}
