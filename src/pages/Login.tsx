import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types/auth.types';
import LoginForm from '../components/auth/LoginForm';
import { ROUTES } from '../utils/constants';

const Login: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (credentials: LoginCredentials) => {
    await login(credentials);
  };

  if (isAuthenticated) {
    return null; // Evitar renderizar mientras redirige
  }

  return (
    <div className="flex align-items-center justify-content-center min-h-screen p-4">
      <LoginForm onLogin={handleLogin} loading={loading} />
    </div>
  );
};

export default Login;