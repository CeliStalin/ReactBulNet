import React, { useState } from 'react';
import { theme } from '../styles/theme';

interface DocumentSearchFormProps {
  onSearch: (documentNumber: string) => void;
  loading?: boolean;
}

const DocumentSearchForm: React.FC<DocumentSearchFormProps> = ({ onSearch, loading = false }) => {
  const [documentNumber, setDocumentNumber] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentNumber(e.target.value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentNumber) {
      setError('Por favor ingrese un número de documento');
      return;
    }

    onSearch(documentNumber);
  };

  const formStyles = {
    box: {
      display: 'flex',
      padding: theme.spacing.lg,
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      borderRadius: theme.borderRadius.small,
      background: theme.colors.white,
      width: '367px',
      boxShadow: theme.shadows.card,
      margin: '0 auto',
    },
    title: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: 'bold',
      marginBottom: theme.spacing.sm,
      width: '100%',
      textAlign: 'center' as const,
    },
    inputWrapper: {
      width: '100%',
    },
    label: {
      display: 'block',
      marginBottom: theme.spacing.xs,
      fontWeight: '600',
      color: theme.colors.gray.dark,
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: `1px solid ${error ? theme.colors.danger : theme.colors.gray.light}`,
      fontSize: theme.typography.fontSize.sm,
    },
    button: {
      display: 'flex',
      padding: '13px 24px',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      boxShadow: theme.shadows.button,
      border: 'none',
      fontWeight: 'bold' as const,
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1,
      marginTop: theme.spacing.md,
    },
    error: {
      color: theme.colors.danger,
      fontSize: theme.typography.fontSize.xs,
      marginTop: '4px',
    }
  };

  return (
    <div style={formStyles.box}>
      <h2 style={formStyles.title}>Búsqueda de Documentos</h2>
      
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={formStyles.inputWrapper}>
          <label style={formStyles.label}>Número de Documento</label>
          <input
            type="text"
            value={documentNumber}
            onChange={handleInputChange}
            placeholder="Ingrese número de documento"
            style={formStyles.input}
            disabled={loading}
          />
          {error && <div style={formStyles.error}>{error}</div>}
        </div>
        
        <button 
          type="submit" 
          style={formStyles.button}
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>
    </div>
  );
};

export default DocumentSearchForm;