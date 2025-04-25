import React from 'react';

interface MainContentProps {
  // Interfaz vacía por ahora, pero permite futuras extensiones
}

export const MainContent: React.FC<MainContentProps> = () => {
  return (
    <div className="content">
      <h1 className="title">Bienvenido a Consalud</h1>
      <p className="subtitle">Sistema de Administración de Herederos</p>
      
      <div className="box">
        <p>Seleccione una opción del menú para comenzar.</p>
      </div>
    </div>
  );
};