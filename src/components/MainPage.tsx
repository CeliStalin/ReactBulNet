import React from "react";
import NavMenuApp from "./NavMenu/NavMenuApp";
import UserLoginApp from "./UserLogin/UserLoginApp";
import { Counter } from "./Counter";
import useAuth from "../hooks/useAuth";

const Mainpage: React.FC = () => {
  const { roles } = useAuth();
  const userRoles = roles.map(role => role.Rol);
  
  return (
    <>
      <header
        style={{
          backgroundColor: "#04A59B",
          padding: "0.8rem",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://www.consalud.cl/assets/img/iconos/logo-consalud-bgwhite.png"
            alt="Consalud Logo"
            className="image"
            style={{ height: '50px', width: 'auto', marginRight: '1rem' }}
          />
        </div>
        <UserLoginApp />
      </header>

      <div style={{ paddingTop: "4rem", display: "flex" }}>
        <NavMenuApp />
        
        <div style={{ marginLeft: "220px", padding: "20px", width: "100%" }}>
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
        </div>
      </div>
    </>
  );
};

export { Mainpage };