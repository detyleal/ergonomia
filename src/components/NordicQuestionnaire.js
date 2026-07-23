'use client';

const REGIONS = [
  { key: 'pescoco', name: 'Pescoço', icon: '🔵' },
  { key: 'ombros', name: 'Ombros', icon: '🔵' },
  { key: 'costa_superior', name: 'Parte Superior das Costas', icon: '🔵' },
  { key: 'cotovelos', name: 'Cotovelos', icon: '🔵' },
  { key: 'punhos_maos', name: 'Punhos/Mãos', icon: '🔵' },
  { key: 'costa_inferior', name: 'Parte Inferior das Costas', icon: '🔵' },
  { key: 'quadril_coxas', name: 'Quadril/Coxas', icon: '🔵' },
  { key: 'joelhos', name: 'Joelhos', icon: '🔵' },
  { key: 'tornozelos_pes', name: 'Tornozelos/Pés', icon: '🔵' },
];

const QUESTIONS = [
  {
    key: 'problema_12m',
    text: 'Nos últimos 12 meses, você teve problemas (dor, formigamento, dormência)?',
  },
  {
    key: 'impedido_12m',
    text: 'Nos últimos 12 meses, foi impedido(a) de realizar atividades normais por causa desse problema?',
  },
  {
    key: 'consulta_12m',
    text: 'Nos últimos 12 meses, consultou algum profissional da área da saúde?',
  },
  {
    key: 'problema_7d',
    text: 'Nos últimos 7 dias, você teve algum problema?',
  },
];

function getRegionStatus(regionData) {
  if (!regionData) return { done: false, label: 'Pendente' };
  const answered = Object.keys(regionData).length;
  if (answered >= QUESTIONS.length) return { done: true, label: 'Completo' };
  if (answered > 0) return { done: false, label: `${answered}/${QUESTIONS.length}` };
  return { done: false, label: 'Pendente' };
}

export default function NordicQuestionnaire({ data, onChange }) {
  const handleAnswer = (regionKey, questionKey, value) => {
    const updated = {
      ...data,
      [regionKey]: {
        ...(data[regionKey] || {}),
        [questionKey]: value,
      },
    };
    onChange(updated);
  };

  return (
    <div className="glass-card">
      <h2 className="glass-card__title">Questionário Nórdico de Sintomas Osteomusculares</h2>
      <p className="glass-card__description">
        Para cada região do corpo, responda as perguntas sobre sintomas que você pode ter sentido.
        Clique em &quot;Sim&quot; ou &quot;Não&quot; para cada pergunta.
      </p>

      {/* Body illustration SVG */}
      <div className="body-svg-container">
        <svg viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="100" cy="35" r="22" stroke="var(--primary-400)" strokeWidth="1.5" fill="rgba(0,180,205,0.08)"/>
          {/* Neck */}
          <rect x="93" y="57" width="14" height="16" rx="4" stroke="var(--primary-400)" strokeWidth="1.5" fill="rgba(0,180,205,0.08)"/>
          {/* Torso */}
          <path d="M70 73 L130 73 L135 170 L65 170 Z" stroke="var(--primary-400)" strokeWidth="1.5" fill="rgba(0,180,205,0.06)" rx="5"/>
          {/* Shoulders - left */}
          <path d="M70 73 L45 85" stroke="var(--primary-400)" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Shoulders - right */}
          <path d="M130 73 L155 85" stroke="var(--primary-400)" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Left arm */}
          <path d="M45 85 L35 140 L30 185" stroke="var(--primary-400)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          {/* Right arm */}
          <path d="M155 85 L165 140 L170 185" stroke="var(--primary-400)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          {/* Left hand */}
          <circle cx="28" cy="190" r="6" stroke="var(--primary-400)" strokeWidth="1.5" fill="rgba(0,180,205,0.08)"/>
          {/* Right hand */}
          <circle cx="172" cy="190" r="6" stroke="var(--primary-400)" strokeWidth="1.5" fill="rgba(0,180,205,0.08)"/>
          {/* Hip */}
          <path d="M65 170 L60 195 L140 195 L135 170" stroke="var(--primary-400)" strokeWidth="1.5" fill="rgba(0,180,205,0.04)"/>
          {/* Left leg */}
          <path d="M75 195 L70 280 L68 340" stroke="var(--primary-400)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          {/* Right leg */}
          <path d="M125 195 L130 280 L132 340" stroke="var(--primary-400)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          {/* Left foot */}
          <path d="M68 340 L55 345 L55 350 L75 350 L75 345 Z" stroke="var(--primary-400)" strokeWidth="1.5" fill="rgba(0,180,205,0.08)"/>
          {/* Right foot */}
          <path d="M132 340 L125 345 L125 350 L145 350 L145 345 Z" stroke="var(--primary-400)" strokeWidth="1.5" fill="rgba(0,180,205,0.08)"/>
          {/* Region markers with labels */}
          {/* Neck */}
          <circle cx="100" cy="65" r="3" fill="var(--primary-300)" opacity="0.8"/>
          {/* Upper back */}
          <circle cx="100" cy="95" r="3" fill="var(--primary-300)" opacity="0.8"/>
          {/* Lower back */}
          <circle cx="100" cy="150" r="3" fill="var(--primary-300)" opacity="0.8"/>
          {/* Shoulders */}
          <circle cx="50" cy="82" r="3" fill="var(--primary-300)" opacity="0.8"/>
          <circle cx="150" cy="82" r="3" fill="var(--primary-300)" opacity="0.8"/>
          {/* Elbows */}
          <circle cx="37" cy="135" r="3" fill="var(--primary-300)" opacity="0.8"/>
          <circle cx="163" cy="135" r="3" fill="var(--primary-300)" opacity="0.8"/>
          {/* Knees */}
          <circle cx="72" cy="280" r="3" fill="var(--primary-300)" opacity="0.8"/>
          <circle cx="128" cy="280" r="3" fill="var(--primary-300)" opacity="0.8"/>
        </svg>
      </div>

      <div className="nordic-section">
        {REGIONS.map((region) => {
          const status = getRegionStatus(data[region.key]);
          return (
            <div key={region.key} className="nordic-region">
              <div className="nordic-region__header">
                <div className="nordic-region__icon">{region.icon}</div>
                <span className="nordic-region__name">{region.name}</span>
                <span
                  className={`nordic-region__status ${
                    status.done ? 'nordic-region__status--done' : ''
                  }`}
                >
                  {status.label}
                </span>
              </div>
              <div className="nordic-region__questions">
                {QUESTIONS.map((q) => {
                  const currentValue = data[region.key]?.[q.key];
                  return (
                    <div key={q.key} className="nordic-question">
                      <span className="nordic-question__text">{q.text}</span>
                      <div className="nordic-question__options">
                        <button
                          type="button"
                          className={`nordic-btn ${currentValue === true ? 'nordic-btn--yes' : ''}`}
                          onClick={() => handleAnswer(region.key, q.key, true)}
                        >
                          Sim
                        </button>
                        <button
                          type="button"
                          className={`nordic-btn ${currentValue === false ? 'nordic-btn--no' : ''}`}
                          onClick={() => handleAnswer(region.key, q.key, false)}
                        >
                          Não
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
