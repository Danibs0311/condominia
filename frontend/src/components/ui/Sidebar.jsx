// Conteúdo do arquivo Sidebar.jsx em frontend/src/components/uiimport React from 'react';

const Sidebar = ({ itens }) => {
  return (
    <aside className="bg-blue-900 text-white w-60 min-h-screen p-4">
      <nav className="flex flex-col gap-4">
        {itens.map((item, idx) => (
          <a key={idx} href={item.link} className="hover:bg-blue-800 p-2 rounded">
            {item.nome}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
