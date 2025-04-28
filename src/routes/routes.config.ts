import { lazy } from 'react';
import { RouteConfig } from './types';

// Lazy loading de componentes
const Login = lazy(() => import('@/components/features/auth/Login/LoginContainer'));
const MainPage = lazy(() => import('@/components/features/MainPage/MainPage'));
const Dashboard = lazy(() => import('@/components/features/dashboard/Dashboard'));
const IngresoHerederos = lazy(() => import('@/components/features/herederos/IngresoHerederos'));
const IngresoDocumentos = lazy(() => import('@/components/features/herederos/IngresoDocumentos'));
const NotFound = lazy(() => import('@/components/features/NotFound'));
const Unauthorized = lazy(() => import('@/components/features/Unauthorized'));

export const routes: RouteConfig[] = [
  // Rutas públicas
  {
    path: '/login',
    component: Login,
    public: true,
  },
  {
    path: '/404',
    component: NotFound,
    public: true,
  },
  {
    path: '/unauthorized',
    component: Unauthorized,
    public: true,
  },
  
  // Rutas privadas
  {
    path: '/',
    component: MainPage,
    roles: ['USER', 'ADMIN', 'Developers'],
  },
  {
    path: '/dashboard',
    component: Dashboard,
    roles: ['ADMIN', 'Developers'],
  },
  {
    path: '/MnHerederos/ingresoHer',
    component: IngresoHerederos,
    roles: ['USER', 'ADMIN', 'Developers'],
  },
  {
    path: '/MnHerederos/ingresoDoc',
    component: IngresoDocumentos,
    roles: ['USER', 'ADMIN', 'Developers'],
  },
];