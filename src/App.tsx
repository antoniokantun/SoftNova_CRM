// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Users from './pages/Users';
import NotFound from './pages/NotFound';
import { ROUTES } from './utils/constants';

// Importar estilos de PrimeReact
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Ruta pública de login */}
              <Route path={ROUTES.LOGIN} element={<Login />} />
              
              {/* Rutas protegidas con Layout */}
              <Route 
                path={ROUTES.DASHBOARD} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path={ROUTES.LEADS} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Leads />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path={ROUTES.USERS} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Users />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Ruta raíz - redirige al dashboard */}
              <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              
              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;