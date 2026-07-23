'use client';

const BODY_REGIONS = [
  { key: 'pescoco', name: 'Pescoço', num: 1 },
  { key: 'costa_superior', name: 'Costa Superior', num: 2 },
  { key: 'costa_media', name: 'Costa Média', num: 3 },
  { key: 'costa_inferior', name: 'Costa Inferior', num: 4 },
  { key: 'bacia', name: 'Bacia', num: 5 },
  { key: 'ombros', name: 'Ombros', num: 6 },
  { key: 'bracos', name: 'Braços', num: 7 },
  { key: 'antebracos', name: 'Antebraços', num: 8 },
  { key: 'punhos', name: 'Punhos', num: 9 },
  { key: 'maos', name: 'Mãos', num: 10 },
  { key: 'coxas', name: 'Coxas', num: 16 },
  { key: 'pernas', name: 'Pernas', num: 17 },
  { key: 'tornozelos_pes', name: 'Tornozelos e Pés', num: 18 },
];

function getValueClass(value) {
  return `diagram-region-item__value--level-${value}`;
}

function getTrackClass(value) {
  return `slider-track--${value}`;
}

export default function BodyDiagram({ data, onChange }) {
  const handleSliderChange = (side, regionKey, value) => {
    const updated = {
      ...data,
      [side]: {
        ...(data[side] || {}),
        [regionKey]: parseInt(value, 10),
      },
    };
    onChange(updated);
  };

  const renderSide = (side, sideLabel, iconClass) => (
    <div className="diagram-side-section">
      <h3 className="diagram-side-section__title">
        <span className={`diagram-side-section__title-icon ${iconClass}`}>
          {side === 'esquerdo' ? '◀' : '▶'}
        </span>
        Lado {sideLabel}
      </h3>

      <div className="diagram-legend">
        <span>0 (Nenhum)</span>
        <div className="diagram-legend__gradient" />
        <span>7 (Máximo)</span>
      </div>

      <div className="diagram-region-list">
        {BODY_REGIONS.map((region) => {
          const value = data[side]?.[region.key] ?? 0;
          return (
            <div key={region.key} className="diagram-region-item">
              <span className="diagram-region-item__name">
                {region.num}. {region.name}
              </span>
              <div className="diagram-region-item__slider-container">
                <input
                  type="range"
                  min="0"
                  max="7"
                  step="1"
                  value={value}
                  onChange={(e) => handleSliderChange(side, region.key, e.target.value)}
                  className={`diagram-region-item__slider ${getTrackClass(value)}`}
                />
                <span className={`diagram-region-item__value ${getValueClass(value)}`}>
                  {value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="glass-card">
      <h2 className="glass-card__title">Diagrama de Áreas Dolorosas</h2>
      <p className="glass-card__description">
        Para cada região do corpo, selecione o nível de desconforto de 0 (nenhum) a 7 (máximo),
        separando o lado esquerdo e direito. A vista é de costas.
      </p>

      {/* Body SVG - back view */}
      <div className="body-svg-container">
        <svg viewBox="0 0 240 420" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="120" cy="35" r="22" stroke="var(--primary-400)" strokeWidth="1.5" fill="rgba(0,180,205,0.08)"/>
          {/* Neck - region 1 */}
          <rect x="111" y="57" width="18" height="14" rx="4" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.12)"/>
          <text x="120" y="68" textAnchor="middle" fill="var(--primary-200)" fontSize="9" fontWeight="600">1</text>
          
          {/* Upper back - region 2 */}
          <rect x="90" y="75" width="60" height="30" rx="4" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.1)"/>
          <text x="120" y="94" textAnchor="middle" fill="var(--primary-200)" fontSize="9" fontWeight="600">2</text>
          
          {/* Mid back - region 3 */}
          <rect x="85" y="108" width="70" height="28" rx="4" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.08)"/>
          <text x="120" y="126" textAnchor="middle" fill="var(--primary-200)" fontSize="9" fontWeight="600">3</text>
          
          {/* Lower back - region 4 */}
          <rect x="82" y="139" width="76" height="28" rx="4" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.1)"/>
          <text x="120" y="157" textAnchor="middle" fill="var(--primary-200)" fontSize="9" fontWeight="600">4</text>
          
          {/* Hip/Bacia - region 5 */}
          <rect x="78" y="170" width="84" height="24" rx="4" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.08)"/>
          <text x="120" y="186" textAnchor="middle" fill="var(--primary-200)" fontSize="9" fontWeight="600">5</text>

          {/* Left shoulder - region 11/6 */}
          <circle cx="62" cy="85" r="12" stroke="var(--accent-400)" strokeWidth="1.5" fill="rgba(108,71,245,0.1)"/>
          <text x="62" y="89" textAnchor="middle" fill="var(--accent-400)" fontSize="8" fontWeight="600">6</text>
          
          {/* Right shoulder */}
          <circle cx="178" cy="85" r="12" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.1)"/>
          <text x="178" y="89" textAnchor="middle" fill="var(--primary-200)" fontSize="8" fontWeight="600">6</text>

          {/* Left arm - region 12/7 */}
          <rect x="38" y="100" width="16" height="40" rx="6" stroke="var(--accent-400)" strokeWidth="1.5" fill="rgba(108,71,245,0.08)"/>
          <text x="46" y="124" textAnchor="middle" fill="var(--accent-400)" fontSize="8" fontWeight="600">7</text>
          
          {/* Right arm */}
          <rect x="186" y="100" width="16" height="40" rx="6" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.08)"/>
          <text x="194" y="124" textAnchor="middle" fill="var(--primary-200)" fontSize="8" fontWeight="600">7</text>

          {/* Left forearm - region 13/8 */}
          <rect x="32" y="144" width="14" height="38" rx="5" stroke="var(--accent-400)" strokeWidth="1.5" fill="rgba(108,71,245,0.08)"/>
          <text x="39" y="167" textAnchor="middle" fill="var(--accent-400)" fontSize="8" fontWeight="600">8</text>
          
          {/* Right forearm */}
          <rect x="194" y="144" width="14" height="38" rx="5" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.08)"/>
          <text x="201" y="167" textAnchor="middle" fill="var(--primary-200)" fontSize="8" fontWeight="600">8</text>

          {/* Left wrist - region 14/9 */}
          <rect x="29" y="185" width="12" height="12" rx="3" stroke="var(--accent-400)" strokeWidth="1.5" fill="rgba(108,71,245,0.1)"/>
          <text x="35" y="194" textAnchor="middle" fill="var(--accent-400)" fontSize="7" fontWeight="600">9</text>
          
          {/* Right wrist */}
          <rect x="199" y="185" width="12" height="12" rx="3" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.1)"/>
          <text x="205" y="194" textAnchor="middle" fill="var(--primary-200)" fontSize="7" fontWeight="600">9</text>

          {/* Left hand - region 15/10 */}
          <circle cx="35" cy="208" r="8" stroke="var(--accent-400)" strokeWidth="1.5" fill="rgba(108,71,245,0.1)"/>
          <text x="35" y="211" textAnchor="middle" fill="var(--accent-400)" fontSize="7" fontWeight="600">10</text>
          
          {/* Right hand */}
          <circle cx="205" cy="208" r="8" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.1)"/>
          <text x="205" y="211" textAnchor="middle" fill="var(--primary-200)" fontSize="7" fontWeight="600">10</text>

          {/* Left thigh - region 19/16 */}
          <rect x="80" y="198" width="20" height="60" rx="8" stroke="var(--accent-400)" strokeWidth="1.5" fill="rgba(108,71,245,0.06)"/>
          <text x="90" y="232" textAnchor="middle" fill="var(--accent-400)" fontSize="8" fontWeight="600">16</text>
          
          {/* Right thigh */}
          <rect x="140" y="198" width="20" height="60" rx="8" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.06)"/>
          <text x="150" y="232" textAnchor="middle" fill="var(--primary-200)" fontSize="8" fontWeight="600">16</text>

          {/* Left leg - region 20/17 */}
          <rect x="78" y="265" width="18" height="65" rx="7" stroke="var(--accent-400)" strokeWidth="1.5" fill="rgba(108,71,245,0.06)"/>
          <text x="87" y="301" textAnchor="middle" fill="var(--accent-400)" fontSize="8" fontWeight="600">17</text>
          
          {/* Right leg */}
          <rect x="144" y="265" width="18" height="65" rx="7" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.06)"/>
          <text x="153" y="301" textAnchor="middle" fill="var(--primary-200)" fontSize="8" fontWeight="600">17</text>

          {/* Left ankle/foot - region 21/18 */}
          <rect x="74" y="335" width="22" height="20" rx="5" stroke="var(--accent-400)" strokeWidth="1.5" fill="rgba(108,71,245,0.08)"/>
          <text x="85" y="349" textAnchor="middle" fill="var(--accent-400)" fontSize="7" fontWeight="600">18</text>
          
          {/* Right ankle/foot */}
          <rect x="144" y="335" width="22" height="20" rx="5" stroke="var(--primary-300)" strokeWidth="1.5" fill="rgba(0,180,205,0.08)"/>
          <text x="155" y="349" textAnchor="middle" fill="var(--primary-200)" fontSize="7" fontWeight="600">18</text>

          {/* Side labels */}
          <text x="35" y="30" textAnchor="middle" fill="var(--accent-400)" fontSize="10" fontWeight="600">ESQ</text>
          <text x="205" y="30" textAnchor="middle" fill="var(--primary-300)" fontSize="10" fontWeight="600">DIR</text>
        </svg>
      </div>

      <div className="diagram-container">
        {renderSide('esquerdo', 'Esquerdo', 'diagram-side-section__title-icon--left')}
        {renderSide('direito', 'Direito', 'diagram-side-section__title-icon--right')}
      </div>
    </div>
  );
}
