import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const NotFound: React.FC = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  return (
    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h2>404 - Página no encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe o no tienes acceso.</p>
      
      {!isSignedIn && (
        <div style={{ marginTop: '20px' }}>
          <p>Si necesitas acceder al sistema, por favor inicia sesión.</p>
          <button 
            onClick={handleLoginClick}
            style={{
              backgroundColor: '#00cbbf',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Iniciar sesión con Azure AD
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            backgroundColor: 'transparent',
            color: '#00cbbf',
            padding: '8px 16px',
            border: '1px solid #00cbbf',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Volver a la página principal
        </button>
      </div>
    </div>
  );
};

export { NotFound };