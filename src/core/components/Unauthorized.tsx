import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Unauthorized: React.FC = () => {
  const { isSignedIn, roles } = useAuth();
  
  const userRoles = roles.map(role => role.Rol).join(', ');
  
  return (
    <div className="hero is-fullheight">
      <div className="has-text-left p-4" style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <img 
          src="https://www.consalud.cl/assets/img/iconos/logo-consalud-bgwhite.png" 
          alt="Consalud Logo" 
          className="image"
          style={{ height: '50px', width: 'auto' }}
        />
      </div>
      
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-narrow">
              <div 
                className="box has-text-centered"
                style={{ 
                  backgroundColor: '#00cbbf', 
                  color: 'white', 
                  width: '450px',
                  padding: '25px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              >
                <h1 className="title has-text-centered has-text-white mb-4">
                  Acceso Denegado
                </h1>
                
                <div className="content mb-4">
                  <p className="has-text-white">
                    Lo sentimos, no tienes los permisos necesarios para acceder a esta página.
                  </p>
                  
                  {isSignedIn && (
                    <div className="mt-4">
                      <p className="has-text-white">
                        Tu rol actual: <strong>{userRoles || "Sin roles asignados"}</strong>
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="field mt-5">
                  <div className="control">
                    <Link 
                      to="/" 
                      className="button is-white is-outlined is-fullwidth"
                    >
                      Volver a la página principal
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;