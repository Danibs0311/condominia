// Conteúdo do arquivo PaymentForm.jsx em frontend/src/components/paymentsimport React, { useState } from 'react';

const PaymentForm = ({ onSubmit }) => {
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ valor, vencimento });
    setValor('');
    setVencimento('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md w-full">
      <h2 className="text-lg font-bold mb-4 text-blue-900">Lançar Fatura</h2>
      <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor (R$)" className="mb-3 w-full p-2 border rounded" required />
      <input type="date" value={vencimento} onChange={(e) => setVencimento(e.target.value)} className="mb-3 w-full p-2 border rounded" required />
      <button type="submit" className="w-full bg-yellow-400 text-blue-900 font-bold py-2 rounded hover:bg-yellow-300">Salvar</button>
    </form>
  );
};

export default PaymentForm;
