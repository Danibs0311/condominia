// Conteúdo do arquivo Dashboard.jsx em frontend/src/pages/Adminimport React from 'react';
import Header from '../../components/ui/Header';
import AdminPanel from '../../components/dashboard/AdminPanel';

const Dashboard = () => {
  return (
    <div>
      <Header titulo="Painel Master - CondominIA" />
      <AdminPanel />
    </div>
  );
};

export default Dashboard;
