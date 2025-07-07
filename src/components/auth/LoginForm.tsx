import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import type { LoginCredentials } from '../../types/auth.types';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const toast = React.useRef<Toast>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!credentials.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!credentials.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onLogin(credentials);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error de autenticación',
        detail: error.response?.data?.mensaje || 'Credenciales inválidas',
        life: 3000
      });
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Card className=" max-w-md">
        <div className="text-center mb-5">
          <i className="pi pi-shield text-6xl text-primary mb-3"></i>
          <h1 className="text-3xl font-bold mb-2">SoftNova CRM</h1>
          <p className="text-color-secondary">Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field mb-4">
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full ${errors.email ? 'p-invalid' : ''}`}
              placeholder="tu@email.com"
              autoComplete="email"
            />
            {errors.email && (
              <small className="p-error">{errors.email}</small>
            )}
          </div>

          <div className="field mb-4">
            <label htmlFor="password" className="block text-900 font-medium mb-2">
              Contraseña
            </label>
            <Password
              id="password"
              value={credentials.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full ${errors.password ? 'p-invalid' : ''}`}
              placeholder="Tu contraseña"
              toggleMask
              feedback={false}
              autoComplete="current-password"
            />
            {errors.password && (
              <small className="p-error">{errors.password}</small>
            )}
          </div>

          <Button
            type="submit"
            label="Iniciar Sesión"
            icon="pi pi-sign-in"
            loading={loading}
            className="w-full p-button-lg"
          />
        </form>

        <div className="text-center mt-4">
          <small className="text-color-secondary">
            ¿Problemas para acceder? Contacta al administrador
          </small>
        </div>
      </Card>
    </>
  );
};

export default LoginForm;