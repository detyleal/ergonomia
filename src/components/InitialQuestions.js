'use client';

export default function InitialQuestions({ data, onChange }) {
  const handleSelect = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="glass-card">
      <h2 className="glass-card__title">Dados Iniciais</h2>
      <p className="glass-card__description">
        Responda as perguntas abaixo para começar o questionário de pesquisa.
      </p>

      <div className="question-group">
        {/* Pergunta 1: Home Office */}
        <div className="question-card">
          <label className="question-card__label">
            Você trabalha em home office?
          </label>
          <div className="question-card__options">
            <button
              type="button"
              className={`option-btn ${
                data.trabalha_home_office === true ? 'option-btn--selected' : ''
              }`}
              onClick={() => handleSelect('trabalha_home_office', true)}
            >
              <span className="option-btn__icon">✓</span>
              Sim
            </button>
            <button
              type="button"
              className={`option-btn ${
                data.trabalha_home_office === false ? 'option-btn--selected-no' : ''
              }`}
              onClick={() => handleSelect('trabalha_home_office', false)}
            >
              <span className="option-btn__icon">✕</span>
              Não
            </button>
          </div>
        </div>

        {/* Pergunta 2: Região SJDR */}
        <div className="question-card">
          <label className="question-card__label">
            Você é da região de São João del Rei?
          </label>
          <div className="question-card__options">
            <button
              type="button"
              className={`option-btn ${
                data.regiao_sjdr === true ? 'option-btn--selected' : ''
              }`}
              onClick={() => handleSelect('regiao_sjdr', true)}
            >
              <span className="option-btn__icon">✓</span>
              Sim
            </button>
            <button
              type="button"
              className={`option-btn ${
                data.regiao_sjdr === false ? 'option-btn--selected-no' : ''
              }`}
              onClick={() => handleSelect('regiao_sjdr', false)}
            >
              <span className="option-btn__icon">✕</span>
              Não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
