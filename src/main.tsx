import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bulma/css/bulma.min.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App/>
    </AuthProvider>
  </StrictMode>,
)