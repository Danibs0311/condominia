// Conteúdo do arquivo SyndicPanel.jsx em frontend/src/components/dashboardimport React from 'react';

const SyndicPanel = () => {
  return (
    <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto mt-10">
      <div className="bg-white text-blue-900 p-6 rounded shadow hover:scale-105 transition cursor-pointer">
        <h2 className="font-bold text-center">🏢 Cadastro de Unidades</h2>
      </div>
      <div className="bg-white text-blue-900 p-6 rounded shadow hover:scale-105 transition cursor-pointer">
        <h2 className="font-bold text-center">📢 Avisos</h2>
      </div>
      <div className="bg-white text-blue-900 p-6 rounded shadow hover:scale-105 transition cursor-pointer">
        <h2 className="font-bold text-center">📎 Faturas</h2>
      </div>
      <div className="bg-white text-blue-900 p-6 rounded shadow hover:scale-105 transition cursor-pointer">
        <h2 className="font-bold text-center">👤 Moradores</h2>
      </div>
    </div>
  );
};

export default SyndicPanel;
