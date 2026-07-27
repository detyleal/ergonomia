'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const NORDIC_REGIONS = [
  { key: 'pescoco', label: 'Pescoço', icon: '🦴' },
  { key: 'ombros', label: 'Ombros', icon: '💪' },
  { key: 'costa_superior', label: 'Costa Superior', icon: '🔙' },
  { key: 'cotovelos', label: 'Cotovelos', icon: '🦾' },
  { key: 'punhos_maos', label: 'Punhos/Mãos', icon: '✋' },
  { key: 'costa_inferior', label: 'Costa Inferior', icon: '🔙' },
  { key: 'quadril_coxas', label: 'Quadril/Coxas', icon: '🦵' },
  { key: 'joelhos', label: 'Joelhos', icon: '🦿' },
  { key: 'tornozelos_pes', label: 'Tornozelos/Pés', icon: '🦶' },
];

const NORDIC_QUESTIONS = [
  { key: 'problema_12m', label: 'Problema 12m', shortLabel: '12m Prob' },
  { key: 'impedido_12m', label: 'Impedido 12m', shortLabel: '12m Imp' },
  { key: 'consulta_12m', label: 'Consulta 12m', shortLabel: '12m Cons' },
  { key: 'problema_7d', label: 'Problema 7d', shortLabel: '7d Prob' },
];

const DIAGRAM_REGIONS = [
  { key: 'pescoco', label: 'Pescoço' },
  { key: 'costa_superior', label: 'Costa Sup.' },
  { key: 'costa_media', label: 'Costa Méd.' },
  { key: 'costa_inferior', label: 'Costa Inf.' },
  { key: 'bacia', label: 'Bacia' },
  { key: 'ombros', label: 'Ombros' },
  { key: 'bracos', label: 'Braços' },
  { key: 'antebracos', label: 'Antebraços' },
  { key: 'punhos', label: 'Punhos' },
  { key: 'maos', label: 'Mãos' },
  { key: 'coxas', label: 'Coxas' },
  { key: 'pernas', label: 'Pernas' },
  { key: 'tornozelos_pes', label: 'Tornoz./Pés' },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getBarColor(val) {
  if (val === 0) return 'transparent';
  if (val <= 2) return '#4ade80';
  if (val <= 4) return '#fbbf24';
  return '#ef4444';
}

export default function ReportModal({ resposta, onClose }) {
  const reportRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  if (!resposta) return null;

  const nordicoRegionsWithProblems = NORDIC_REGIONS.filter(
    (r) => resposta.nordico?.[r.key]?.problema_12m === true
  ).length;

  const totalNordicoProblems = NORDIC_REGIONS.reduce((sum, r) => {
    const data = resposta.nordico?.[r.key];
    if (!data) return sum;
    return sum + Object.values(data).filter((v) => v === true).length;
  }, 0);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `relatorio-resposta-${formatDate(resposta.created_at).replace(/[\/\s:]/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Erro ao exportar:', err);
      alert('Erro ao exportar imagem. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="report-overlay" onClick={onClose}>
      <div className="report-wrapper" onClick={(e) => e.stopPropagation()}>
        {/* Action bar */}
        <div className="report-actions">
          <button className="report-actions__btn report-actions__btn--export" onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <><span className="spinner" /> Exportando...</>
            ) : (
              <>📥 Exportar como Imagem</>
            )}
          </button>
          <button className="report-actions__btn report-actions__btn--close" onClick={onClose}>
            ✕ Fechar
          </button>
        </div>

        {/* ====== REPORT CONTENT (captured by html2canvas) ====== */}
        <div ref={reportRef} className="report-card">
          {/* Header */}
          <div className="report-header">
            <div className="report-header__left">
              <div className="report-header__badge">Relatório Individual</div>
              <h2 className="report-header__title">Questionário de Ergonomia</h2>
              <p className="report-header__subtitle">Avaliação de Sintomas Osteomusculares</p>
            </div>
            <div className="report-header__right">
              <div className="report-header__date">{formatDate(resposta.created_at)}</div>
              <div className="report-header__id">ID: {resposta.id?.slice(0, 8)}...</div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="report-info-row">
            <div className="report-info-card">
              <span className="report-info-card__icon">🏠</span>
              <span className="report-info-card__label">Home Office</span>
              <span className={`report-info-card__value ${resposta.trabalha_home_office ? 'report-info-card__value--yes' : 'report-info-card__value--no'}`}>
                {resposta.trabalha_home_office ? 'Sim' : 'Não'}
              </span>
            </div>
            <div className="report-info-card">
              <span className="report-info-card__icon">📍</span>
              <span className="report-info-card__label">Região SJDR</span>
              <span className={`report-info-card__value ${resposta.regiao_sjdr ? 'report-info-card__value--yes' : 'report-info-card__value--no'}`}>
                {resposta.regiao_sjdr ? 'Sim' : 'Não'}
              </span>
            </div>
            <div className="report-info-card">
              <span className="report-info-card__icon">🩺</span>
              <span className="report-info-card__label">Regiões c/ Dor (12m)</span>
              <span className="report-info-card__value report-info-card__value--highlight">
                {nordicoRegionsWithProblems}/9
              </span>
            </div>
            <div className="report-info-card">
              <span className="report-info-card__icon">⚠️</span>
              <span className="report-info-card__label">Total Sim (Nórdico)</span>
              <span className="report-info-card__value report-info-card__value--highlight">
                {totalNordicoProblems}/36
              </span>
            </div>
          </div>

          {/* Content Columns (Horizontal Layout) */}
          <div className="report-three-col">
            {/* Foto do local */}
            <div className="report-section report-section--photo">
              <h3 className="report-section__title">📷 Local de Trabalho</h3>
              {resposta.foto_url ? (
                <div className="report-photo-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resposta.foto_url} alt="Local de trabalho" className="report-photo" crossOrigin="anonymous" />
                </div>
              ) : (
                <div className="report-photo-empty">
                  <span>🖼️</span>
                  <span>Sem foto</span>
                </div>
              )}
            </div>

            {/* Nordic Summary Table */}
            <div className="report-section report-section--nordic-summary">
              <h3 className="report-section__title">🩺 Questionário Nórdico — Resumo</h3>
              <div className="report-nordic-table">
                <div className="report-nordic-table__header">
                  <span className="report-nordic-table__th report-nordic-table__th--region">Região</span>
                  {NORDIC_QUESTIONS.map((q) => (
                    <span key={q.key} className="report-nordic-table__th">{q.shortLabel}</span>
                  ))}
                </div>
                {NORDIC_REGIONS.map((region) => {
                  const data = resposta.nordico?.[region.key] || {};
                  return (
                    <div key={region.key} className="report-nordic-table__row">
                      <span className="report-nordic-table__td report-nordic-table__td--region">
                        {region.icon} {region.label}
                      </span>
                      {NORDIC_QUESTIONS.map((q) => (
                        <span
                          key={q.key}
                          className={`report-nordic-table__td ${data[q.key] ? 'report-nordic-table__td--yes' : 'report-nordic-table__td--no'}`}
                        >
                          {data[q.key] ? '✓' : '—'}
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Diagrama de Áreas Dolorosas */}
            <div className="report-section">
              <h3 className="report-section__title">🗺️ Diagrama de Áreas Dolorosas — Escala 0 a 7</h3>
              <div className="report-diagram-cols">
                {['esquerdo', 'direito'].map((side) => (
                  <div key={side} className="report-diagram-side">
                    <h4 className="report-diagram-side__title">
                      {side === 'esquerdo' ? '◀ Lado Esquerdo' : 'Lado Direito ▶'}
                    </h4>
                    <div className="report-diagram-bars">
                      {DIAGRAM_REGIONS.map((region) => {
                        const val = resposta.diagrama?.[side]?.[region.key] ?? 0;
                        return (
                          <div key={region.key} className="report-diagram-bar-row">
                            <span className="report-diagram-bar-row__label">{region.label}</span>
                            <div className="report-diagram-bar-row__track">
                              <div
                                className="report-diagram-bar-row__fill"
                                style={{
                                  width: `${(val / 7) * 100}%`,
                                  background: getBarColor(val),
                                }}
                              />
                            </div>
                            <span
                              className="report-diagram-bar-row__val"
                              style={{ color: getBarColor(val) || 'var(--neutral-500)' }}
                            >
                              {val}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="report-footer">
            <span>Questionário de Ergonomia — TCC</span>
            <span>Gerado em {new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
