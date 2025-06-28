// Conteúdo do arquivo Payments.jsx em frontend/src/pages/Residentimport React from 'react';
import Header from '../../components/ui/Header';
import InvoiceGenerator from '../../components/payments/InvoiceGenerator';

const Payments = () => {
  const faturas = [
    { unidade: '101', valor: 120, vencimento: '2025-07-10', pago: false },
    { unidade: '101', valor: 120, vencimento: '2025-06-10', pago: true }
  ];

  return (
    <div>
      <Header titulo="Minhas Faturas" />
      <div className="p-6 text-white max-w-3xl mx-auto grid gap-4">
        {faturas.map((f, i) => (
          <InvoiceGenerator key={i} {...f} />
        ))}
      </div>
    </div>
  );
};

export default Payments;
