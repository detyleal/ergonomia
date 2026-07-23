import './globals.css';

export const metadata = {
  title: 'Questionário de Ergonomia — TCC',
  description: 'Formulário de pesquisa sobre sintomas osteomusculares em trabalhadores home office da região de São João del Rei. Questionário Nórdico e Diagrama de Áreas Dolorosas.',
  keywords: 'ergonomia, questionário nórdico, sintomas osteomusculares, home office, TCC, São João del Rei',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
