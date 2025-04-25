import React from 'react';
import { Layout } from '../Layout/Layout';

const IngresoDocumentos: React.FC = () => {
  return (
    <Layout pageTitle="Ingreso Documentos">
      <div style={{ padding: '20px' }}>
        <div className="columns is-centered">
          <div className="column is-narrow">
            <div className="box" style={{ width: '367px' }}>
              <h2 className="title is-4 has-text-centered">Ingreso Documentos</h2>
              <p className="has-text-centered">Formulario de documentos en construcción</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IngresoDocumentos;