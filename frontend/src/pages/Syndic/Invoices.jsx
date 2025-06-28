// Conteúdo do arquivo Invoices.jsx em frontend/src/pages/Syndicimport React from 'react';
import Header from '../../components/ui/Header';
import PaymentForm from '../../components/payments/PaymentForm';

const Invoices = () => {
  const handleSubmit = (data) => {
    console.log('Nova fatura:', data);
  };

  return (
    <div>
      <Header titulo="Lançamento de Faturas" />
      <div className="p-6 text-white">
        <PaymentForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Invoices;
