import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '../test-utils';
import Login from '../../src/components/Login';
import useAuth from '../../src/hooks/useAuth';

// Mock del hook useAuth
jest.mock('../../src/hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe mostrar el botón de inicio de sesión cuando el usuario no está autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
      login: mockLogin,
      logout: mockLogout,
      usuario: null,
      usuarioAD: null,
      roles: [],
      loading: false,
      error: null,
      errorAD: null,
      errorRoles: null
    });

    renderWithRouter(<Login />);

    expect(screen.getByText('Estado: No autenticado')).toBeTruthy();
    

    const loginButton = screen.getByText('Iniciar sesión con Azure AD');
    expect(loginButton).toBeTruthy();
    
    fireEvent.click(loginButton);
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  test('debe mostrar un indicador de carga cuando loading es true', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
      login: mockLogin,
      logout: mockLogout,
      usuario: null,
      usuarioAD: null,
      roles: [],
      loading: true,
      error: null,
      errorAD: null,
      errorRoles: null
    });

    renderWithRouter(<Login />);

    expect(screen.getByText('Cargando...')).toBeTruthy();
  });

  test('debe redirigir a la página principal cuando el usuario está autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
      login: mockLogin,
      logout: mockLogout,
      usuario: {
        displayName: 'Test User',
        mail: 'test@example.com',
        userPrincipalName: 'test@example.com'
      },
      usuarioAD: {
        IdUsuario: '123',
        UsuarioExterno: {
          Nombres: 'Test',
          ApellidoPaterno: 'User',
          ApellidoMaterno: 'Test'
        }
      },
      roles: [{ IdUsuario: '123', Rol: 'Admin' }],
      loading: false,
      error: null,
      errorAD: null,
      errorRoles: null
    });

    const { container } = renderWithRouter(<Login />);
    

    expect(container.firstChild).toBeNull();
  });

  test('debe mostrar mensajes de error cuando hay errores', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
      login: mockLogin,
      logout: mockLogout,
      usuario: null,
      usuarioAD: null,
      roles: [],
      loading: false,
      error: 'Error de autenticación',
      errorAD: 'Error en la consulta de AD',
      errorRoles: 'Error en la consulta de roles'
    });

    renderWithRouter(<Login />);

    expect(screen.getByText('Error: Error de autenticación')).toBeTruthy();
    expect(screen.getByText('Error AD: Error en la consulta de AD')).toBeTruthy();
    expect(screen.getByText('Error Roles: Error en la consulta de roles')).toBeTruthy();
  });
});