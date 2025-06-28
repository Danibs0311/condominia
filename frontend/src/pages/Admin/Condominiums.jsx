// Conteúdo do arquivo Condominiums.jsx em frontend/src/pages/Adminimport React from 'react';
import Header from '../../components/ui/Header';

const Condominiums = () => {
  return (
    <div>
      <Header titulo="Cadastro de Condomínio" />
      <div className="p-4 text-white">
        <form className="max-w-md mx-auto bg-white text-blue-900 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Novo Condomínio</h2>
          <input type="text" placeholder="Nome do condomínio" className="mb-3 w-full p-2 border rounded" />
          <input type="text" placeholder="Endereço" className="mb-3 w-full p-2 border rounded" />
          <input type="text" placeholder="Responsável" className="mb-3 w-full p-2 border rounded" />
          <input type="text" placeholder="CPF do responsável" className="mb-3 w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-yellow-400 py-2 rounded font-bold hover:bg-yellow-300">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default Condominiums;
