'use client';

import { useState } from 'react';
import StepIndicator from '@/components/StepIndicator';
import InitialQuestions from '@/components/InitialQuestions';
import NordicQuestionnaire from '@/components/NordicQuestionnaire';
import BodyDiagram from '@/components/BodyDiagram';
import SuccessScreen from '@/components/SuccessScreen';

const NORDIC_REGIONS = [
  'pescoco', 'ombros', 'costa_superior', 'cotovelos', 'punhos_maos',
  'costa_inferior', 'quadril_coxas', 'joelhos', 'tornozelos_pes'
];
const NORDIC_QUESTIONS = ['problema_12m', 'impedido_12m', 'consulta_12m', 'problema_7d'];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [initialData, setInitialData] = useState({
    trabalha_home_office: null,
    regiao_sjdr: null,
  });

  const [nordicoData, setNordicoData] = useState({});

  const [diagramaData, setDiagramaData] = useState({
    esquerdo: {},
    direito: {},
  });

  // Validation
  const isStep1Valid =
    initialData.trabalha_home_office !== null && initialData.regiao_sjdr !== null;

  const isStep2Valid = NORDIC_REGIONS.every((region) =>
    NORDIC_QUESTIONS.every(
      (q) => typeof nordicoData[region]?.[q] === 'boolean'
    )
  );

  const isStep3Valid = true; // Diagram defaults to 0, always valid

  const handleNext = () => {
    setError(null);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    // Fill in default 0 values for diagram regions not explicitly set
    const BODY_REGIONS_KEYS = [
      'pescoco', 'costa_superior', 'costa_media', 'costa_inferior', 'bacia',
      'ombros', 'bracos', 'antebracos', 'punhos', 'maos', 'coxas', 'pernas', 'tornozelos_pes'
    ];

    const filledDiagram = {
      esquerdo: {},
      direito: {},
    };

    for (const key of BODY_REGIONS_KEYS) {
      filledDiagram.esquerdo[key] = diagramaData.esquerdo[key] ?? 0;
      filledDiagram.direito[key] = diagramaData.direito[key] ?? 0;
    }

    const payload = {
      trabalha_home_office: initialData.trabalha_home_office,
      regiao_sjdr: initialData.regiao_sjdr,
      nordico: nordicoData,
      diagrama: filledDiagram,
    };

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Erro ao enviar resposta.');
      }

      setCurrentStep(5); // Success screen
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return isStep1Valid;
      case 2: return isStep2Valid;
      case 3: return isStep3Valid;
      default: return false;
    }
  };

  return (
    <main className="main-container">
      {/* Header */}
      <header className="header">
        <div className="header__badge">
          <span className="header__badge-dot" />
          Pesquisa Acadêmica — TCC
        </div>
        <h1 className="header__title">
          Questionário de Ergonomia e Saúde Ocupacional
        </h1>
        <p className="header__subtitle">
          Avaliação de sintomas osteomusculares em trabalhadores — Questionário Nórdico e Diagrama de Áreas Dolorosas
        </p>
      </header>

      {/* Step Indicator */}
      {currentStep <= 4 && <StepIndicator currentStep={currentStep} />}

      {/* Step Content */}
      {currentStep === 1 && (
        <InitialQuestions data={initialData} onChange={setInitialData} />
      )}

      {currentStep === 2 && (
        <NordicQuestionnaire data={nordicoData} onChange={setNordicoData} />
      )}

      {currentStep === 3 && (
        <BodyDiagram data={diagramaData} onChange={setDiagramaData} />
      )}

      {currentStep === 4 && (
        <div className="glass-card">
          <h2 className="glass-card__title">Confirmar e Enviar</h2>
          <p className="glass-card__description">
            Revise suas respostas antes de enviar. Após o envio, não será possível alterar as respostas.
          </p>

          <div className="question-group">
            <div className="question-card">
              <label className="question-card__label">Resumo das Respostas</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--neutral-300)' }}>
                <p>
                  <strong style={{ color: 'var(--neutral-200)' }}>Home Office:</strong>{' '}
                  {initialData.trabalha_home_office ? 'Sim' : 'Não'}
                </p>
                <p>
                  <strong style={{ color: 'var(--neutral-200)' }}>Região de São João del Rei:</strong>{' '}
                  {initialData.regiao_sjdr ? 'Sim' : 'Não'}
                </p>
                <p>
                  <strong style={{ color: 'var(--neutral-200)' }}>Questionário Nórdico:</strong>{' '}
                  {NORDIC_REGIONS.filter(r => nordicoData[r]).length} de {NORDIC_REGIONS.length} regiões preenchidas
                </p>
                <p>
                  <strong style={{ color: 'var(--neutral-200)' }}>Diagrama de Áreas Dolorosas:</strong>{' '}
                  Preenchido (Lado Esquerdo e Direito)
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button
              type="button"
              className="btn btn--submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Enviando...
                </>
              ) : (
                <>
                  📤 Enviar Respostas
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}
        </div>
      )}

      {currentStep === 5 && <SuccessScreen />}

      {/* Navigation Buttons */}
      {currentStep <= 3 && (
        <div className="nav-buttons">
          {currentStep > 1 ? (
            <button type="button" className="btn btn--secondary" onClick={handleBack}>
              ← Voltar
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Próximo →
          </button>
        </div>
      )}

      {currentStep === 4 && (
        <div className="nav-buttons">
          <button type="button" className="btn btn--secondary" onClick={handleBack}>
            ← Voltar
          </button>
          <div />
        </div>
      )}
    </main>
  );
}
