import React, { useState } from 'react';
import { theme } from '../../../core/styles/theme';

interface RutSearchFormProps {
  onSearch: (rut: string) => void;
  loading?: boolean;
}

const RutSearchForm: React.FC<RutSearchFormProps> = ({ onSearch, loading = false }) => {
  const [rut, setRut] = useState('');
  const [error, setError] = useState('');

  const formatRut = (value: string) => {
    // Eliminar todo lo que no sea número o K
    let cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase();
    
    if (cleaned.length === 0) return '';
    
    // Si tiene más de 1 carácter, separar el dígito verificador
    if (cleaned.length > 1) {
      const body = cleaned.slice(0, -1);
      const dv = cleaned.slice(-1);
      
      // Formatear el cuerpo con puntos
      const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      return `${formattedBody}-${dv}`;
    }
    
    return cleaned;
  };

  const validateRut = (rut: string): boolean => {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) return false;
    
    const tmp = rut.split('-');
    let digv = tmp[1];
    const rutNumber = tmp[0];
    if (digv === 'K') digv = 'k';
    
    return (dv(rutNumber) === digv);
  };

  const dv = (T: string): string => {
    let M = 0, S = 1;
    for (; T; T = Math.floor(parseInt(T) / 10).toString())
      S = (S + parseInt(T) % 10 * (9 - M++ % 6)) % 11;
    return S ? (S - 1).toString() : 'k';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedRut = formatRut(e.target.value);
    setRut(formattedRut);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rut) {
      setError('Por favor ingrese un RUT');
      return;
    }

    if (!validateRut(rut)) {
      setError('RUT inválido');
      return;
    }

    onSearch(rut);
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
      <h2 style={formStyles.title}>Búsqueda por RUT</h2>
      
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={formStyles.inputWrapper}>
          <label style={formStyles.label}>RUT</label>
          <input
            type="text"
            value={rut}
            onChange={handleInputChange}
            placeholder="12.345.678-9"
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

export default RutSearchForm;