import React from "react";
import { Layout } from "../Layout/Layout";  

const Mainpage: React.FC = () => {
  return (
    <Layout>
      <div className="content-container" style={{ minHeight: '400px' }}>
        <div className="content">
          <h1 className="title">Bienvenido a Consalud</h1>
          <p className="subtitle">Sistema de Administración de Herederos</p>
          
          <div className="box">
            <p>Seleccione una opción del menú para comenzar.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mainpage;