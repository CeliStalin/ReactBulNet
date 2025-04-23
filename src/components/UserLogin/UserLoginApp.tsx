import React, { useState, useEffect, useRef } from 'react';
import { IUser } from '../../interfaces/IUserAz';
import { useAuth } from '../../hooks/useAuth';

const UserLoginApp: React.FC = () => {
  const [localUserData, setLocalUserData] = useState<IUser | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const { logout, usuario } = useAuth();
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

  const handleToggleMenu = () => {
    setShowInfo(prevState => !prevState);
  };

  const effectiveUserData = usuario || localUserData;
  const avatarSrc = effectiveUserData?.photo || 'https://www.gravatar.com/avatar?d=mp';
  
  const handleLogout = () => {
    setLocalUserData(null);
    setShowInfo(false); 
    logout(); 
  };

  return (
    <div
      className="identify"
      style={{ position: 'absolute', right: '20px', top: '1px', display: 'flex', alignItems: 'center' }}
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
          <div style={{ color: '#ffffff', fontSize: '0.75rem' }}>
            <div>{effectiveUserData.jobTitle}</div>
            <div>{effectiveUserData.displayName}</div>
          </div>
        )}
      </div>

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

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#00cbbf',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              color: 'white',
              fontSize: '0.8rem',
              cursor: 'pointer',
              width: '100%',
              fontWeight: 'bold',
              marginTop: '10px',
            }}
          >
            Cerrar sesión
          </button>   
        </div>
      )}
    </div>
  );
};

export default UserLoginApp;