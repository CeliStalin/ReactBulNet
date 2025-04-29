// src/components/HomePage.tsx
import React from "react";
import { Layout } from "./Layout/Layout";
import useAuth from "../hooks/useAuth";

const HomePage: React.FC = () => {
  const { usuario, roles } = useAuth();
  const userRoles = roles.map(role => role.Rol);
  
  return (
    <Layout pageTitle="Inicio">
      <div className="content-container" style={{ minHeight: '400px' }}>
        <div className="content">
          <h1 className="title">Bienvenido a Consalud</h1>
          <p className="subtitle">Sistema de Administración de Herederos</p>
          
          {usuario && (
            <div className="notification is-info is-light">
              <h2 className="subtitle mb-2">Hola, {usuario.displayName}</h2>
              <p>Has iniciado sesión correctamente. Utiliza el menú lateral para navegar por el sistema.</p>
            </div>
          )}
          
          <div className="box mt-4">
            <h3 className="subtitle">Roles asignados</h3>
            {userRoles.length > 0 ? (
              <ul>
                {userRoles.map((role, index) => (
                  <li key={index}>{role}</li>
                ))}
              </ul>
            ) : (
              <p>No tienes roles asignados</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;