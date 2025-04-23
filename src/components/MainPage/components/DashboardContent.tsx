import React from 'react';
import { Counter } from '../../Counter';

interface DashboardContentProps {
  userRoles: string[];
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ userRoles }) => {
  return (
    <div className="box p-5">
      <h1 className="title">Bienvenido a Consalud</h1>
      <p className="subtitle">Panel de control principal</p>
      
      <div className="content mb-5">
        <p>Tu rol actual: <strong>{userRoles.join(', ') || "Sin roles asignados"}</strong></p>
        
        {userRoles.includes("ADMIN") ? (
          <p className="notification is-info is-light">
            Como administrador, tienes acceso completo al sistema.
          </p>
        ) : (
          <p className="notification is-success is-light">
            Como usuario, tienes acceso a las funciones básicas del sistema.
          </p>
        )}
      </div>
      
      <div className="box has-background-light p-4">
        <h2 className="subtitle">Contador de demostración</h2>
        <Counter value={10} />
      </div>
    </div>
  );
};