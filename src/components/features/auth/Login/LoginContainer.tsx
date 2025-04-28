import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/common/Layout/AuthLayout';
import { LoginCard } from './components/LoginCard';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export const LoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, isInitializing } = useAuth();

  useEffect(() => {
    if (isSignedIn && !isInitializing) {
      const state = location.state as LocationState;
      const from = state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isSignedIn, isInitializing, navigate, location]);

  return (
    <AuthLayout>
      <LoginCard />
    </AuthLayout>
  );
};

export default LoginContainer;