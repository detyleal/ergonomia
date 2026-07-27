'use client';

import { useState, useEffect, useMemo } from 'react';
import AdminLogin from '@/components/AdminLogin';
import ReportModal from '@/components/ReportModal';

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
  { key: 'problema_12m', label: 'Problema (12 meses)' },
  { key: 'impedido_12m', label: 'Impedido (12 meses)' },
  { key: 'consulta_12m', label: 'Consulta (12 meses)' },
  { key: 'problema_7d', label: 'Problema (7 dias)' },
];

const DIAGRAM_REGIONS = [
  { key: 'pescoco', label: 'Pescoço' },
  { key: 'costa_superior', label: 'Costa Superior' },
  { key: 'costa_media', label: 'Costa Média' },
  { key: 'costa_inferior', label: 'Costa Inferior' },
  { key: 'bacia', label: 'Bacia' },
  { key: 'ombros', label: 'Ombros' },
  { key: 'bracos', label: 'Braços' },
  { key: 'antebracos', label: 'Antebraços' },
  { key: 'punhos', label: 'Punhos' },
  { key: 'maos', label: 'Mãos' },
  { key: 'coxas', label: 'Coxas' },
  { key: 'pernas', label: 'Pernas' },
  { key: 'tornozelos_pes', label: 'Tornozelos/Pés' },
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

// ===== CHART COMPONENTS (Pure CSS/SVG) =====

function BarChart({ data, maxValue, colorStart, colorEnd, label }) {
  const safeMax = maxValue || 1;
  return (
    <div className="admin-chart">
      <div className="admin-chart__label">{label}</div>
      <div className="admin-chart__bars">
        {data.map((item, i) => {
          const pct = Math.round((item.value / safeMax) * 100);
          const color = `linear-gradient(135deg, ${colorStart}, ${colorEnd})`;
          return (
            <div key={item.label} className="admin-chart__bar-row">
              <span className="admin-chart__bar-label" title={item.label}>{item.label}</span>
              <div className="admin-chart__bar-track">
                <div
                  className="admin-chart__bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: color,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              </div>
              <span className="admin-chart__bar-value">
                {typeof item.value === 'number' && !Number.isInteger(item.value)
                  ? item.value.toFixed(1)
                  : item.value}
                {item.suffix || ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DonutChart({ segments, total, centerLabel }) {
  const size = 160;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div className="admin-donut">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {segments.map((seg, i) => {
          const pct = total > 0 ? seg.value / total : 0;
          const dashLength = pct * circumference;
          const dashGap = circumference - dashLength;
          const offset = -cumulativeOffset * circumference + circumference * 0.25;
          cumulativeOffset += pct;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${dashGap}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="admin-donut__segment"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          );
        })}
        <text
          x={size / 2}
          y={size / 2 - 6}
          textAnchor="middle"
          fill="var(--neutral-100)"
          fontSize="28"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {total}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 14}
          textAnchor="middle"
          fill="var(--neutral-400)"
          fontSize="11"
          fontFamily="Inter, sans-serif"
        >
          {centerLabel}
        </text>
      </svg>
      <div className="admin-donut__legend">
        {segments.map((seg, i) => (
          <div key={i} className="admin-donut__legend-item">
            <span
              className="admin-donut__legend-dot"
              style={{ background: seg.color }}
            />
            <span className="admin-donut__legend-label">{seg.label}</span>
            <span className="admin-donut__legend-value">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== MAIN DASHBOARD =====

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [respostas, setRespostas] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedRow, setExpandedRow] = useState(null);
  const [photoModal, setPhotoModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportResposta, setReportResposta] = useState(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (!authenticated) return;
    fetchData();
  }, [authenticated]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/respostas');
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setRespostas(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== COMPUTED STATS =====
  const stats = useMemo(() => {
    if (!respostas.length) return null;

    const total = respostas.length;
    const homeOffice = respostas.filter((r) => r.trabalha_home_office).length;
    const presencial = total - homeOffice;
    const sjdr = respostas.filter((r) => r.regiao_sjdr).length;
    const comFoto = respostas.filter((r) => r.foto_url).length;

    // Nordic prevalence: percentage of people reporting problems in each region (12m)
    const nordicPrevalence = NORDIC_REGIONS.map((region) => {
      const count = respostas.filter(
        (r) => r.nordico?.[region.key]?.problema_12m === true
      ).length;
      return {
        label: region.label,
        value: Math.round((count / total) * 100),
        suffix: '%',
      };
    });

    // Nordic: 12m vs 7d comparison
    const nordic12vs7 = NORDIC_REGIONS.map((region) => {
      const count12m = respostas.filter(
        (r) => r.nordico?.[region.key]?.problema_12m === true
      ).length;
      const count7d = respostas.filter(
        (r) => r.nordico?.[region.key]?.problema_7d === true
      ).length;
      return {
        label: region.label,
        value12m: Math.round((count12m / total) * 100),
        value7d: Math.round((count7d / total) * 100),
      };
    });

    // Diagram: average pain intensity per region (combining left + right)
    const diagramAvg = DIAGRAM_REGIONS.map((region) => {
      let sum = 0;
      let count = 0;
      respostas.forEach((r) => {
        if (r.diagrama) {
          const left = r.diagrama.esquerdo?.[region.key] ?? 0;
          const right = r.diagrama.direito?.[region.key] ?? 0;
          sum += (left + right) / 2;
          count++;
        }
      });
      return {
        label: region.label,
        value: count > 0 ? sum / count : 0,
      };
    });

    // Photos
    const photos = respostas
      .filter((r) => r.foto_url)
      .map((r) => ({
        url: r.foto_url,
        date: r.created_at,
        id: r.id,
      }));

    return {
      total,
      homeOffice,
      presencial,
      sjdr,
      naoSjdr: total - sjdr,
      comFoto,
      nordicPrevalence,
      nordic12vs7,
      diagramAvg,
      photos,
    };
  }, [respostas]);

  // ===== PAGINATION =====
  const totalPages = Math.ceil(respostas.length / ITEMS_PER_PAGE);
  const paginatedRespostas = respostas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ===== LOGIN GATE =====
  if (!authenticated) {
    return <AdminLogin onAuthenticated={setAuthenticated} />;
  }

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner" />
        <p>Carregando dados...</p>
      </div>
    );
  }

  // ===== ERROR =====
  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-error">
          <span className="admin-error__icon">⚠️</span>
          <h2>Erro ao carregar dados</h2>
          <p>{error}</p>
          <button className="btn btn--primary" onClick={fetchData}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header__left">
          <div className="admin-header__badge">
            <span className="admin-header__badge-dot" />
            Painel Admin
          </div>
          <h1 className="admin-header__title">Dashboard de Respostas</h1>
          <p className="admin-header__subtitle">
            Visualize e analise todas as respostas do questionário de ergonomia
          </p>
        </div>
        <div className="admin-header__actions">
          <button className="admin-btn-icon" onClick={fetchData} title="Atualizar dados">
            🔄
          </button>
          <a href="/" className="admin-btn-icon" title="Voltar ao formulário">
            📋
          </a>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-tabs">
        {[
          { id: 'overview', label: 'Visão Geral', icon: '📊' },
          { id: 'responses', label: 'Respostas', icon: '📋' },
          { id: 'photos', label: 'Fotos', icon: '📷' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="admin-tab__icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ==================== OVERVIEW TAB ==================== */}
      {activeTab === 'overview' && stats && (
        <div className="admin-content">
          {/* Summary Cards */}
          <div className="admin-stat-cards">
            <div className="admin-stat-card admin-stat-card--primary">
              <div className="admin-stat-card__icon">📝</div>
              <div className="admin-stat-card__info">
                <span className="admin-stat-card__value">{stats.total}</span>
                <span className="admin-stat-card__label">Total de Respostas</span>
              </div>
            </div>
            <div className="admin-stat-card admin-stat-card--accent">
              <div className="admin-stat-card__icon">🏠</div>
              <div className="admin-stat-card__info">
                <span className="admin-stat-card__value">
                  {stats.total > 0
                    ? Math.round((stats.homeOffice / stats.total) * 100)
                    : 0}%
                </span>
                <span className="admin-stat-card__label">Home Office</span>
              </div>
            </div>
            <div className="admin-stat-card admin-stat-card--teal">
              <div className="admin-stat-card__icon">📍</div>
              <div className="admin-stat-card__info">
                <span className="admin-stat-card__value">
                  {stats.total > 0
                    ? Math.round((stats.sjdr / stats.total) * 100)
                    : 0}%
                </span>
                <span className="admin-stat-card__label">Região SJDR</span>
              </div>
            </div>
            <div className="admin-stat-card admin-stat-card--success">
              <div className="admin-stat-card__icon">📸</div>
              <div className="admin-stat-card__info">
                <span className="admin-stat-card__value">{stats.comFoto}</span>
                <span className="admin-stat-card__label">Com Foto</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="admin-charts-grid">
            {/* Donut: Home Office vs Presencial */}
            <div className="admin-card">
              <h3 className="admin-card__title">
                <span className="admin-card__title-icon">🏠</span>
                Home Office vs Presencial
              </h3>
              <DonutChart
                segments={[
                  { label: 'Home Office', value: stats.homeOffice, color: '#6c47f5' },
                  { label: 'Presencial', value: stats.presencial, color: '#00b4cd' },
                ]}
                total={stats.total}
                centerLabel="respostas"
              />
            </div>

            {/* Donut: SJDR */}
            <div className="admin-card">
              <h3 className="admin-card__title">
                <span className="admin-card__title-icon">📍</span>
                Região São João del Rei
              </h3>
              <DonutChart
                segments={[
                  { label: 'SJDR', value: stats.sjdr, color: '#22c55e' },
                  { label: 'Outra região', value: stats.naoSjdr, color: '#64748b' },
                ]}
                total={stats.total}
                centerLabel="respostas"
              />
            </div>
          </div>

          {/* Nordic Prevalence */}
          <div className="admin-card admin-card--full">
            <h3 className="admin-card__title">
              <span className="admin-card__title-icon">🩺</span>
              Prevalência de Sintomas — Questionário Nórdico (12 meses)
            </h3>
            <BarChart
              data={stats.nordicPrevalence}
              maxValue={100}
              colorStart="#6c47f5"
              colorEnd="#00b4cd"
              label="% de participantes com problemas"
            />
          </div>

          {/* Nordic 12m vs 7d */}
          <div className="admin-card admin-card--full">
            <h3 className="admin-card__title">
              <span className="admin-card__title-icon">📈</span>
              Comparação: Problemas 12 Meses vs 7 Dias
            </h3>
            <div className="admin-chart">
              <div className="admin-chart__dual-legend">
                <span className="admin-chart__legend-item">
                  <span className="admin-chart__legend-dot" style={{ background: '#6c47f5' }} />
                  12 meses
                </span>
                <span className="admin-chart__legend-item">
                  <span className="admin-chart__legend-dot" style={{ background: '#22c55e' }} />
                  7 dias
                </span>
              </div>
              <div className="admin-chart__bars">
                {stats.nordic12vs7.map((item, i) => (
                  <div key={item.label} className="admin-chart__bar-row admin-chart__bar-row--dual">
                    <span className="admin-chart__bar-label" title={item.label}>{item.label}</span>
                    <div className="admin-chart__bar-dual">
                      <div className="admin-chart__bar-track">
                        <div
                          className="admin-chart__bar-fill"
                          style={{
                            width: `${item.value12m}%`,
                            background: 'linear-gradient(135deg, #6c47f5, #8b6cf7)',
                            animationDelay: `${i * 80}ms`,
                          }}
                        />
                      </div>
                      <span className="admin-chart__bar-value">{item.value12m}%</span>
                    </div>
                    <div className="admin-chart__bar-dual">
                      <div className="admin-chart__bar-track">
                        <div
                          className="admin-chart__bar-fill"
                          style={{
                            width: `${item.value7d}%`,
                            background: 'linear-gradient(135deg, #22c55e, #4ade80)',
                            animationDelay: `${i * 80 + 40}ms`,
                          }}
                        />
                      </div>
                      <span className="admin-chart__bar-value">{item.value7d}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Diagram Average */}
          <div className="admin-card admin-card--full">
            <h3 className="admin-card__title">
              <span className="admin-card__title-icon">🗺️</span>
              Intensidade Média de Dor — Diagrama de Áreas Dolorosas
            </h3>
            <BarChart
              data={stats.diagramAvg}
              maxValue={7}
              colorStart="#fb923c"
              colorEnd="#ef4444"
              label="Intensidade média (0-7)"
            />
          </div>
        </div>
      )}

      {/* ==================== RESPONSES TAB ==================== */}
      {activeTab === 'responses' && (
        <div className="admin-content">
          <div className="admin-card admin-card--full">
            <div className="admin-card__header">
              <h3 className="admin-card__title">
                <span className="admin-card__title-icon">📋</span>
                Respostas Individuais ({respostas.length})
              </h3>
            </div>

            {respostas.length === 0 ? (
              <div className="admin-empty">
                <span className="admin-empty__icon">📭</span>
                <p>Nenhuma resposta registrada ainda.</p>
              </div>
            ) : (
              <>
                <div className="admin-table">
                  {/* Table Header */}
                  <div className="admin-table__header">
                    <span className="admin-table__th admin-table__th--id">#</span>
                    <span className="admin-table__th admin-table__th--date">Data</span>
                    <span className="admin-table__th">Home Office</span>
                    <span className="admin-table__th">SJDR</span>
                    <span className="admin-table__th">Foto</span>
                    <span className="admin-table__th">Relatório</span>
                    <span className="admin-table__th admin-table__th--action"></span>
                  </div>

                  {/* Table Rows */}
                  {paginatedRespostas.map((r, idx) => {
                    const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    const isExpanded = expandedRow === r.id;

                    return (
                      <div key={r.id}>
                        <div
                          className={`admin-table__row ${isExpanded ? 'admin-table__row--expanded' : ''}`}
                          onClick={() => setExpandedRow(isExpanded ? null : r.id)}
                        >
                          <span className="admin-table__td admin-table__td--id">
                            {globalIdx}
                          </span>
                          <span className="admin-table__td admin-table__td--date">
                            {formatDate(r.created_at)}
                          </span>
                          <span className="admin-table__td">
                            <span className={`admin-badge ${r.trabalha_home_office ? 'admin-badge--yes' : 'admin-badge--no'}`}>
                              {r.trabalha_home_office ? 'Sim' : 'Não'}
                            </span>
                          </span>
                          <span className="admin-table__td">
                            <span className={`admin-badge ${r.regiao_sjdr ? 'admin-badge--yes' : 'admin-badge--no'}`}>
                              {r.regiao_sjdr ? 'Sim' : 'Não'}
                            </span>
                          </span>
                          <span className="admin-table__td">
                            {r.foto_url ? '📸' : '—'}
                          </span>
                          <span className="admin-table__td">
                            <button
                              className="admin-btn-report"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReportResposta(r);
                              }}
                              title="Exportar relatório"
                            >
                              📄
                            </button>
                          </span>
                          <span className="admin-table__td admin-table__td--action">
                            <span className={`admin-table__chevron ${isExpanded ? 'admin-table__chevron--open' : ''}`}>
                              ▾
                            </span>
                          </span>
                        </div>

                        {/* Expanded Detail */}
                        {isExpanded && (
                          <div className="admin-table__detail">
                            {/* Photo */}
                            {r.foto_url && (
                              <div className="admin-detail__photo-section">
                                <h4 className="admin-detail__section-title">📷 Foto do Local</h4>
                                <img
                                  src={r.foto_url}
                                  alt="Local de trabalho"
                                  className="admin-detail__photo"
                                  onClick={() => setPhotoModal(r.foto_url)}
                                />
                              </div>
                            )}

                            {/* Nordic */}
                            <div className="admin-detail__section">
                              <h4 className="admin-detail__section-title">🩺 Questionário Nórdico</h4>
                              <div className="admin-detail__nordic-grid">
                                {NORDIC_REGIONS.map((region) => {
                                  const regionData = r.nordico?.[region.key];
                                  if (!regionData) return null;
                                  const hasAnyProblem = Object.values(regionData).some((v) => v === true);

                                  return (
                                    <div
                                      key={region.key}
                                      className={`admin-detail__nordic-card ${hasAnyProblem ? 'admin-detail__nordic-card--alert' : ''}`}
                                    >
                                      <div className="admin-detail__nordic-header">
                                        <span>{region.icon}</span>
                                        <span>{region.label}</span>
                                      </div>
                                      <div className="admin-detail__nordic-answers">
                                        {NORDIC_QUESTIONS.map((q) => (
                                          <div key={q.key} className="admin-detail__nordic-answer">
                                            <span className="admin-detail__nordic-q">{q.label}</span>
                                            <span className={`admin-detail__nordic-v ${regionData[q.key] ? 'admin-detail__nordic-v--yes' : ''}`}>
                                              {regionData[q.key] ? 'Sim' : 'Não'}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Diagram */}
                            <div className="admin-detail__section">
                              <h4 className="admin-detail__section-title">🗺️ Diagrama de Áreas Dolorosas</h4>
                              <div className="admin-detail__diagram-sides">
                                {['esquerdo', 'direito'].map((side) => (
                                  <div key={side} className="admin-detail__diagram-side">
                                    <h5 className="admin-detail__diagram-side-title">
                                      {side === 'esquerdo' ? '◀ Lado Esquerdo' : 'Lado Direito ▶'}
                                    </h5>
                                    <div className="admin-detail__diagram-list">
                                      {DIAGRAM_REGIONS.map((region) => {
                                        const val = r.diagrama?.[side]?.[region.key] ?? 0;
                                        return (
                                          <div key={region.key} className="admin-detail__diagram-item">
                                            <span className="admin-detail__diagram-region">{region.label}</span>
                                            <div className="admin-detail__diagram-bar-track">
                                              <div
                                                className="admin-detail__diagram-bar-fill"
                                                style={{
                                                  width: `${(val / 7) * 100}%`,
                                                  background: val === 0
                                                    ? 'transparent'
                                                    : val <= 2
                                                    ? '#4ade80'
                                                    : val <= 4
                                                    ? '#fbbf24'
                                                    : '#ef4444',
                                                }}
                                              />
                                            </div>
                                            <span className={`admin-detail__diagram-val diagram-region-item__value--level-${val}`}>
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
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="admin-pagination">
                    <button
                      className="admin-pagination__btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      ← Anterior
                    </button>
                    <div className="admin-pagination__pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`admin-pagination__page ${currentPage === page ? 'admin-pagination__page--active' : ''}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      className="admin-pagination__btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Próximo →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ==================== PHOTOS TAB ==================== */}
      {activeTab === 'photos' && (
        <div className="admin-content">
          <div className="admin-card admin-card--full">
            <h3 className="admin-card__title">
              <span className="admin-card__title-icon">📷</span>
              Galeria de Fotos ({stats?.photos?.length || 0})
            </h3>

            {(!stats?.photos || stats.photos.length === 0) ? (
              <div className="admin-empty">
                <span className="admin-empty__icon">🖼️</span>
                <p>Nenhuma foto enviada ainda.</p>
              </div>
            ) : (
              <div className="admin-gallery">
                {stats.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="admin-gallery__item"
                    onClick={() => setPhotoModal(photo.url)}
                  >
                    <img
                      src={photo.url}
                      alt="Local de trabalho"
                      className="admin-gallery__img"
                      loading="lazy"
                    />
                    <div className="admin-gallery__overlay">
                      <span className="admin-gallery__date">{formatDate(photo.date)}</span>
                      <span className="admin-gallery__zoom">🔍</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== PHOTO MODAL ==================== */}
      {photoModal && (
        <div className="admin-modal" onClick={() => setPhotoModal(null)}>
          <div className="admin-modal__content" onClick={(e) => e.stopPropagation()}>
            <button
              className="admin-modal__close"
              onClick={() => setPhotoModal(null)}
            >
              ✕
            </button>
            <img
              src={photoModal}
              alt="Foto em tamanho completo"
              className="admin-modal__img"
            />
          </div>
        </div>
      )}

      {/* Empty state for overview when no data */}
      {activeTab === 'overview' && (!stats || respostas.length === 0) && (
        <div className="admin-content">
          <div className="admin-empty admin-empty--large">
            <span className="admin-empty__icon">📭</span>
            <h3>Nenhuma resposta ainda</h3>
            <p>As respostas aparecerão aqui assim que os participantes preencherem o formulário.</p>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportResposta && (
        <ReportModal
          resposta={reportResposta}
          onClose={() => setReportResposta(null)}
        />
      )}
    </div>
  );
}
