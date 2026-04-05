import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminPagos() {
  const [pendientes, setPendientes] = useState([])
  const [activos, setActivos] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(null)

  async function load() {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false })
    setPendientes((data || []).filter(u => u.estado === 'pendiente'))
    setActivos((data || []).filter(u => u.estado === 'activo'))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function confirmarPago(userId) {
    setConfirming(userId)
    await supabase.from('users').update({ estado: 'activo' }).eq('id', userId)
    await load()
    setConfirming(null)
  }

  async function desactivar(userId) {
    await supabase.from('users').update({ estado: 'inactivo' }).eq('id', userId)
    await load()
  }

  const pozo = activos.length * 30000

  return (
    <div className="min-h-screen pb-10" style={{ backgroundColor: '#1A1730' }}>
      <div className="px-5 pt-10 pb-5" style={{ background: 'linear-gradient(160deg, #2d1f5e 0%, #1A1730 80%)' }}>
        <p className="text-xs text-purple-400 font-bold mb-1">PANEL ADMIN</p>
        <h1 className="text-2xl font-extrabold text-white">💰 Pagos y usuarios</h1>
      </div>

      {/* Stats */}
      <div className="flex gap-3 px-5 mt-4">
        <div className="flex-1 rounded-2xl p-4 text-center" style={{ backgroundColor: '#231E3D' }}>
          <p className="text-xs text-gray-400 mb-1">Activos</p>
          <p className="text-2xl font-extrabold text-green-400">{activos.length}</p>
        </div>
        <div className="flex-1 rounded-2xl p-4 text-center" style={{ backgroundColor: '#231E3D' }}>
          <p className="text-xs text-gray-400 mb-1">Pendientes</p>
          <p className="text-2xl font-extrabold text-yellow-400">{pendientes.length}</p>
        </div>
        <div className="flex-1 rounded-2xl p-4 text-center" style={{ backgroundColor: '#231E3D' }}>
          <p className="text-xs text-gray-400 mb-1">Recaudado</p>
          <p className="text-lg font-extrabold text-white">${(pozo / 1000).toFixed(0)}K</p>
        </div>
      </div>

      <div className="px-5 mt-5">
        {/* Pendientes */}
        <h2 className="font-bold text-white mb-3">⏳ Pendientes de pago ({pendientes.length})</h2>
        {loading ? (
          <div className="text-gray-400 text-center py-4">Cargando...</div>
        ) : pendientes.length === 0 ? (
          <div className="rounded-2xl p-4 text-center mb-5" style={{ backgroundColor: '#231E3D' }}>
            <p className="text-gray-400 text-sm">No hay pagos pendientes</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {pendientes.map(u => (
              <div key={u.id} className="rounded-2xl p-4" style={{ backgroundColor: '#231E3D', border: '1px solid #fbbf2450' }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-white">{u.nombre}</p>
                    <p className="text-xs text-gray-400">{u.alias} · {u.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Registrado: {new Date(u.created_at).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold text-yellow-300"
                    style={{ backgroundColor: 'rgba(251,191,36,0.15)' }}>
                    PENDIENTE
                  </span>
                </div>
                <button
                  onClick={() => confirmarPago(u.id)}
                  disabled={confirming === u.id}
                  className="w-full py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                  style={{ backgroundColor: '#1D9E75' }}>
                  {confirming === u.id ? 'Confirmando...' : '✓ Confirmar pago'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Activos */}
        <h2 className="font-bold text-white mb-3">✅ Participantes activos ({activos.length})</h2>
        <div className="flex flex-col gap-2">
          {activos.map(u => (
            <div key={u.id} className="rounded-2xl px-4 py-3 flex items-center justify-between"
              style={{ backgroundColor: '#231E3D', border: '1px solid #1D9E7530' }}>
              <div>
                <p className="font-semibold text-white text-sm">{u.nombre}</p>
                <p className="text-xs text-gray-400">{u.alias}</p>
              </div>
              <button onClick={() => desactivar(u.id)}
                className="text-xs text-red-400 px-2 py-1 rounded-lg"
                style={{ backgroundColor: 'rgba(229,57,53,0.1)' }}>
                Desactivar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
