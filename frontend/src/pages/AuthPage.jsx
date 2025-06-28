// Conteúdo do arquivo AuthPage.jsx em frontend/src/pagesimport React from 'react';
import LoginForm from '../components/auth/LoginForm';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
};

export default AuthPage;
