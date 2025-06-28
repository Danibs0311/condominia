// Conteúdo do arquivo InvoiceGenerator.jsx em frontend/src/components/paymentsimport React from 'react';

const InvoiceGenerator = ({ unidade, valor, vencimento, pago }) => {
  return (
    <div className="border p-4 rounded shadow bg-white text-blue-900">
      <h3 className="font-bold text-lg mb-2">Recibo - Unidade {unidade}</h3>
      <p><strong>Valor:</strong> R$ {parseFloat(valor).toFixed(2)}</p>
      <p><strong>Vencimento:</strong> {vencimento}</p>
      <p><strong>Status:</strong> {pago ? 'Pago' : 'Pendente'}</p>
    </div>
  );
};

export default InvoiceGenerator;
