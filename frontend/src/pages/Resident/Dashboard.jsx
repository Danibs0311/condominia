// Conteúdo do arquivo Dashboard.jsx em frontend/src/pages/Residentimport React from 'react';
import Header from '../../components/ui/Header';
import ResidentPanel from '../../components/dashboard/ResidentPanel';

const Dashboard = () => {
  return (
    <div>
      <Header titulo="Painel do Morador - CondominIA" />
      <ResidentPanel />
    </div>
  );
};

export default Dashboard;
