import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', apellido: '', alias: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden'); return }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    try {
      await signUp(form)
      navigate('/pago')
    } catch (err) {
      setError(err.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500"
  const inputStyle = { backgroundColor: '#231E3D', border: '1px solid #3d3560' }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
      style={{ backgroundColor: '#1A1730' }}>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-2xl font-extrabold text-white">Crear cuenta</h1>
          <p className="text-gray-400 mt-1">Únete al pronóstico del Mundial 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Nombre</label>
              <input name="nombre" type="text" value={form.nombre} onChange={handleChange} required
                placeholder="Juan" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Apellido</label>
              <input name="apellido" type="text" value={form.apellido} onChange={handleChange} required
                placeholder="García" className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Alias (apodo)</label>
            <input name="alias" type="text" value={form.alias} onChange={handleChange} required
              placeholder="El Profeta" className={inputClass} style={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Correo electrónico</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required
              placeholder="tu@cabify.com" className={inputClass} style={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Contraseña</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required
              placeholder="••••••••" className={inputClass} style={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Confirmar contraseña</label>
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required
              placeholder="••••••••" className={inputClass} style={inputStyle} />
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-lg mt-2 disabled:opacity-60"
            style={{ backgroundColor: '#7145D6' }}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm" style={{ color: '#7145D6' }}>
            ¿Ya tienes cuenta? <span className="font-bold">Entrar</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
