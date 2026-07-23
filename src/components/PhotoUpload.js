'use client';

import { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PhotoUpload({ photoUrl, onPhotoUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(photoUrl || null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem (JPG, PNG, etc.).');
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Gerar nome único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      // Upload para Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('fotos-workspace')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('fotos-workspace')
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;

      // Preview local
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);

      onPhotoUploaded(publicUrl);
    } catch (err) {
      setError(`Erro ao enviar foto: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onPhotoUploaded(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="photo-upload">
      <label className="question-card__label">
        📷 Foto do seu local de trabalho <span className="photo-upload__optional">(opcional)</span>
      </label>
      <p className="photo-upload__hint">
        Tire uma foto ou selecione uma imagem do seu ambiente de trabalho. Máximo 5MB.
      </p>

      {preview ? (
        <div className="photo-upload__preview-wrapper">
          <img src={preview} alt="Preview do local de trabalho" className="photo-upload__preview" />
          <button type="button" className="photo-upload__remove" onClick={handleRemove}>
            ✕ Remover
          </button>
        </div>
      ) : (
        <div
          className={`photo-upload__dropzone ${uploading ? 'photo-upload__dropzone--uploading' : ''}`}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {uploading ? (
            <>
              <span className="spinner" />
              <span className="photo-upload__dropzone-text">Enviando foto...</span>
            </>
          ) : (
            <>
              <span className="photo-upload__dropzone-icon">📸</span>
              <span className="photo-upload__dropzone-text">
                Clique para selecionar uma foto
              </span>
              <span className="photo-upload__dropzone-subtext">
                JPG, PNG — máx. 5MB
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {error && (
        <div className="error-message" style={{ marginTop: '12px' }}>
          <span>⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
}
