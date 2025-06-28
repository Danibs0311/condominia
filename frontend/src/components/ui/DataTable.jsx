// Conteúdo do arquivo DataTable.jsx em frontend/src/components/uiimport React from 'react';

const DataTable = ({ colunas, dados }) => {
  return (
    <table className="min-w-full bg-white text-blue-900 rounded shadow overflow-hidden">
      <thead>
        <tr>
          {colunas.map((col, i) => (
            <th key={i} className="px-4 py-2 border-b font-bold text-left">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dados.map((linha, i) => (
          <tr key={i} className="border-t hover:bg-gray-100">
            {colunas.map((col, j) => (
              <td key={j} className="px-4 py-2">{linha[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
