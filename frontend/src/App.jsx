// Conteúdo do arquivo App.jsx em frontend/srcimport React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminCondominiums from './pages/Admin/Condominiums';
import AdminReports from './pages/Admin/Reports';
import SyndicDashboard from './pages/Syndic/Dashboard';
import Residents from './pages/Syndic/Residents';
import AnnouncementsSyndic from './pages/Syndic/Announcements';
import Invoices from './pages/Syndic/Invoices';
import ResidentDashboard from './pages/Resident/Dashboard';
import AnnouncementsResident from './pages/Resident/Announcements';
import Payments from './pages/Resident/Payments';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/condominios" element={<AdminCondominiums />} />
        <Route path="/admin/relatorios" element={<AdminReports />} />
        {/* Síndico */}
        <Route path="/sindico" element={<SyndicDashboard />} />
        <Route path="/sindico/unidades" element={<Residents />} />
        <Route path="/sindico/informativos" element={<AnnouncementsSyndic />} />
        <Route path="/sindico/faturas" element={<Invoices />} />
        {/* Morador */}
        <Route path="/morador" element={<ResidentDashboard />} />
        <Route path="/morador/informativos" element={<AnnouncementsResident />} />
        <Route path="/morador/pagamentos" element={<Payments />} />
      </Routes>
    </Router>
  );
}

export default App;
