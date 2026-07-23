'use client';

export default function SuccessScreen() {
  return (
    <div className="glass-card">
      <div className="success-screen">
        <div className="success-screen__icon-wrapper">
          <span className="success-screen__icon">✓</span>
        </div>
        <h2 className="success-screen__title">Resposta Enviada!</h2>
        <p className="success-screen__message">
          Obrigado por participar desta pesquisa! Suas respostas foram registradas com sucesso
          e contribuirão para o estudo sobre ergonomia e saúde ocupacional.
        </p>
      </div>
    </div>
  );
}
