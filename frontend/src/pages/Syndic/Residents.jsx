// Conteúdo do arquivo Residents.jsx em frontend/src/pages/Syndicimport React from 'react';
import Header from '../../components/ui/Header';

const Residents = () => {
  return (
    <div>
      <Header titulo="Cadastro de Unidades e Moradores" />
      <div className="p-6 text-white">
        <form className="bg-white text-blue-900 p-6 rounded shadow max-w-lg mx-auto">
          <h2 className="font-bold text-xl mb-4">Cadastrar Unidade</h2>
          <input type="text" placeholder="Número da unidade" className="mb-3 w-full p-2 border rounded" />
          <h3 className="font-semibold mt-4 mb-2">Morador</h3>
          <input type="text" placeholder="Nome do morador" className="mb-3 w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-yellow-400 py-2 rounded font-bold hover:bg-yellow-300">Cadastrar</button>
        </form>

        <div className="mt-6 max-w-lg mx-auto">
          <h2 className="text-lg font-semibold mb-2">Lista de Moradores</h2>
          <ul className="bg-white text-blue-900 rounded shadow p-4">
            <li>Unidade 101 - João Silva</li>
            <li>Unidade 102 - Maria Souza</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Residents;
