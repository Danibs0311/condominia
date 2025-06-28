// Conteúdo do arquivo Announcements.jsx em frontend/src/pages/Syndicimport React from 'react';
import Header from '../../components/ui/Header';

const Announcements = () => {
  return (
    <div>
      <Header titulo="Informativos do Condomínio" />
      <div className="p-6 text-white">
        <form className="bg-white text-blue-900 p-6 rounded shadow max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4">Novo Informativo</h2>
          <input type="text" placeholder="Título" className="mb-3 w-full p-2 border rounded" />
          <textarea placeholder="Mensagem" className="mb-3 w-full p-2 border rounded" rows="4"></textarea>
          <button type="submit" className="w-full bg-yellow-400 py-2 rounded font-bold hover:bg-yellow-300">Publicar</button>
        </form>
      </div>
    </div>
  );
};

export default Announcements;
