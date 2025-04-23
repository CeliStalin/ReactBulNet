import { RawRolResponse } from '../../src/interfaces/IRawRolResponse'
import { mapRawToRolResponse, mapRawArrayToRolResponseArray } from '../../src/Utils/MapperRawToRol'


describe('Rol Mapper Functions', () => {
    // Datos de prueba
    const rawRolWithFinVigencia: RawRolResponse = {
      ID_USUARIO: 1001,
      COD_APLICACION: 'APP01',
      ROL: 'ADMIN',
      TIPO_ROL: 'SISTEMA',
      INICIO_VIGENCIA: '2023-01-01T00:00:00',
      FIN_VIGENCIA: '2023-12-31T23:59:59',
      ESTADO_REG: 'A',
      FEC_ESTADO_REG: '2023-01-01T08:00:00',
      USUARIO_CREACION: 'admin',
      FECHA_CREACION: '2023-01-01T08:00:00',
      FUNCION_CREACION: 'CrearRol',
      USUARIO_MODIF: 'supervisor',
      FECHA_MODIF: '2023-02-15T10:30:00',
      FUNCION_MODIF: 'ModificarRol'
    };
    
    const rawRolWithoutFinVigencia: RawRolResponse = {
      ...rawRolWithFinVigencia,
      ID_USUARIO: 1002,
      FIN_VIGENCIA: null
    };
    
    const rawRolWithNullTipoRol: RawRolResponse = {
      ...rawRolWithFinVigencia,
      ID_USUARIO: 1003,
      TIPO_ROL: null
    };
    
    const rawRolArray: RawRolResponse[] = [
      rawRolWithFinVigencia,
      rawRolWithoutFinVigencia,
      rawRolWithNullTipoRol
    ];
  
    describe('mapRawToRolResponse', () => {
      it('debería mapear correctamente los datos con FIN_VIGENCIA', () => {
        const result = mapRawToRolResponse(rawRolWithFinVigencia);
        
        expect(result.IdUsuario).toBe(1001);
        expect(result.CodApp).toBe('APP01');
        expect(result.Rol).toBe('ADMIN');
        expect(result.TipoRol).toBe('SISTEMA');
        expect(result.InicioVigencia).toBeInstanceOf(Date);
        expect(result.InicioVigencia.toISOString()).toBe(new Date('2023-01-01T00:00:00').toISOString());
        expect(result.FinVigencia).toBeInstanceOf(Date);
        expect(result.FinVigencia?.toISOString()).toBe(new Date('2023-12-31T23:59:59').toISOString());
        expect(result.EstadoReg).toBe('A');
        expect(result.FecEstadoReg).toBeInstanceOf(Date);
        expect(result.UsuarioCreacion).toBe('admin');
        expect(result.FechaCreacion).toBeInstanceOf(Date);
        expect(result.FuncionCreacion).toBe('CrearRol');
        expect(result.UsuarioModificacion).toBe('supervisor');
        expect(result.FechaModificacion).toBeInstanceOf(Date);
        expect(result.FuncionModificacion).toBe('ModificarRol');
      });
  
      it('debería manejar correctamente los datos sin FIN_VIGENCIA (null)', () => {
        const result = mapRawToRolResponse(rawRolWithoutFinVigencia);
        
        expect(result.IdUsuario).toBe(1002);
        expect(result.FinVigencia).toBeUndefined();
      });
  
      it('debería manejar correctamente los datos con TIPO_ROL null', () => {
        const result = mapRawToRolResponse(rawRolWithNullTipoRol);
        
        expect(result.IdUsuario).toBe(1003);
        expect(result.TipoRol).toBe('');
      });
  
      it('debería convertir correctamente todas las fechas a objetos Date', () => {
        const result = mapRawToRolResponse(rawRolWithFinVigencia);
        
        expect(result.InicioVigencia).toBeInstanceOf(Date);
        expect(result.FinVigencia).toBeInstanceOf(Date);
        expect(result.FecEstadoReg).toBeInstanceOf(Date);
        expect(result.FechaCreacion).toBeInstanceOf(Date);
        expect(result.FechaModificacion).toBeInstanceOf(Date);
      });
    });
  
    describe('mapRawArrayToRolResponseArray', () => {
      it('debería mapear correctamente un array de RawRolResponse a array de RolResponse', () => {
        const result = mapRawArrayToRolResponseArray(rawRolArray);
        
        expect(result).toHaveLength(3);
        expect(result[0].IdUsuario).toBe(1001);
        expect(result[0].FinVigencia).toBeDefined();
        expect(result[1].IdUsuario).toBe(1002);
        expect(result[1].FinVigencia).toBeUndefined();
        expect(result[2].IdUsuario).toBe(1003);
        expect(result[2].TipoRol).toBe('');
      });
  
      it('debería devolver un array vacío cuando se proporciona un array vacío', () => {
        const result = mapRawArrayToRolResponseArray([]);
        expect(result).toHaveLength(0);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });
