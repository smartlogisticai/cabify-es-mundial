import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single()
    setProfile(data)
    setLoading(false)
  }

  async function signUp({ email, password, nombre, apellido, alias }) {
    const nombreCompleto = `${nombre} ${apellido}`

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre: nombreCompleto, alias },
      },
    })
    if (error) throw error
    if (!data.user) throw new Error('No se pudo crear el usuario')

    const { error: insertError } = await supabase.from('users').insert({
      id: data.user.id,
      email,
      nombre: nombreCompleto,
      alias,
      rol: 'participante',
      estado: 'pendiente',
    })
    // Si el INSERT falla por RLS (email confirmation pendiente),
    // el trigger on_auth_user_created en Supabase lo maneja como respaldo.
    // Solo lanzamos el error si no es un conflicto de clave duplicada.
    if (insertError && insertError.code !== '23505') throw insertError

    return data
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
