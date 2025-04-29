import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { LoadingDots } from '@/components/common/Loading/LoadingDots';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/styles/theme';

export const LoginCard: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Card className="login-card">
      <div className="login-card-content">
        <h1 className="login-title">
          <span style={{ color: theme.colors.black }}>Ingresa al </span>
          <span style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            administrador de devolución a herederos
          </span>
        </h1>
        
        <Button
          variant="primary"
          onClick={handleLogin}
          loading={loading || isLoggingIn}
          fullWidth
          disabled={loading || isLoggingIn}
        >
          {loading || isLoggingIn ? (
            <LoadingDots size="small" />
          ) : (
            'Iniciar sesión con Azure AD'
          )}
        </Button>
        
        {error && <ErrorMessage message={error} />}
      </div>
    </Card>
  );
};