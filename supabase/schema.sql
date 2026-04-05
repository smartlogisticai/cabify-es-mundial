-- ============================================================
-- Cabify es Mundial - Schema Supabase
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Tabla: users (extiende auth.users de Supabase)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  nombre      TEXT NOT NULL,
  alias       TEXT NOT NULL,
  rol         TEXT NOT NULL DEFAULT 'participante' CHECK (rol IN ('participante', 'admin', 'tesorero')),
  estado      TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'activo', 'inactivo')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Tabla: partidos
-- ============================================================
CREATE TABLE IF NOT EXISTS public.partidos (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipo_local        TEXT NOT NULL,
  equipo_visitante    TEXT NOT NULL,
  flag_local          TEXT NOT NULL DEFAULT '🏳️',
  flag_visitante      TEXT NOT NULL DEFAULT '🏳️',
  fecha_hora          TIMESTAMPTZ NOT NULL,
  fase                TEXT NOT NULL CHECK (fase IN ('grupos', 'octavos', 'cuartos', 'semis', 'final')),
  jornada             INTEGER,
  es_colombia         BOOLEAN NOT NULL DEFAULT FALSE,
  estado              TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_vivo', 'terminado')),
  cierre_pronosticos  TIMESTAMPTZ,
  goles_local         INTEGER,
  goles_visitante     INTEGER,
  quintero_gol        BOOLEAN,
  quintero_asistencia BOOLEAN,
  api_football_id     TEXT,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Tabla: pronosticos
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pronosticos (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  partido_id              UUID NOT NULL REFERENCES public.partidos(id) ON DELETE CASCADE,
  goles_local             INTEGER NOT NULL DEFAULT 0,
  goles_visitante         INTEGER NOT NULL DEFAULT 0,
  resultado               TEXT NOT NULL CHECK (resultado IN ('local', 'empate', 'visitante')),
  quintero_gol            BOOLEAN,
  quintero_asistencia     BOOLEAN,
  pts_marcador            INTEGER DEFAULT 0,
  pts_resultado           INTEGER DEFAULT 0,
  pts_quintero_gol        INTEGER DEFAULT 0,
  pts_quintero_asistencia INTEGER DEFAULT 0,
  pts_total               INTEGER DEFAULT 0,
  calculado               BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, partido_id)
);

-- ============================================================
-- Tabla: modulo_final
-- ============================================================
CREATE TABLE IF NOT EXISTS public.modulo_final (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  goleador_torneo  TEXT,
  balon_de_oro     TEXT,
  pts_goleador     INTEGER DEFAULT 0,
  pts_balon_oro    INTEGER DEFAULT 0,
  calculado        BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Tabla: clasificacion_fases
-- ============================================================
CREATE TABLE IF NOT EXISTS public.clasificacion_fases (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  fase        TEXT NOT NULL CHECK (fase IN ('grupos', 'eliminatorias', 'final', 'total')),
  puntos      INTEGER NOT NULL DEFAULT 0,
  posicion    INTEGER,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fase)
);

-- ============================================================
-- Trigger: cierre_pronosticos = fecha_hora - 1 hora
-- ============================================================
CREATE OR REPLACE FUNCTION set_cierre_pronosticos()
RETURNS TRIGGER AS $$
BEGIN
  NEW.cierre_pronosticos = NEW.fecha_hora - INTERVAL '1 hour';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER partidos_cierre_pronosticos
  BEFORE INSERT OR UPDATE OF fecha_hora ON public.partidos
  FOR EACH ROW EXECUTE FUNCTION set_cierre_pronosticos();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pronosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modulo_final ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clasificacion_fases ENABLE ROW LEVEL SECURITY;

-- USERS
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_admin" ON public.users FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol = 'admin')
);

-- PARTIDOS (todos pueden leer, solo admin modifica)
CREATE POLICY "partidos_select_all" ON public.partidos FOR SELECT USING (TRUE);
CREATE POLICY "partidos_admin_write" ON public.partidos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol = 'admin')
);

-- PRONOSTICOS
-- Solo puede crear/editar sus propios pronósticos y antes del cierre
CREATE POLICY "pronosticos_select_own" ON public.pronosticos FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.partidos WHERE id = partido_id AND estado = 'terminado')
);
CREATE POLICY "pronosticos_insert_own" ON public.pronosticos FOR INSERT WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.partidos WHERE id = partido_id AND cierre_pronosticos > NOW())
);
CREATE POLICY "pronosticos_update_own" ON public.pronosticos FOR UPDATE USING (
  user_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.partidos WHERE id = partido_id AND cierre_pronosticos > NOW())
);
CREATE POLICY "pronosticos_admin" ON public.pronosticos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol = 'admin')
);

-- MODULO FINAL
CREATE POLICY "modulo_final_own" ON public.modulo_final FOR ALL USING (user_id = auth.uid());

-- CLASIFICACION (solo lectura para todos)
CREATE POLICY "clasificacion_select_all" ON public.clasificacion_fases FOR SELECT USING (TRUE);
CREATE POLICY "clasificacion_admin_write" ON public.clasificacion_fases FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol = 'admin')
);

-- ============================================================
-- Trigger: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pronosticos_updated_at BEFORE UPDATE ON public.pronosticos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER partidos_updated_at BEFORE UPDATE ON public.partidos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER clasificacion_updated_at BEFORE UPDATE ON public.clasificacion_fases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
