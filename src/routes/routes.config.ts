import { lazy } from 'react';
import { RouteConfig } from './types';

// Lazy loading de componentes

const Login = lazy(() => import('../core/components/Login/Login')); 
const MainPage = lazy(() => import('../core/components/MainPage')); 
const Dashboard = lazy(() => import('../core/components/Dashboard/DashboardPage')); 
const IngresoHerederos = lazy(() => import('../features/herederos/components/IngresoHerederos'));
const IngresoDocumentos = lazy(() => import('../features/documentos/components/IngresoDocumentos'));
const NotFound = lazy(() => import('../core/components/NotFound'));
const Unauthorized = lazy(() => import('../core/components/Unauthorized'));
const HomePage = lazy(() => import('../core/components/HomePage')); 

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
    path: '/home', 
    component: HomePage,
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
    roles: ['Developers'], 
  },
  {
    path: '/MnHerederos/ingresoDoc',
    component: IngresoDocumentos,
    roles: ['Developers'], 
  },
];