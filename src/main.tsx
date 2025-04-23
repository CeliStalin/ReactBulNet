import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bulma/css/bulma.min.css';
import App from './App.tsx';
//import NavMenuApp from './components/NavMenu/NavMenuApp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
