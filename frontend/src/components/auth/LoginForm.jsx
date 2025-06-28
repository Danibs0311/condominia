import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login com:', email, senha);
  };

  return (
    <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h2 className="text-lg font-bold mb-4 text-center text-gray-800">Acessar Painel</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="E-mail" className="mb-3 w-full p-2 border rounded"/>
      <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="Senha" className="mb-3 w-full p-2 border rounded"/>
      <button type="submit" className="w-full bg-yellow-400 text-blue-900 font-bold py-2 rounded hover:bg-yellow-300">Entrar</button>
    </form>
  );
};

export default LoginForm;
// Conteúdo do arquivo LoginForm.jsx em frontend/src/components/auth