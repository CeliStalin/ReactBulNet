import React from 'react';
import { theme } from '../../styles/theme';

interface UserInfoProps {
  usuario: any;
  usuarioAD: any;
  roles: any[];
}

export const UserInfo: React.FC<UserInfoProps> = ({ usuario, usuarioAD, roles }) => {
  const sectionTitleStyles = {
    color: theme.colors.primary,
    marginBottom: '12px',
  };

  const textStyles = {
    color: theme.colors.gray.dark,
  };

  return (
    <div className="content" style={{ width: '100%' }}>
      <h3 className="subtitle mb-2" style={sectionTitleStyles}>
        Información del usuario
      </h3>
      {usuario && (
        <div style={textStyles}>
          <p>Nombre: {usuario.displayName}</p>
          <p>Email: {usuario.mail || usuario.userPrincipalName}</p>
        </div>
      )}
      
      <h3 className="subtitle mt-4 mb-2" style={{ ...sectionTitleStyles, marginTop: '16px' }}>
        Información de AD
      </h3>
      {usuarioAD && (
        <div style={textStyles}>
          <p>ID: {usuarioAD.IdUsuario}</p>
          <p>Nombre completo: {usuarioAD.UsuarioExterno.Nombres} {usuarioAD.UsuarioExterno.ApellidoPaterno} {usuarioAD.UsuarioExterno.ApellidoMaterno}</p>
        </div>
      )}
      
      <h3 className="subtitle mt-4 mb-2" style={{ ...sectionTitleStyles, marginTop: '16px' }}>
        Roles
      </h3>
      {roles.length > 0 ? (
        <ul style={{ paddingLeft: '20px', color: theme.colors.gray.dark }}>
          {roles.map((rol) => (
            <li key={rol.IdUsuario}>{rol.Rol}</li>
          ))}
        </ul>
      ) : (
        <p style={textStyles}>No se encontraron roles</p>
      )}
    </div>
  );
};