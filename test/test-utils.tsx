import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  initialEntries?: string[];
}

export function renderWithRouter(
  ui: ReactElement,
  {
    route = '/',
    initialEntries = [route],
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  return {
    ...render(
      <MemoryRouter initialEntries={initialEntries}>
        {ui}
      </MemoryRouter>,
      renderOptions
    )
  };
}

export function renderWithRoutes(
  ui: ReactElement,
  routes: { path: string; element: ReactElement }[],
  {
    route = '/',
    initialEntries = [route],
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  return {
    ...render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          {routes.map((routeConfig) => (
            <Route 
              key={routeConfig.path}
              path={routeConfig.path}
              element={routeConfig.element}
            />
          ))}
        </Routes>
      </MemoryRouter>,
      renderOptions
    )
  };
}