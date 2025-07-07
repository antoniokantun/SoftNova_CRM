import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-content-center align-items-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <div className="text-center">
              <i className="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
              <h2 className="text-2xl font-bold mb-3">¡Oops! Algo salió mal</h2>
              <p className="text-color-secondary mb-4">
                Ha ocurrido un error inesperado. Por favor, recarga la página o contacta al administrador.
              </p>
              <Button 
                label="Recargar página" 
                icon="pi pi-refresh"
                onClick={() => window.location.reload()}
                className="p-button-primary"
              />
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;