-- =============================================
-- Script para permitir leitura anônima dos dados
-- (necessário para o painel admin funcionar)
-- Execute no SQL Editor do Supabase
-- =============================================

-- Permitir SELECT anônimo na tabela respostas
-- Isso permite que a API do admin busque os dados
CREATE POLICY "Permitir select anonimo" ON respostas
  FOR SELECT
  TO anon
  USING (true);
