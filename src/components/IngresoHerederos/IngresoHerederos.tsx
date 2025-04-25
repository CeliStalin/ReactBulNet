import React, { useState } from 'react';
import RutSearchForm from './RutSearchForm';
import { Layout } from '../Layout/Layout';

interface IngresoHerederosProps {
  // Props que se necesitara en el futuro
}

const IngresoHerederos: React.FC<IngresoHerederosProps> = () => {
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = async (rut: string) => {
    setLoading(true);
    try {
      // Aquí irá tu lógica de búsqueda
      console.log('Buscando RUT:', rut);
      
      // Simulación de llamada API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulación de resultado
      setSearchResult({
        rut,
        nombre: 'Juan Pérez',
        fechaNacimiento: '01/01/1980',
        // otros datos...
      });
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout pageTitle="Ingreso Herederos">
      <div style={{ padding: '20px' }}>
        <div className="columns is-centered">
          <div className="column is-narrow">
            <RutSearchForm onSearch={handleSearch} loading={loading} />
            
            {searchResult && (
              <div className="box mt-5" style={{ width: '367px', margin: '20px auto' }}>
                <h3 className="title is-5">Resultados de la búsqueda</h3>
                <div className="content">
                  <p><strong>RUT:</strong> {searchResult.rut}</p>
                  <p><strong>Nombre:</strong> {searchResult.nombre}</p>
                  <p><strong>Fecha de Nacimiento:</strong> {searchResult.fechaNacimiento}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IngresoHerederos;