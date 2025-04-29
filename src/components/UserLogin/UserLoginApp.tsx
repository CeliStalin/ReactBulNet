import React, { useState, useEffect, useRef } from 'react';
import { IUser } from '../../interfaces/IUserAz';
import useAuth from '../../hooks/useAuth';
import { AuthProvider } from '../../services/auth/authProviderMsal';
import logoutIcon from '../../assets/Group.png';

const UserLoginApp: React.FC = () => {
  const [localUserData, setLocalUserData] = useState<IUser | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const { logout, usuario, isLoggingOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isProcessingLogout, setIsProcessingLogout] = useState<boolean>(false);

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
    if (!isLoggingOut) {
      setIsProcessingLogout(false);
    }
  }, [isLoggingOut]);

  const handleToggleMenu = () => {
    setShowInfo(prevState => !prevState);
  };

  const effectiveUserData = usuario || localUserData;
  const avatarSrc = effectiveUserData?.photo || 'https://www.gravatar.com/avatar?d=mp';
  
  const handleLogout = async () => {
    console.log('[UserLoginApp] Botón logout clickeado');
    // Evitar múltiples clicks
    if (isProcessingLogout || isLoggingOut) {
      console.log('[UserLoginApp] Operación de logout ya en progreso, ignorando click');
      return;
    }
    
    setIsProcessingLogout(true);
    setLocalUserData(null);
    setShowInfo(false);
    
    try {
      // Verificar método de autenticación usado
      const authMethod = sessionStorage.getItem('authMethod');
      console.log('[UserLoginApp] Método de autenticación detectado:', authMethod);
      
      if (authMethod === 'redirect') {
        // Si usamos redirección para login, usar redirección para logout
        console.log('[UserLoginApp] Ejecutando logoutRedirect');
        await AuthProvider.logoutRedirect();
      } else {
        // Si no, usar el método normal
        console.log('[UserLoginApp] Ejecutando logout normal');
        await logout();
      }
    } catch (error) {
      console.error('[UserLoginApp] Error en logout:', error);
      // Incluso si hay un error, intentar limpiar datos locales
      try {
        sessionStorage.clear();
        localStorage.removeItem('isLogin');
        localStorage.removeItem('usuario');
        localStorage.removeItem('usuarioAD');
        localStorage.removeItem('roles');
      } catch (e) {
        console.error('[UserLoginApp] Error al limpiar datos locales:', e);
      }
      setIsProcessingLogout(false);
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
        disabled={isProcessingLogout || isLoggingOut}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          padding: '6px 12px',
          color: 'white',
          fontSize: '0.9rem',
          cursor: (isProcessingLogout || isLoggingOut) ? 'wait' : 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: (isProcessingLogout || isLoggingOut) ? 0.7 : 1
        }}
        onMouseOver={(e) => {
          if (!isProcessingLogout && !isLoggingOut) {
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
        {isProcessingLogout || isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
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