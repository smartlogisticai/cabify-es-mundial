-- ============================================================
-- Cabify es Mundial · Partidos Fase de Grupos · Mundial 2026
-- 72 partidos · 12 grupos (A–L) · 4 equipos por grupo · 3 jornadas
--
-- Formato round-robin: cada equipo juega contra los otros 3 del grupo
-- J1: T1vsT2 + T3vsT4  |  J2: T1vsT3 + T2vsT4  |  J3: T1vsT4 + T2vsT3
--
-- Horas en UTC (Colombia = UTC-5)
--   13:00 UTC = 8:00 am COL    |   14:00 UTC = 9:00 am COL
--   16:00 UTC = 11:00 am COL   |   18:00 UTC = 1:00 pm COL
--   19:00 UTC = 2:00 pm COL    |   22:00 UTC = 5:00 pm COL
--
-- Jornada 1: Jun 11–14  |  Jornada 2: Jun 18–21  |  Jornada 3: Jun 24–27
-- Jornada 3: los 2 partidos de cada grupo se juegan a la misma hora
--
-- Colombia (Grupo K): 3 partidos marcados con es_colombia = true
--   J1 Jun 14 19:00 UTC: Uzbekistán vs Colombia
--   J2 Jun 21 19:00 UTC: RD Congo vs Colombia
--   J3 Jun 27 18:00 UTC: Portugal vs Colombia (simultáneo con RD Congo vs Uzbekistán)
--
-- cierre_pronosticos se calcula automáticamente por trigger (fecha_hora - 1h)
-- ============================================================

INSERT INTO public.partidos
  (equipo_local, equipo_visitante, flag_local, flag_visitante,
   fecha_hora, fase, jornada, es_colombia, estado)
VALUES

-- ============================================================
-- GRUPO A: México · Sudáfrica · Corea del Sur · Chequia
-- Jun 11 (J1) · Jun 18 (J2) · Jun 24 (J3)
-- ============================================================
-- Jornada 1 · Jun 11
('México',        'Sudáfrica',    '🇲🇽', '🇿🇦', '2026-06-11 13:00:00+00', 'grupos', 1, false, 'pendiente'),
('Corea del Sur', 'Chequia',      '🇰🇷', '🇨🇿', '2026-06-11 19:00:00+00', 'grupos', 1, false, 'pendiente'),
-- Jornada 2 · Jun 18
('México',        'Corea del Sur','🇲🇽', '🇰🇷', '2026-06-18 13:00:00+00', 'grupos', 2, false, 'pendiente'),
('Sudáfrica',     'Chequia',      '🇿🇦', '🇨🇿', '2026-06-18 19:00:00+00', 'grupos', 2, false, 'pendiente'),
-- Jornada 3 · Jun 24 (simultáneos)
('México',        'Chequia',      '🇲🇽', '🇨🇿', '2026-06-24 14:00:00+00', 'grupos', 3, false, 'pendiente'),
('Sudáfrica',     'Corea del Sur','🇿🇦', '🇰🇷', '2026-06-24 14:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO B: Canadá · Bosnia y Herzegovina · Catar · Suiza
-- Jun 11 (J1) · Jun 18 (J2) · Jun 24 (J3)
-- ============================================================
-- Jornada 1 · Jun 11
('Canadá',              'Bosnia y Herzegovina', '🇨🇦', '🇧🇦', '2026-06-11 13:00:00+00', 'grupos', 1, false, 'pendiente'),
('Catar',               'Suiza',                '🇶🇦', '🇨🇭', '2026-06-11 19:00:00+00', 'grupos', 1, false, 'pendiente'),
-- Jornada 2 · Jun 18
('Canadá',              'Catar',                '🇨🇦', '🇶🇦', '2026-06-18 13:00:00+00', 'grupos', 2, false, 'pendiente'),
('Bosnia y Herzegovina','Suiza',                '🇧🇦', '🇨🇭', '2026-06-18 19:00:00+00', 'grupos', 2, false, 'pendiente'),
-- Jornada 3 · Jun 24 (simultáneos)
('Canadá',              'Suiza',                '🇨🇦', '🇨🇭', '2026-06-24 18:00:00+00', 'grupos', 3, false, 'pendiente'),
('Bosnia y Herzegovina','Catar',                '🇧🇦', '🇶🇦', '2026-06-24 18:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO C: Brasil · Marruecos · Haití · Escocia
-- Jun 11 (J1) · Jun 18 (J2) · Jun 24 (J3)
-- ============================================================
-- Jornada 1 · Jun 11
('Brasil',    'Marruecos', '🇧🇷', '🇲🇦', '2026-06-11 16:00:00+00', 'grupos', 1, false, 'pendiente'),
('Haití',     'Escocia',   '🇭🇹', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '2026-06-11 22:00:00+00', 'grupos', 1, false, 'pendiente'),
-- Jornada 2 · Jun 18
('Brasil',    'Haití',     '🇧🇷', '🇭🇹', '2026-06-18 16:00:00+00', 'grupos', 2, false, 'pendiente'),
('Marruecos', 'Escocia',   '🇲🇦', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '2026-06-18 22:00:00+00', 'grupos', 2, false, 'pendiente'),
-- Jornada 3 · Jun 24 (simultáneos)
('Brasil',    'Escocia',   '🇧🇷', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '2026-06-24 22:00:00+00', 'grupos', 3, false, 'pendiente'),
('Marruecos', 'Haití',     '🇲🇦', '🇭🇹', '2026-06-24 22:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO D: Estados Unidos · Paraguay · Australia · Turquía
-- Jun 12 (J1) · Jun 19 (J2) · Jun 25 (J3)
-- ============================================================
-- Jornada 1 · Jun 12
('Estados Unidos', 'Paraguay',  '🇺🇸', '🇵🇾', '2026-06-12 13:00:00+00', 'grupos', 1, false, 'pendiente'),
('Australia',      'Turquía',   '🇦🇺', '🇹🇷', '2026-06-12 19:00:00+00', 'grupos', 1, false, 'pendiente'),
-- Jornada 2 · Jun 19
('Estados Unidos', 'Australia', '🇺🇸', '🇦🇺', '2026-06-19 13:00:00+00', 'grupos', 2, false, 'pendiente'),
('Paraguay',       'Turquía',   '🇵🇾', '🇹🇷', '2026-06-19 19:00:00+00', 'grupos', 2, false, 'pendiente'),
-- Jornada 3 · Jun 25 (simultáneos)
('Estados Unidos', 'Turquía',   '🇺🇸', '🇹🇷', '2026-06-25 14:00:00+00', 'grupos', 3, false, 'pendiente'),
('Paraguay',       'Australia', '🇵🇾', '🇦🇺', '2026-06-25 14:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO E: Alemania · Curazao · Costa de Marfil · Ecuador
-- Jun 12 (J1) · Jun 19 (J2) · Jun 25 (J3)
-- ============================================================
-- Jornada 1 · Jun 12
('Alemania',        'Curazao',          '🇩🇪', '🇨🇼', '2026-06-12 13:00:00+00', 'grupos', 1, false, 'pendiente'),
('Costa de Marfil', 'Ecuador',          '🇨🇮', '🇪🇨', '2026-06-12 19:00:00+00', 'grupos', 1, false, 'pendiente'),
-- Jornada 2 · Jun 19
('Alemania',        'Costa de Marfil',  '🇩🇪', '🇨🇮', '2026-06-19 13:00:00+00', 'grupos', 2, false, 'pendiente'),
('Curazao',         'Ecuador',          '🇨🇼', '🇪🇨', '2026-06-19 19:00:00+00', 'grupos', 2, false, 'pendiente'),
-- Jornada 3 · Jun 25 (simultáneos)
('Alemania',        'Ecuador',          '🇩🇪', '🇪🇨', '2026-06-25 18:00:00+00', 'grupos', 3, false, 'pendiente'),
('Curazao',         'Costa de Marfil',  '🇨🇼', '🇨🇮', '2026-06-25 18:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO F: Países Bajos · Japón · Suecia · Túnez
-- Jun 12 (J1) · Jun 19 (J2) · Jun 25 (J3)
-- ============================================================
-- Jornada 1 · Jun 12
('Países Bajos', 'Japón',  '🇳🇱', '🇯🇵', '2026-06-12 16:00:00+00', 'grupos', 1, false, 'pendiente'),
('Suecia',       'Túnez',  '🇸🇪', '🇹🇳', '2026-06-12 22:00:00+00', 'grupos', 1, false, 'pendiente'),
-- Jornada 2 · Jun 19
('Países Bajos', 'Suecia', '🇳🇱', '🇸🇪', '2026-06-19 16:00:00+00', 'grupos', 2, false, 'pendiente'),
('Japón',        'Túnez',  '🇯🇵', '🇹🇳', '2026-06-19 22:00:00+00', 'grupos', 2, false, 'pendiente'),
-- Jornada 3 · Jun 25 (simultáneos)
('Países Bajos', 'Túnez',  '🇳🇱', '🇹🇳', '2026-06-25 22:00:00+00', 'grupos', 3, false, 'pendiente'),
('Japón',        'Suecia', '🇯🇵', '🇸🇪', '2026-06-25 22:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO G: Bélgica · Egipto · Irán · Nueva Zelanda
-- Jun 13 (J1) · Jun 20 (J2) · Jun 26 (J3)
-- ============================================================
-- Jornada 1 · Jun 13
('Bélgica', 'Egipto',        '🇧🇪', '🇪🇬', '2026-06-13 13:00:00+00', 'grupos', 1, false, 'pendiente'),
('Irán',    'Nueva Zelanda', '🇮🇷', '🇳🇿', '2026-06-13 19:00:00+00', 'grupos', 1, false, 'pendiente'),
-- Jornada 2 · Jun 20
('Bélgica', 'Irán',          '🇧🇪', '🇮🇷', '2026-06-20 13:00:00+00', 'grupos', 2, false, 'pendiente'),
('Egipto',  'Nueva Zelanda', '🇪🇬', '🇳🇿', '2026-06-20 19:00:00+00', 'grupos', 2, false, 'pendiente'),
-- Jornada 3 · Jun 26 (simultáneos)
('Bélgica', 'Nueva Zelanda', '🇧🇪', '🇳🇿', '2026-06-26 14:00:00+00', 'grupos', 3, false, 'pendiente'),
('Egipto',  'Irán',          '🇪🇬', '🇮🇷', '2026-06-26 14:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO H: España · Cabo Verde · Arabia Saudita · Uruguay
-- Jun 13 (J1) · Jun 20 (J2) · Jun 26 (J3)
-- ============================================================
-- Jornada 1 · Jun 13
('España',       'Cabo Verde',     '🇪🇸', '🇨🇻', '2026-06-13 13:00:00+00', 'grupos', 1, false, 'pendiente'),
('Arabia Saudita','Uruguay',       '🇸🇦', '🇺🇾', '2026-06-13 19:00:00+00', 'grupos', 1, false, 'pendiente'),
-- Jornada 2 · Jun 20
('España',       'Arabia Saudita', '🇪🇸', '🇸🇦', '2026-06-20 13:00:00+00', 'grupos', 2, false, 'pendiente'),
('Cabo Verde',   'Uruguay',        '🇨🇻', '🇺🇾', '2026-06-20 19:00:00+00', 'grupos', 2, false, 'pendiente'),
-- Jornada 3 · Jun 26 (simultáneos)
('España',       'Uruguay',        '🇪🇸', '🇺🇾', '2026-06-26 18:00:00+00', 'grupos', 3, false, 'pendiente'),
('Cabo Verde',   'Arabia Saudita', '🇨🇻', '🇸🇦', '2026-06-26 18:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO I: Francia · Senegal · Irak · Noruega
-- Jun 13 (J1) · Jun 20 (J2) · Jun 26 (J3)
-- ============================================================
-- Jornada 1 · Jun 13
('Francia',  'Senegal', '🇫🇷', '🇸🇳', '2026-06-13 16:00:00+00', 'grupos', 1, false, 'pendiente'),
('Irak',     'Noruega', '🇮🇶', '🇳🇴', '2026-06-13 22:00:00+00', 'grupos', 1, false, 'pendiente'),
-- Jornada 2 · Jun 20
('Francia',  'Irak',    '🇫🇷', '🇮🇶', '2026-06-20 16:00:00+00', 'grupos', 2, false, 'pendiente'),
('Senegal',  'Noruega', '🇸🇳', '🇳🇴', '2026-06-20 22:00:00+00', 'grupos', 2, false, 'pendiente'),
-- Jornada 3 · Jun 26 (simultáneos)
('Francia',  'Noruega', '🇫🇷', '🇳🇴', '2026-06-26 22:00:00+00', 'grupos', 3, false, 'pendiente'),
('Senegal',  'Irak',    '🇸🇳', '🇮🇶', '2026-06-26 22:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO J: Argentina · Argelia · Austria · Jordania
-- Jun 14 (J1) · Jun 21 (J2) · Jun 27 (J3)
-- ============================================================
-- Jornada 1 · Jun 14
('Argentina', 'Argelia',  '🇦🇷', '🇩🇿', '2026-06-14 13:00:00+00', 'grupos', 1, false, 'pendiente'),
('Austria',   'Jordania', '🇦🇹', '🇯🇴', '2026-06-14 19:00:00+00', 'grupos', 1, false, 'pendiente'),
-- Jornada 2 · Jun 21
('Argentina', 'Austria',  '🇦🇷', '🇦🇹', '2026-06-21 13:00:00+00', 'grupos', 2, false, 'pendiente'),
('Argelia',   'Jordania', '🇩🇿', '🇯🇴', '2026-06-21 19:00:00+00', 'grupos', 2, false, 'pendiente'),
-- Jornada 3 · Jun 27 (simultáneos)
('Argentina', 'Jordania', '🇦🇷', '🇯🇴', '2026-06-27 14:00:00+00', 'grupos', 3, false, 'pendiente'),
('Argelia',   'Austria',  '🇩🇿', '🇦🇹', '2026-06-27 14:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO K: Portugal · RD Congo · Uzbekistán · Colombia
-- *** Colombia juega en este grupo — 3 partidos con es_colombia = true ***
-- Jun 14 (J1) · Jun 21 (J2) · Jun 27 (J3)
-- ============================================================
-- Jornada 1 · Jun 14
('Portugal',    'RD Congo',    '🇵🇹', '🇨🇩', '2026-06-14 13:00:00+00', 'grupos', 1, false, 'pendiente'),
('Uzbekistán',  'Colombia',    '🇺🇿', '🇨🇴', '2026-06-14 19:00:00+00', 'grupos', 1, true,  'pendiente'),
-- Jornada 2 · Jun 21
('Portugal',    'Uzbekistán',  '🇵🇹', '🇺🇿', '2026-06-21 13:00:00+00', 'grupos', 2, false, 'pendiente'),
('RD Congo',    'Colombia',    '🇨🇩', '🇨🇴', '2026-06-21 19:00:00+00', 'grupos', 2, true,  'pendiente'),
-- Jornada 3 · Jun 27 (simultáneos)
('Portugal',    'Colombia',    '🇵🇹', '🇨🇴', '2026-06-27 18:00:00+00', 'grupos', 3, true,  'pendiente'),
('RD Congo',    'Uzbekistán',  '🇨🇩', '🇺🇿', '2026-06-27 18:00:00+00', 'grupos', 3, false, 'pendiente'),

-- ============================================================
-- GRUPO L: Inglaterra · Croacia · Ghana · Panamá
-- Jun 14 (J1) · Jun 21 (J2) · Jun 27 (J3)
-- ============================================================
-- Jornada 1 · Jun 14
('Inglaterra', 'Croacia', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇭🇷', '2026-06-14 16:00:00+00', 'grupos', 1, false, 'pendiente'),
('Ghana',      'Panamá',  '🇬🇭', '🇵🇦', '2026-06-14 22:00:00+00', 'grupos', 1, false, 'pendiente'),
-- Jornada 2 · Jun 21
('Inglaterra', 'Ghana',   '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇬🇭', '2026-06-21 16:00:00+00', 'grupos', 2, false, 'pendiente'),
('Croacia',    'Panamá',  '🇭🇷', '🇵🇦', '2026-06-21 22:00:00+00', 'grupos', 2, false, 'pendiente'),
-- Jornada 3 · Jun 27 (simultáneos)
('Inglaterra', 'Panamá',  '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇵🇦', '2026-06-27 22:00:00+00', 'grupos', 3, false, 'pendiente'),
('Croacia',    'Ghana',   '🇭🇷', '🇬🇭', '2026-06-27 22:00:00+00', 'grupos', 3, false, 'pendiente');

-- ============================================================
-- Verificación rápida (ejecutar después del INSERT):
-- SELECT COUNT(*) FROM public.partidos WHERE fase = 'grupos';           -- debe ser 72
-- SELECT COUNT(*) FROM public.partidos WHERE es_colombia = true;        -- debe ser 3
-- SELECT equipo_local, equipo_visitante, fecha_hora, jornada
--   FROM public.partidos WHERE es_colombia = true ORDER BY fecha_hora;
-- ============================================================
