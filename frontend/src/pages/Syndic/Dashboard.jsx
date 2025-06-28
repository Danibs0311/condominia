// Conteúdo do arquivo Dashboard.jsx em frontend/src/pages/Syndicimport React from 'react';
import Header from '../../components/ui/Header';
import SyndicPanel from '../../components/dashboard/SyndicPanel';

const Dashboard = () => {
  return (
    <div>
      <Header titulo="Painel do Síndico - CondominIA" />
      <SyndicPanel />
    </div>
  );
};

export default Dashboard;
