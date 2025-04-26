import React, { useState, useEffect, useRef } from 'react';
import { IUser } from '../../interfaces/IUserAz';
import useAuth from '../../hooks/useAuth';
import logoutIcon from '../../assets/Group.png';

const UserLoginApp: React.FC = () => {
  const [localUserData, setLocalUserData] = useState<IUser | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const { logout, usuario, isLoggingOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (usuario) {
      setLocalUserData(usuario);
      return;
    }
    try {
      const userString = localStorage.getItem('usuario');
      if (userString) {
        const parsedUser = JSON.parse(userString);
        setLocalUserData(parsedUser);
      }
    } catch (e) {
      console.error('Error al parsear los datos del usuario:', e);
    }
  }, [usuario]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowInfo(false);
      }
    }

    if (showInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfo]);

  // Log de estado de logout
  useEffect(() => {
    console.log('[UserLoginApp] isLoggingOut:', isLoggingOut);
  }, [isLoggingOut]);

  const handleToggleMenu = () => {
    setShowInfo(prevState => !prevState);
  };

  const effectiveUserData = usuario || localUserData;
  const avatarSrc = effectiveUserData?.photo || 'https://www.gravatar.com/avatar?d=mp';
  
  const handleLogout = async () => {
    console.log('[UserLoginApp] Botón logout clickeado');
    setLocalUserData(null);
    setShowInfo(false);
    try {
      // Esperar a que logout complete
      await logout();
      console.log('[UserLoginApp] Logout completado');
    } catch (error) {
      console.error('[UserLoginApp] Error en logout:', error);
    }
  };

   // Obtener nombre y apellido de displayName
   const getNameAndSurname = () => {
    if (effectiveUserData?.displayName) {
      const parts = effectiveUserData.displayName.split(' ');
      if (parts.length >= 3) {
        // Si tiene 3 o más partes, tomamos el primer nombre y el tercer elemento (primer apellido)
        return `${parts[0]} ${parts[2]}`;
      } else if (parts.length >= 2) {
        // Si tiene exactamente 2 partes, las mostramos tal cual
        return `${parts[0]} ${parts[1]}`;
      }
      return effectiveUserData.displayName;
    }
    return '';
  };
  
  return (
    <div
      className="identify"
      style={{ 
        position: 'relative',
        display: 'flex', 
        alignItems: 'center',
        gap: '15px'
      }}
      ref={menuRef}
    >
      <div 
        onClick={handleToggleMenu}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: showInfo ? 'rgba(0, 0, 0, 0.1)' : 'transparent' 
        }}
      >
        <img
          src={avatarSrc}
          alt="Usuario"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '2px solid #ffffff',
            boxShadow: '0 0 6px rgba(0, 0, 0, 0.1)',
            marginRight: '10px',
          }}
        />
        
        {effectiveUserData && (
          <div style={{ color: '#ffffff', fontSize: '0.9rem' }}>
            <div>{getNameAndSurname()}</div>
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          padding: '6px 12px',
          color: 'white',
          fontSize: '0.9rem',
          cursor: isLoggingOut ? 'wait' : 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: isLoggingOut ? 0.7 : 1
        }}
        onMouseOver={(e) => {
          if (!isLoggingOut) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <img 
           src={logoutIcon}
          alt="logout icon"
          style={{
            width: '30px',
            height: '30px',
          }}
        />
        {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
      </button>

      {showInfo && effectiveUserData && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            right: 0,
            backgroundColor: '#1e2a38',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '10px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            zIndex: 10,
            width: '230px',
            fontSize: '0.85rem',
            lineHeight: '1.4',
          }}
        >
          <p>{effectiveUserData.displayName}</p>
          <p>{effectiveUserData.mail}</p>
        </div>
      )}
    </div>
  );
};

export default UserLoginApp;