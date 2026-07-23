'use client';

const STEPS = [
  { number: 1, label: 'Dados Iniciais' },
  { number: 2, label: 'Questionário Nórdico' },
  { number: 3, label: 'Diagrama Corporal' },
  { number: 4, label: 'Enviar' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="step-indicator">
      {STEPS.map((step, index) => (
        <div key={step.number} className="step-indicator__item">
          <div className="step-indicator__step-wrapper">
            <div
              className={`step-indicator__circle ${
                currentStep === step.number
                  ? 'step-indicator__circle--active'
                  : currentStep > step.number
                  ? 'step-indicator__circle--completed'
                  : ''
              }`}
            >
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <span
              className={`step-indicator__label ${
                currentStep === step.number ? 'step-indicator__label--active' : ''
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`step-indicator__line ${
                currentStep > step.number ? 'step-indicator__line--active' : ''
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
