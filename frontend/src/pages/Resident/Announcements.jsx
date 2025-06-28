// Conteúdo do arquivo Announcements.jsx em frontend/src/pages/Residentimport React from 'react';
import Header from '../../components/ui/Header';

const Announcements = () => {
  const informativos = [
    { titulo: 'Reunião Extraordinária', mensagem: 'Reunião dia 05/07 às 19h no salão de festas.' },
    { titulo: 'Limpeza da caixa d’água', mensagem: 'Dia 10/07 – Não haverá abastecimento de água das 8h às 14h.' }
  ];

  return (
    <div>
      <Header titulo="Informativos" />
      <div className="p-6 text-white max-w-3xl mx-auto">
        {informativos.map((info, index) => (
          <div key={index} className="bg-white text-blue-900 p-4 rounded shadow mb-4">
            <h3 className="font-bold text-lg">{info.titulo}</h3>
            <p>{info.mensagem}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
