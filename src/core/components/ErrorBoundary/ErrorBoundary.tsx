import { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import { logger } from '@/core/services/logging/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Actualizar el estado para que el siguiente renderizado muestre la UI alternativa
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Registrar el error de forma segura
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const componentStack = errorInfo.componentStack || 'No component stack available';
    
    // Usar objeto simple en lugar del objeto de error completo
    logger.error('Error boundary caught an error:', { 
      errorMessage,
      componentStack 
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Card variant="bordered">
            <h2>Algo salió mal</h2>
            <p>Lo sentimos, ha ocurrido un error inesperado.</p>
            {this.state.error && (
              <p style={{ color: '#666', fontSize: '14px' }}>
                {this.state.error.message || 'Error sin mensaje'}
              </p>
            )}
            <div style={{ marginTop: '20px' }}>
              <Button onClick={() => window.location.reload()}>
                Recargar página
              </Button>
              <Button
                variant="ghost"
                onClick={this.handleReset}
                style={{ marginLeft: '10px' }}
              >
                Intentar de nuevo
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}