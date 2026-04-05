import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const { partido_id } = await req.json()

  // Obtener datos del partido
  const { data: partido, error: pError } = await supabase
    .from('partidos')
    .select('*')
    .eq('id', partido_id)
    .single()

  if (pError || !partido || partido.estado !== 'terminado') {
    return new Response(JSON.stringify({ error: 'Partido no encontrado o no terminado' }), { status: 400 })
  }

  // Calcular resultado real
  let resultado_real: string
  if (partido.goles_local > partido.goles_visitante) resultado_real = 'local'
  else if (partido.goles_local < partido.goles_visitante) resultado_real = 'visitante'
  else resultado_real = 'empate'

  // Obtener todos los pronósticos de este partido
  const { data: pronosticos } = await supabase
    .from('pronosticos')
    .select('*')
    .eq('partido_id', partido_id)
    .eq('calculado', false)

  if (!pronosticos || pronosticos.length === 0) {
    return new Response(JSON.stringify({ message: 'No hay pronósticos pendientes' }))
  }

  // Calcular puntos para cada pronóstico
  const updates = pronosticos.map(p => {
    let pts_marcador = 0
    let pts_resultado = 0
    let pts_quintero_gol = 0
    let pts_quintero_asistencia = 0

    // Marcador exacto: 10 + 1 por cada gol adicional sobre 4 totales
    if (p.goles_local === partido.goles_local && p.goles_visitante === partido.goles_visitante) {
      const totalGoles = partido.goles_local + partido.goles_visitante
      pts_marcador = 10 + Math.max(0, totalGoles - 4)
    }

    // Resultado correcto
    if (p.resultado === resultado_real) {
      pts_resultado = 5
    }

    // Módulo Colombia: Sí correcto = 5pts, No correcto = 3pts
    if (partido.es_colombia) {
      if (p.quintero_gol === partido.quintero_gol)
        pts_quintero_gol = partido.quintero_gol ? 5 : 3
      if (p.quintero_asistencia === partido.quintero_asistencia)
        pts_quintero_asistencia = partido.quintero_asistencia ? 5 : 3
    }

    const pts_total = pts_marcador + pts_resultado + pts_quintero_gol + pts_quintero_asistencia

    return {
      id: p.id,
      user_id: p.user_id,
      pts_marcador,
      pts_resultado,
      pts_quintero_gol,
      pts_quintero_asistencia,
      pts_total,
      calculado: true,
    }
  })

  // Actualizar pronósticos
  for (const u of updates) {
    await supabase.from('pronosticos').update({
      pts_marcador: u.pts_marcador,
      pts_resultado: u.pts_resultado,
      pts_quintero_gol: u.pts_quintero_gol,
      pts_quintero_asistencia: u.pts_quintero_asistencia,
      pts_total: u.pts_total,
      calculado: true,
    }).eq('id', u.id)
  }

  // Determinar fase de clasificación
  const fase_clasi = ['grupos'].includes(partido.fase)
    ? 'grupos'
    : ['octavos', 'cuartos', 'semis'].includes(partido.fase)
    ? 'eliminatorias'
    : 'final'

  // Actualizar clasificacion_fases para cada usuario
  for (const u of updates) {
    // Actualizar fase específica
    const { data: existing } = await supabase
      .from('clasificacion_fases')
      .select('id, puntos')
      .eq('user_id', u.user_id)
      .eq('fase', fase_clasi)
      .single()

    if (existing) {
      await supabase.from('clasificacion_fases')
        .update({ puntos: existing.puntos + u.pts_total })
        .eq('id', existing.id)
    } else {
      await supabase.from('clasificacion_fases')
        .insert({ user_id: u.user_id, fase: fase_clasi, puntos: u.pts_total })
    }

    // Actualizar total
    const { data: totalRow } = await supabase
      .from('clasificacion_fases')
      .select('id, puntos')
      .eq('user_id', u.user_id)
      .eq('fase', 'total')
      .single()

    if (totalRow) {
      await supabase.from('clasificacion_fases')
        .update({ puntos: totalRow.puntos + u.pts_total })
        .eq('id', totalRow.id)
    } else {
      await supabase.from('clasificacion_fases')
        .insert({ user_id: u.user_id, fase: 'total', puntos: u.pts_total })
    }
  }

  // Recalcular posiciones en cada fase afectada
  for (const faseName of [fase_clasi, 'total']) {
    const { data: rows } = await supabase
      .from('clasificacion_fases')
      .select('id, puntos')
      .eq('fase', faseName)
      .order('puntos', { ascending: false })

    if (rows) {
      for (let i = 0; i < rows.length; i++) {
        await supabase.from('clasificacion_fases')
          .update({ posicion: i + 1 })
          .eq('id', rows[i].id)
      }
    }
  }

  return new Response(JSON.stringify({
    success: true,
    pronosticos_calculados: updates.length
  }))
})
