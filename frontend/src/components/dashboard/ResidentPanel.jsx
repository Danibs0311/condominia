// Conteúdo do arquivo ResidentPanel.jsx em frontend/src/components/dashboardimport React from 'react';

const ResidentPanel = () => {
  return (
    <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto mt-10">
      <div className="bg-white text-blue-900 p-6 rounded shadow hover:scale-105 transition cursor-pointer">
        <h2 className="font-bold text-center">📢 Informativos</h2>
      </div>
      <div className="bg-white text-blue-900 p-6 rounded shadow hover:scale-105 transition cursor-pointer">
        <h2 className="font-bold text-center">💳 Pagamentos</h2>
      </div>
    </div>
  );
};

export default ResidentPanel;
