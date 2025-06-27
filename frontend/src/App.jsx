import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PainelMaster from './pages/PainelMaster';
import CadastroCondominio from './pages/CadastroCondominio';
import GerenciarAcessos from './pages/GerenciarAcessos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/master" element={<PainelMaster />} />
        <Route path="/cadastro-condominio" element={<CadastroCondominio />} />
        <Route path="/gerenciar-acessos" element={<GerenciarAcessos />} />
      </Routes>
    </Router>
  );
}

export default App;
