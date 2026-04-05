-- ============================================================
-- Cabify es Mundial - Partidos Fase de Grupos · Mundial 2026
-- 48 partidos · 16 grupos (A–P) · 3 jornadas
--
-- NOTA: Los grupos son proyecciones basadas en los clasificados
-- conocidos. El sorteo oficial fue diciembre 2025. Ajusta los
-- equipos y fechas exactas si difieren del cuadro real.
--
-- Horas en UTC · Colombia = UTC-5
--   13:00 UTC = 8:00 am COL
--   16:00 UTC = 11:00 am COL
--   19:00 UTC = 2:00 pm COL
--   22:00 UTC = 5:00 pm COL
--
-- cierre_pronosticos se calcula automáticamente por trigger
-- (= fecha_hora - 1 hora)
-- ============================================================

INSERT INTO public.partidos
  (equipo_local, equipo_visitante, flag_local, flag_visitante,
   fecha_hora, fase, jornada, es_colombia, estado)
VALUES

-- ============================================================
-- GRUPO A: Estados Unidos · Irán · Sudáfrica
-- ============================================================
('Estados Unidos', 'Irán',        '🇺🇸', '🇮🇷', '2026-06-11 13:00:00+00', 'grupos', 1, false, 'pendiente'),
('Estados Unidos', 'Sudáfrica',   '🇺🇸', '🇿🇦', '2026-06-18 13:00:00+00', 'grupos', 2, false, 'pendiente'),
('Irán',           'Sudáfrica',   '🇮🇷', '🇿🇦', '2026-06-26 18:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO B: México · Polonia · Ecuador
-- ============================================================
('México',   'Polonia',  '🇲🇽', '🇵🇱', '2026-06-11 16:00:00+00', 'grupos', 1, false, 'pendiente'),
('México',   'Ecuador',  '🇲🇽', '🇪🇨', '2026-06-18 16:00:00+00', 'grupos', 2, false, 'pendiente'),
('Polonia',  'Ecuador',  '🇵🇱', '🇪🇨', '2026-06-26 18:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO C: Canadá · Bélgica · Mali
-- ============================================================
('Canadá',  'Bélgica', '🇨🇦', '🇧🇪', '2026-06-11 19:00:00+00', 'grupos', 1, false, 'pendiente'),
('Canadá',  'Mali',    '🇨🇦', '🇲🇱', '2026-06-18 19:00:00+00', 'grupos', 2, false, 'pendiente'),
('Bélgica', 'Mali',    '🇧🇪', '🇲🇱', '2026-06-26 22:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO D: Alemania · Colombia · Costa de Marfil
-- *** Colombia juega en este grupo ***
-- ============================================================
('Alemania',        'Colombia',        '🇩🇪', '🇨🇴', '2026-06-11 22:00:00+00', 'grupos', 1, true,  'pendiente'),
('Alemania',        'Costa de Marfil', '🇩🇪', '🇨🇮', '2026-06-18 22:00:00+00', 'grupos', 2, false, 'pendiente'),
('Colombia',        'Costa de Marfil', '🇨🇴', '🇨🇮', '2026-06-26 22:00:00+00', 'grupos', 3, true,  'pendiente'),

-- ============================================================
-- GRUPO E: Francia · Australia · Honduras
-- ============================================================
('Francia',    'Australia', '🇫🇷', '🇦🇺', '2026-06-12 13:00:00+00', 'grupos', 1, false, 'pendiente'),
('Francia',    'Honduras',  '🇫🇷', '🇭🇳', '2026-06-19 13:00:00+00', 'grupos', 2, false, 'pendiente'),
('Australia',  'Honduras',  '🇦🇺', '🇭🇳', '2026-06-27 18:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO F: España · Japón · Panamá
-- ============================================================
('España',  'Japón',  '🇪🇸', '🇯🇵', '2026-06-12 16:00:00+00', 'grupos', 1, false, 'pendiente'),
('España',  'Panamá', '🇪🇸', '🇵🇦', '2026-06-19 16:00:00+00', 'grupos', 2, false, 'pendiente'),
('Japón',   'Panamá', '🇯🇵', '🇵🇦', '2026-06-27 18:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO G: Inglaterra · Senegal · Uruguay
-- ============================================================
('Inglaterra', 'Senegal', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇸🇳', '2026-06-12 19:00:00+00', 'grupos', 1, false, 'pendiente'),
('Inglaterra', 'Uruguay', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇺🇾', '2026-06-19 19:00:00+00', 'grupos', 2, false, 'pendiente'),
('Senegal',    'Uruguay', '🇸🇳',      '🇺🇾', '2026-06-27 22:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO H: Argentina · Suiza · Iraq
-- ============================================================
('Argentina', 'Suiza', '🇦🇷', '🇨🇭', '2026-06-12 22:00:00+00', 'grupos', 1, false, 'pendiente'),
('Argentina', 'Iraq',  '🇦🇷', '🇮🇶', '2026-06-19 22:00:00+00', 'grupos', 2, false, 'pendiente'),
('Suiza',     'Iraq',  '🇨🇭', '🇮🇶', '2026-06-27 22:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO I: Brasil · Croacia · Nueva Zelanda
-- ============================================================
('Brasil',  'Croacia',        '🇧🇷', '🇭🇷', '2026-06-13 13:00:00+00', 'grupos', 1, false, 'pendiente'),
('Brasil',  'Nueva Zelanda',  '🇧🇷', '🇳🇿', '2026-06-20 13:00:00+00', 'grupos', 2, false, 'pendiente'),
('Croacia', 'Nueva Zelanda',  '🇭🇷', '🇳🇿', '2026-06-28 18:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO J: Portugal · Marruecos · Bolivia
-- ============================================================
('Portugal',   'Marruecos', '🇵🇹', '🇲🇦', '2026-06-13 16:00:00+00', 'grupos', 1, false, 'pendiente'),
('Portugal',   'Bolivia',   '🇵🇹', '🇧🇴', '2026-06-20 16:00:00+00', 'grupos', 2, false, 'pendiente'),
('Marruecos',  'Bolivia',   '🇲🇦', '🇧🇴', '2026-06-28 18:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO K: Países Bajos · Corea del Sur · Camerún
-- ============================================================
('Países Bajos',   'Corea del Sur', '🇳🇱', '🇰🇷', '2026-06-13 19:00:00+00', 'grupos', 1, false, 'pendiente'),
('Países Bajos',   'Camerún',       '🇳🇱', '🇨🇲', '2026-06-20 19:00:00+00', 'grupos', 2, false, 'pendiente'),
('Corea del Sur',  'Camerún',       '🇰🇷', '🇨🇲', '2026-06-28 22:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO L: Italia · Arabia Saudita · Venezuela
-- ============================================================
('Italia',          'Arabia Saudita', '🇮🇹', '🇸🇦', '2026-06-13 22:00:00+00', 'grupos', 1, false, 'pendiente'),
('Italia',          'Venezuela',      '🇮🇹', '🇻🇪', '2026-06-20 22:00:00+00', 'grupos', 2, false, 'pendiente'),
('Arabia Saudita',  'Venezuela',      '🇸🇦', '🇻🇪', '2026-06-28 22:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO M: Dinamarca · Nigeria · Jamaica
-- ============================================================
('Dinamarca', 'Nigeria', '🇩🇰', '🇳🇬', '2026-06-14 13:00:00+00', 'grupos', 1, false, 'pendiente'),
('Dinamarca', 'Jamaica', '🇩🇰', '🇯🇲', '2026-06-21 13:00:00+00', 'grupos', 2, false, 'pendiente'),
('Nigeria',   'Jamaica', '🇳🇬', '🇯🇲', '2026-06-29 18:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO N: Turquía · Ghana · Qatar
-- ============================================================
('Turquía', 'Ghana',  '🇹🇷', '🇬🇭', '2026-06-14 16:00:00+00', 'grupos', 1, false, 'pendiente'),
('Turquía', 'Qatar',  '🇹🇷', '🇶🇦', '2026-06-21 16:00:00+00', 'grupos', 2, false, 'pendiente'),
('Ghana',   'Qatar',  '🇬🇭', '🇶🇦', '2026-06-29 18:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO O: Serbia · Egipto · Uzbekistán
-- ============================================================
('Serbia',    'Egipto',     '🇷🇸', '🇪🇬', '2026-06-14 19:00:00+00', 'grupos', 1, false, 'pendiente'),
('Serbia',    'Uzbekistán', '🇷🇸', '🇺🇿', '2026-06-21 19:00:00+00', 'grupos', 2, false, 'pendiente'),
('Egipto',    'Uzbekistán', '🇪🇬', '🇺🇿', '2026-06-29 22:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO P: Austria · Ucrania · Costa Rica
-- ============================================================
('Austria',  'Ucrania',    '🇦🇹', '🇺🇦', '2026-06-14 22:00:00+00', 'grupos', 1, false, 'pendiente'),
('Austria',  'Costa Rica', '🇦🇹', '🇨🇷', '2026-06-21 22:00:00+00', 'grupos', 2, false, 'pendiente'),
('Ucrania',  'Costa Rica', '🇺🇦', '🇨🇷', '2026-06-29 22:00:00+00', 'grupos', 3, false, 'pendiente');

-- ============================================================
-- Verificación: debe retornar 48
-- SELECT COUNT(*) FROM public.partidos WHERE fase = 'grupos';
-- ============================================================
