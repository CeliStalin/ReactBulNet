import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const NotFound: React.FC = () => {
  const { login, isSignedIn } = useAuth();
  
  return (
    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h2>404 - Página no encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe o no tienes acceso.</p>
      
      {isSignedIn && (
        <div style={{ marginTop: '20px' }}>
          <p>Parece que no has iniciado sesión.</p>
          <button 
            onClick={login}
            style={{
              backgroundColor: '#00cbbf',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Iniciar sesión con Azure AD
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <Link 
          to="/" 
          style={{
            color: '#00cbbf',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
};

export { NotFound };