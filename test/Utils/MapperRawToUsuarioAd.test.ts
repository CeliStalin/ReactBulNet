import { mapRawToUsuarioAd } from  '../../src/Utils/MapperRawToUsuarioAd'
import { RawUsuarioAD } from '../../src/interfaces/IRawUsuarioAD'



describe('mapRawToUsuarioAd', () => {
    test('debería mapear correctamente datos completos de RawUsuarioAD a UsuarioAd', () => {
      const rawData: RawUsuarioAD = {
        ID_USUARIO: 1,
        USERNAME: 'usuario1',
        TIPO_USUARIO: 'admin',
        CARGO: 123,
        UNOR_CORRELATIVO: 456,
        TIPO_EMPL: 'tipo1',
        TICV_CODIGO: 'codigo1',
        TIAV_CODIGO: 'codigo2',
        RUT: 12345678,
        DV: '9',
        UsuarioExterno: {
          USUARIOS_AD_ID: 1,
          PASSWORD_ENCRYPT: 'encrypted_password',
          IV: 'iv_string',
          NOMBRES: 'Nombre Usuario',
          APELLIDO_PATERNO: 'Apellido1',
          APELLIDO_MATERNO: 'Apellido2',
          EMAIL: 'usuario@ejemplo.com',
          TELEFONO: '123456789',
          BLOQUEADO: 'N',
          DEBE_CAMBIAR: 'S',
          INTENTOS_FALLIDOS: 0,
          CODIGO_PROMOTOR: 'PROM123',
          ESTADO_REG: 'A',
          FEC_ESTADO_REG: '2023-01-01T00:00:00',
          USUARIO_CREACION: 'admin',
          FECHA_CREACION: '2023-01-01T00:00:00',
          FUNCION_CREACION: 'crear',
          USUARIO_MODIF: 'admin',
          FECHA_MODIF: '2023-01-02T00:00:00',
          FUNCION_MODIF: 'modificar'
        },
        ESTADO_REG: 'A',
        FEC_ESTADO_REG: '2023-01-01T00:00:00',
        USUARIO_CREACION: 'admin',
        FECHA_CREACION: '2023-01-01T00:00:00',
        FUNCION_CREACION: 'crear',
        USUARIO_MODIF: 'admin',
        FECHA_MODIF: '2023-01-02T00:00:00',
        FUNCION_MODIF: 'modificar'
      };
  

      const result = mapRawToUsuarioAd(rawData);
  

      expect(result).toEqual({
        IdUsuario: 1,
        UserName: 'usuario1',
        TipoUsuario: 'admin',
        Cargo: 123,
        UnorCorrelativo: 456,
        TipoEmpleado: 'tipo1',
        TicvCodigo: 'codigo1',
        TiavCodigo: 'codigo2',
        Rut: 12345678,
        Dv: '9',
        UsuarioExterno: {
          UsuarioAdId: 1,
          PassEncriptado: 'encrypted_password',
          Iv: 'iv_string',
          Nombres: 'Nombre Usuario',
          ApellidoPaterno: 'Apellido1',
          ApellidoMaterno: 'Apellido2',
          Email: 'usuario@ejemplo.com',
          Telefono: '123456789',
          Bloqueado: 'N',
          DebeCambiar: 'S',
          IntentosFallidos: 0,
          CodigoPromotor: 'PROM123',
          EstadoReg: 'A',
          FechaEstadoRegistro: new Date('2023-01-01T00:00:00'),
          UsuarioCreacion: 'admin',
          FechaCreacion: new Date('2023-01-01T00:00:00'),
          UsuarioModificacion: 'admin',
          FechaModificacion: new Date('2023-01-02T00:00:00'),
          FuncionModificacion: 'modificar'
        },
        EstadoReg: 'A',
        FechaEstadoRegistro: new Date('2023-01-01T00:00:00'),
        UsuarioCreacion: 'admin',
        FechaCreacion: new Date('2023-01-01T00:00:00'),
        FuncionCreacion: 'crear',
        UsuarioModificacion: 'admin',
        FechaModificacion: new Date('2023-01-02T00:00:00'),
        FuncionModificacion: 'modificar'
      });
    });
  
    test('debería manejar correctamente campos nulos y opcionales', () => {
      const rawData: RawUsuarioAD = {
        ID_USUARIO: 2,
        USERNAME: 'usuario2',
        TIPO_USUARIO: 'user',
        CARGO: 789,
        UNOR_CORRELATIVO: 101,
        TIPO_EMPL: null,
        TICV_CODIGO: null,
        TIAV_CODIGO: null,
        RUT: 87654321,
        DV: '0',
        UsuarioExterno: {
          USUARIOS_AD_ID: 2,
          PASSWORD_ENCRYPT: 'encrypted_password2',
          IV: 'iv_string2',
          NOMBRES: 'Otro Usuario',
          APELLIDO_PATERNO: 'OtroApellido1',
          APELLIDO_MATERNO: 'OtroApellido2',
          EMAIL: 'otro@ejemplo.com',
          TELEFONO: '987654321',
          BLOQUEADO: 'S',
          DEBE_CAMBIAR: 'N',
          INTENTOS_FALLIDOS: 3,
          CODIGO_PROMOTOR: null,
          ESTADO_REG: 'A',
          FEC_ESTADO_REG: '2023-02-01T00:00:00',
          USUARIO_CREACION: 'admin',
          FECHA_CREACION: '2023-02-01T00:00:00',
          FUNCION_CREACION: 'crear',
          USUARIO_MODIF: 'admin',
          FECHA_MODIF: '2023-02-02T00:00:00',
          FUNCION_MODIF: 'modificar'
        },
        ESTADO_REG: 'A',
        FEC_ESTADO_REG: '2023-02-01T00:00:00',
        USUARIO_CREACION: 'admin',
        FECHA_CREACION: '2023-02-01T00:00:00',
        FUNCION_CREACION: 'crear',
        USUARIO_MODIF: 'admin',
        FECHA_MODIF: '2023-02-02T00:00:00',
        FUNCION_MODIF: 'modificar'
      };
  

      const result = mapRawToUsuarioAd(rawData);
  

      expect(result.TipoEmpleado).toBe('');
      expect(result.TicvCodigo).toBe('');
      expect(result.TiavCodigo).toBe('');
      expect(result.UsuarioExterno.CodigoPromotor).toBe('');
    });
  
    test('debería convertir correctamente strings de fecha a objetos Date', () => {

      const fechaEstadoReg = '2023-03-15T10:30:00';
      const fechaCreacion = '2023-03-15T11:45:00';
      const fechaModif = '2023-03-16T09:20:00';
  
      const rawData: RawUsuarioAD = {
        ID_USUARIO: 3,
        USERNAME: 'usuario3',
        TIPO_USUARIO: 'guest',
        CARGO: 555,
        UNOR_CORRELATIVO: 666,
        TIPO_EMPL: 'tipo3',
        TICV_CODIGO: 'codigo3',
        TIAV_CODIGO: 'codigo4',
        RUT: 11223344,
        DV: '5',
        UsuarioExterno: {
          USUARIOS_AD_ID: 3,
          PASSWORD_ENCRYPT: 'encrypted_password3',
          IV: 'iv_string3',
          NOMBRES: 'Test Usuario',
          APELLIDO_PATERNO: 'TestApellido1',
          APELLIDO_MATERNO: 'TestApellido2',
          EMAIL: 'test@ejemplo.com',
          TELEFONO: '555666777',
          BLOQUEADO: 'N',
          DEBE_CAMBIAR: 'N',
          INTENTOS_FALLIDOS: 0,
          CODIGO_PROMOTOR: 'PROM456',
          ESTADO_REG: 'A',
          FEC_ESTADO_REG: fechaEstadoReg,
          USUARIO_CREACION: 'admin',
          FECHA_CREACION: fechaCreacion,
          FUNCION_CREACION: 'crear',
          USUARIO_MODIF: 'admin',
          FECHA_MODIF: fechaModif,
          FUNCION_MODIF: 'modificar'
        },
        ESTADO_REG: 'A',
        FEC_ESTADO_REG: fechaEstadoReg,
        USUARIO_CREACION: 'admin',
        FECHA_CREACION: fechaCreacion,
        FUNCION_CREACION: 'crear',
        USUARIO_MODIF: 'admin',
        FECHA_MODIF: fechaModif,
        FUNCION_MODIF: 'modificar'
      };
  
      // Act
      const result = mapRawToUsuarioAd(rawData);
  
      // Assert
      expect(result.FechaEstadoRegistro).toBeInstanceOf(Date);
      expect(result.FechaCreacion).toBeInstanceOf(Date);
      expect(result.FechaModificacion).toBeInstanceOf(Date);
      expect(result.UsuarioExterno.FechaEstadoRegistro).toBeInstanceOf(Date);
      expect(result.UsuarioExterno.FechaCreacion).toBeInstanceOf(Date);
      expect(result.UsuarioExterno.FechaModificacion).toBeInstanceOf(Date);
  
      expect(result.FechaEstadoRegistro.toISOString()).toBe(new Date(fechaEstadoReg).toISOString());
      expect(result.FechaCreacion.toISOString()).toBe(new Date(fechaCreacion).toISOString());
      expect(result.FechaModificacion.toISOString()).toBe(new Date(fechaModif).toISOString());
    });
  });