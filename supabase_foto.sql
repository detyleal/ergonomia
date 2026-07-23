-- =============================================
-- Script para adicionar suporte a fotos
-- Execute no SQL Editor do Supabase
-- =============================================

-- 1. Adicionar coluna foto_url na tabela respostas
ALTER TABLE respostas ADD COLUMN foto_url TEXT;

-- 2. Criar bucket de storage para as fotos
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos-workspace', 'fotos-workspace', true);

-- 3. Permitir upload anônimo no bucket
CREATE POLICY "Permitir upload anonimo" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'fotos-workspace');

-- 4. Permitir leitura pública das fotos
CREATE POLICY "Permitir leitura publica" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'fotos-workspace');
