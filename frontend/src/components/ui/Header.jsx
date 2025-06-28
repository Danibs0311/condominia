// Conteúdo do arquivo Header.jsx em frontend/src/components/uiimport React from 'react';

const Header = ({ titulo }) => {
  return (
    <header className="bg-yellow-400 text-blue-900 py-4 px-6 shadow flex justify-between items-center">
      <h1 className="text-xl font-bold">{titulo}</h1>
      <a href="/" className="font-semibold hover:underline">Sair</a>
    </header>
  );
};

export default Header;
