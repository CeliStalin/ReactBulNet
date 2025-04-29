import React from 'react';
import { theme } from '../../styles/theme';

interface ErrorMessagesProps {
  error?: string;
  errorAD?: string;
  errorRoles?: string;
}

export const ErrorMessages: React.FC<ErrorMessagesProps> = ({ error, errorAD, errorRoles }) => {
  if (!error && !errorAD && !errorRoles) return null;

  return (
    <>
      {error && (
        <p className="has-text-danger mt-4" style={{ width: '100%', color: theme.colors.danger }}>
          Error: {error}
        </p>
      )}
      {errorAD && (
        <p className="has-text-warning mt-4" style={{ width: '100%', color: theme.colors.warning }}>
          Error AD: {errorAD}
        </p>
      )}
      {errorRoles && (
        <p className="has-text-warning mt-4" style={{ width: '100%', color: theme.colors.warning }}>
          Error Roles: {errorRoles}
        </p>
      )}
    </>
  );
};