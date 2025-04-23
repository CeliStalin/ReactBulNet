import React from 'react';
import { screen, fireEvent,render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFound } from '../../src/components/NotFound';
import useAuth from '../../src/hooks/useAuth';
import { renderWithRouter } from '../test-utils';

// Mock del hook 
jest.mock('../../src/hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('NotFound Component', () => {
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe mostrar mensaje de 404', () => {

    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
      login: mockLogin
    });

    renderWithRouter(<NotFound />);

    expect(screen.getByText('404 - Página no encontrada')).toBeTruthy();
    expect(screen.getByText('Lo sentimos, la página que estás buscando no existe o no tienes acceso.')).toBeTruthy();
  });

  test('debe mostrar botón de inicio de sesión cuando el usuario no está autenticado', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
      login: mockLogin
    });

    renderWithRouter(<NotFound />);

    expect(screen.getByText('Parece que no has iniciado sesión.')).toBeTruthy();
    const loginButton = screen.getByText('Iniciar sesión con Azure AD');
    expect(loginButton).toBeTruthy();
    

    fireEvent.click(loginButton);
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  test('no debe mostrar botón de inicio de sesión cuando el usuario está autenticado', () => {

    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
      login: mockLogin
    });

    renderWithRouter(<NotFound />);


    expect(screen.queryByText('Parece que no has iniciado sesión.')).not.toBeTruthy();
    expect(screen.queryByText('Iniciar sesión con Azure AD')).not.toBeTruthy();
  });

  test('debe contener un enlace a la página principal', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
      login: mockLogin
    });

    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Volver a la página principal');
    expect(homeLink).toBeTruthy();
    expect(homeLink.getAttribute('href')).toBe('/');
  });
});