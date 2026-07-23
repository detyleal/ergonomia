-- =============================================
-- Schema SQL para o Formulário de Ergonomia TCC
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- Tabela principal de respostas
CREATE TABLE respostas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Perguntas iniciais
  trabalha_home_office BOOLEAN NOT NULL,
  regiao_sjdr BOOLEAN NOT NULL,
  
  -- Questionário Nórdico de Sintomas Osteomusculares
  -- Formato JSONB: { "pescoco": { "problema_12m": bool, "impedido_12m": bool, "consulta_12m": bool, "problema_7d": bool }, ... }
  -- Regiões: pescoco, ombros, costa_superior, cotovelos, punhos_maos, costa_inferior, quadril_coxas, joelhos, tornozelos_pes
  nordico JSONB NOT NULL,
  
  -- Diagrama de Áreas Dolorosas (escala 0-7)
  -- Formato JSONB: { "esquerdo": { "pescoco": 0-7, "costa_superior": 0-7, ... }, "direito": { ... } }
  -- Regiões: pescoco, costa_superior, costa_media, costa_inferior, bacia, ombros, bracos, antebracos, punhos, maos, coxas, pernas, tornozelos_pes
  diagrama JSONB NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE respostas ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT anônimo (qualquer pessoa pode enviar resposta)
CREATE POLICY "Permitir insert anonimo" ON respostas
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política para permitir SELECT (para você consultar os dados depois)
CREATE POLICY "Permitir select autenticado" ON respostas
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir SELECT via service_role (para consultas via dashboard)
CREATE POLICY "Permitir select service role" ON respostas
  FOR SELECT
  TO service_role
  USING (true);
