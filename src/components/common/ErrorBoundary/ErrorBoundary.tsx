import { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import { logger } from '@/services/logging/logger';

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
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Modificamos esta línea para usar solo 2 argumentos
    logger.error('Error boundary caught an error:', { 
      error, 
      componentStack: errorInfo.componentStack 
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
                {this.state.error.message}
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