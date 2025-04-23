import { ApiRoles, ApiGetUsuarioAd, ApiGetMenus } from '../../src/services/GetApiArq';
// No importamos directamente EnvModule
import * as MapperModule from '../../src/Utils/MapperRawToRol';
import * as ModuleUserAd from '../../src/Utils/MapperRawToUsuarioAd';
import * as ModuleMenu from '../../src/Utils/MapperRawMenus'
import { RolResponse } from '../../src/interfaces/IRol';
import { RawRolResponse } from '../../src/interfaces/IRawRolResponse';
import { UsuarioAd } from '../../src/interfaces/IUsuarioAD';
import { RawUsuarioAD } from '../../src/interfaces/IRawUsuarioAD';
import { ElementMenu } from '../../src/interfaces/IMenusElementos'
import { RawMenusElemento } from '../../src/interfaces/IRawMenusElmento'


jest.mock('../../src/Utils/GetEnvVariables', () => ({
  GetApiArquitectura: jest.fn().mockReturnValue('https://api.ejemplo.com'),
  GetSistema: jest.fn().mockReturnValue({ codigo: 'SIS001' }),
  GetNameApiKey: jest.fn().mockReturnValue('X-API-KEY'),
  GetKeyApiKey: jest.fn().mockReturnValue('abc123xyz456'),
  FetchWithTimeout: jest.fn()
}));


import * as EnvModule from '../../src/Utils/GetEnvVariables';

jest.mock('../../src/Utils/MapperRawToRol', () => ({
  mapRawArrayToRolResponseArray: jest.fn()
}));

jest.mock('../../src/Utils/MapperRawToUsuarioAd', () => ({
  mapRawToUsuarioAd: jest.fn()
}));

jest.mock('../../src/Utils/MapperRawMenus', () => ({
  mapRawArrayToElementMenuArray: jest.fn()
}));

describe('ApiRoles', () => {
  const mockEmail = 'usuario@ejemplo.com';
  const mockApiUrl = 'https://api.ejemplo.com';
  const mockSistemaCodigo = 'SIS001';
  const mockApiKeyName = 'X-API-KEY';
  const mockApiKeyValue = 'abc123xyz456';
  
  const mockRawData: RawRolResponse[] = [
    {
      ID_USUARIO: 1,
      COD_APLICACION: 'ADMIN',
      ROL: 'Administrador',
      TIPO_ROL: 'Sistema',
      INICIO_VIGENCIA: '2023-01-01T00:00:00',
      FIN_VIGENCIA: null,
      ESTADO_REG: 'A',
      FEC_ESTADO_REG: '2023-01-01T00:00:00',
      USUARIO_CREACION: 'admin',
      FECHA_CREACION: '2023-01-01T00:00:00',
      FUNCION_CREACION: 'crear',
      USUARIO_MODIF: 'admin',
      FECHA_MODIF: '2023-01-02T00:00:00',
      FUNCION_MODIF: 'modificar'
    },
    {
      ID_USUARIO: 2,
      COD_APLICACION: 'USER',
      ROL: 'Usuario',
      TIPO_ROL: 'Aplicación',
      INICIO_VIGENCIA: '2023-01-01T00:00:00',
      FIN_VIGENCIA: '2025-01-01T00:00:00',
      ESTADO_REG: 'A',
      FEC_ESTADO_REG: '2023-01-01T00:00:00',
      USUARIO_CREACION: 'admin',
      FECHA_CREACION: '2023-01-01T00:00:00',
      FUNCION_CREACION: 'crear',
      USUARIO_MODIF: 'admin',
      FECHA_MODIF: '2023-01-02T00:00:00',
      FUNCION_MODIF: 'modificar'
    }
  ];
  
  const mockFormattedData: RolResponse[] = [
    {
      IdUsuario: 1,
      CodApp: 'ADMIN',
      Rol: 'Administrador',
      TipoRol: 'Sistema',
      InicioVigencia: new Date('2023-01-01T00:00:00'),
      EstadoReg: 'A',
      FecEstadoReg: new Date('2023-01-01T00:00:00'),
      UsuarioCreacion: 'admin',
      FechaCreacion: new Date('2023-01-01T00:00:00'),
      FuncionCreacion: 'crear',
      UsuarioModificacion: 'admin',
      FechaModificacion: new Date('2023-01-02T00:00:00'),
      FuncionModificacion: 'modificar'
    },
    {
      IdUsuario: 2,
      CodApp: 'USER',
      Rol: 'Usuario',
      TipoRol: 'Aplicación',
      InicioVigencia: new Date('2023-01-01T00:00:00'),
      FinVigencia: new Date('2025-01-01T00:00:00'),
      EstadoReg: 'A',
      FecEstadoReg: new Date('2023-01-01T00:00:00'),
      UsuarioCreacion: 'admin',
      FechaCreacion: new Date('2023-01-01T00:00:00'),
      FuncionCreacion: 'crear',
      UsuarioModificacion: 'admin',
      FechaModificacion: new Date('2023-01-02T00:00:00'),
      FuncionModificacion: 'modificar'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debería obtener roles correctamente cuando la API responde con éxito', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue(mockRawData)
    };
    
    (EnvModule.FetchWithTimeout as jest.Mock).mockResolvedValue(mockResponse);
    (MapperModule.mapRawArrayToRolResponseArray as jest.Mock).mockReturnValue(mockFormattedData);

    const result = await ApiRoles(mockEmail);

    expect(EnvModule.GetApiArquitectura).toHaveBeenCalledTimes(1);
    expect(EnvModule.GetSistema).toHaveBeenCalledTimes(1);
    expect(EnvModule.GetNameApiKey).toHaveBeenCalledTimes(1);
    expect(EnvModule.GetKeyApiKey).toHaveBeenCalledTimes(1);
    
    expect(EnvModule.FetchWithTimeout).toHaveBeenCalledWith(
      `${mockApiUrl}/Rol/mail/${mockEmail}/app/${mockSistemaCodigo}`,
      {
        method: 'GET',
        headers: {
          [mockApiKeyName]: mockApiKeyValue,
          'Content-Type': 'application/json; charset=utf-8',
        }
      }
    );
    
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    
    expect(MapperModule.mapRawArrayToRolResponseArray).toHaveBeenCalledWith(mockRawData);
    
    expect(result).toEqual(mockFormattedData);
  });

  test('debería lanzar un error cuando la API responde con error', async () => {
    const mockErrorStatus = 404;
    const mockErrorStatusText = 'Not Found';
    
    const mockResponse = {
      ok: false,
      status: mockErrorStatus,
      statusText: mockErrorStatusText,
    };
    
    (EnvModule.FetchWithTimeout as jest.Mock).mockResolvedValue(mockResponse);

    await expect(ApiRoles(mockEmail)).rejects.toThrow(
      `Error al obtener roles para ${mockEmail}: ${mockErrorStatus} - ${mockErrorStatusText}`
    );
    
    expect(MapperModule.mapRawArrayToRolResponseArray).not.toHaveBeenCalled();
  });

  test('debería manejar errores de red durante la petición fetch', async () => {
    const networkError = new Error('Network error');
    (EnvModule.FetchWithTimeout as jest.Mock).mockRejectedValue(networkError);

    await expect(ApiRoles(mockEmail)).rejects.toThrow(
      `Error al obtener roles para ${mockEmail}: Network error`
    );
    
    expect(MapperModule.mapRawArrayToRolResponseArray).not.toHaveBeenCalled();
  });

  test('debería manejar errores no instancias de Error', async () => {
    const nonErrorObject = 'String de error en lugar de objeto Error';
    (EnvModule.FetchWithTimeout as jest.Mock).mockRejectedValue(nonErrorObject);

    await expect(ApiRoles(mockEmail)).rejects.toThrow(
      `Error al obtener roles para ${mockEmail}: ${nonErrorObject}`
    );
    
    expect(MapperModule.mapRawArrayToRolResponseArray).not.toHaveBeenCalled();
  });

  test('debería manejar errores durante el mapeo de datos', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue(mockRawData)
    };
    
    const mappingError = new Error('Error durante el mapeo');
    
    (EnvModule.FetchWithTimeout as jest.Mock).mockResolvedValue(mockResponse);
    (MapperModule.mapRawArrayToRolResponseArray as jest.Mock).mockImplementation(() => {
      throw mappingError;
    });

    await expect(ApiRoles(mockEmail)).rejects.toThrow(
      `Error al obtener roles para ${mockEmail}: Error durante el mapeo`
    );
    
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    
    expect(MapperModule.mapRawArrayToRolResponseArray).toHaveBeenCalledWith(mockRawData);
  });
  
  test('debería manejar errores durante la extracción de JSON de la respuesta', async () => {
    const jsonError = new Error('Invalid JSON');
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockRejectedValue(jsonError)
    };
    
    (EnvModule.FetchWithTimeout as jest.Mock).mockResolvedValue(mockResponse);

    await expect(ApiRoles(mockEmail)).rejects.toThrow(
      `Error al obtener roles para ${mockEmail}: Invalid JSON`
    );
    
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    
    expect(MapperModule.mapRawArrayToRolResponseArray).not.toHaveBeenCalled();
  });
});

describe('ApiGetUsuarioAd', () => {
  const mockEmail = 'usuario@ejemplo.com';
  const mockApiUrl = 'https://api.ejemplo.com';
  const mockApiKeyName = 'X-API-KEY';
  const mockApiKeyValue = 'abc123xyz456';
  
  const mockRawUsuarioData: RawUsuarioAD = {
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

  const mockFormattedUsuarioData: UsuarioAd = {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe obtener el usuario correctamente cuando la API responde 200', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue(mockRawUsuarioData)
    };
    
    (EnvModule.FetchWithTimeout as jest.Mock).mockResolvedValue(mockResponse);
    (ModuleUserAd.mapRawToUsuarioAd as jest.Mock).mockReturnValue(mockFormattedUsuarioData);

    const result = await ApiGetUsuarioAd(mockEmail);

    expect(EnvModule.GetApiArquitectura).toHaveBeenCalledTimes(1);
    expect(EnvModule.GetNameApiKey).toHaveBeenCalledTimes(1);
    expect(EnvModule.GetKeyApiKey).toHaveBeenCalledTimes(1);
    
    expect(EnvModule.FetchWithTimeout).toHaveBeenCalledWith(
      `${mockApiUrl}/Usuario/mail/${mockEmail}`,
      {
        method: 'GET',
        headers: {
          [mockApiKeyName]: mockApiKeyValue,
          'Content-Type': 'application/json; charset=utf-8',
        }
      }
    );
    
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    
    expect(ModuleUserAd.mapRawToUsuarioAd).toHaveBeenCalledWith(mockRawUsuarioData);

    expect(result).toEqual(mockFormattedUsuarioData);
  });

  test('debe lanzar un error cuando la API responde con error', async () => {
    const mockErrorStatus = 404;
    const mockErrorStatusText = 'Not Found';
    
    const mockResponse = {
      ok: false,
      status: mockErrorStatus,
      statusText: mockErrorStatusText,
    };
    
    (EnvModule.FetchWithTimeout as jest.Mock).mockResolvedValue(mockResponse);

    await expect(ApiGetUsuarioAd(mockEmail)).rejects.toThrow(
      `Error al obtener roles para ${mockEmail}: ${mockErrorStatus} - ${mockErrorStatusText}`
    );
    
    expect(ModuleUserAd.mapRawToUsuarioAd).not.toHaveBeenCalled();
  });

  test('debería manejar errores de red durante la petición fetch', async () => {
    const networkError = new Error('Network error');
    (EnvModule.FetchWithTimeout as jest.Mock).mockRejectedValue(networkError);

    await expect(ApiGetUsuarioAd(mockEmail)).rejects.toThrow(
      `Error al obtener roles para ${mockEmail}: Network error`
    );
    
    expect(ModuleUserAd.mapRawToUsuarioAd).not.toHaveBeenCalled();
  });

  test('debería manejar errores no instancias de Error', async () => {
    const nonErrorObject = 'String de error en lugar de objeto Error';
    (EnvModule.FetchWithTimeout as jest.Mock).mockRejectedValue(nonErrorObject);

    await expect(ApiGetUsuarioAd(mockEmail)).rejects.toThrow(
      `Error al obtener roles para ${mockEmail}: ${nonErrorObject}`
    );
    
    expect(ModuleUserAd.mapRawToUsuarioAd).not.toHaveBeenCalled();
  });

  test('debería manejar errores durante el mapeo de datos', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue(mockRawUsuarioData)
    };
    
    const mappingError = new Error('Error durante el mapeo');
    
    (EnvModule.FetchWithTimeout as jest.Mock).mockResolvedValue(mockResponse);
    (ModuleUserAd.mapRawToUsuarioAd as jest.Mock).mockImplementation(() => {
      throw mappingError;
    });

    await expect(ApiGetUsuarioAd(mockEmail)).rejects.toThrow(
      `Error al obtener roles para ${mockEmail}: Error durante el mapeo`
    );
    
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    
    expect(ModuleUserAd.mapRawToUsuarioAd).toHaveBeenCalledWith(mockRawUsuarioData);
  });
  
  test('debería manejar errores durante la extracción de JSON de la respuesta', async () => {
    const jsonError = new Error('Invalid JSON');
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockRejectedValue(jsonError)
    };
    
    (EnvModule.FetchWithTimeout as jest.Mock).mockResolvedValue(mockResponse);

    await expect(ApiGetUsuarioAd(mockEmail)).rejects.toThrow(
      `Error al obtener roles para ${mockEmail}: Invalid JSON`
    );
    
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    
    expect(ModuleUserAd.mapRawToUsuarioAd).not.toHaveBeenCalled();
  });
});

describe('ApiGetMenus', () => {
  const mockRol = 'ADMIN';
  const mockApiUrl = 'https://api.ejemplo.com';
  const mockSistemaCodigo = 'SIS001';
  const mockApiKeyName = 'X-API-KEY';
  const mockApiKeyValue = 'abc123xyz456';
  
  const mockRawMenusData: RawMenusElemento[] = [
    {
      ID: 1,
      NOMBRE: 'Administración',
      DESCRIPCION: 'Menú de administración',
      ID_PADRE: 0,
      CONTROLADOR: 'Admin',
      ACCION: 'Index',
      ES_MENU: 'S',
      ORDEN: 1,
      COD_APLICACION: 'SIS001',
      NIVEL: 1,
      ESTADO_REG: 'A',
      FEC_ESTADO_REG: new Date('2023-01-01T00:00:00'),
      USUARIO_CREACION: 'admin',
      FECHA_CREACION: new Date('2023-01-01T00:00:00'),
      FUNCION_CREACION: 'crear',
      USUARIO_MODIF: 'admin',
      FECHA_MODIF: new Date('2023-01-01T00:00:00'),
      FUNCION_MODIF: 'modificar'
    },
    {
      ID: 2,
      NOMBRE: 'Usuarios',
      DESCRIPCION: 'Gestión de usuarios',
      ID_PADRE: 1,
      CONTROLADOR: 'Users',
      ACCION: 'Index',
      ES_MENU: 'S',
      ORDEN: 1,
      COD_APLICACION: 'SIS001',
      NIVEL: 2,
      ESTADO_REG: 'A',
      FEC_ESTADO_REG: new Date('2023-01-01T00:00:00'),
      USUARIO_CREACION: 'admin',
      FECHA_CREACION: new Date('2023-01-01T00:00:00'),
      FUNCION_CREACION: 'crear',
      USUARIO_MODIF: 'admin',
      FECHA_MODIF: new Date('2023-01-01T00:00:00'),
      FUNCION_MODIF: 'modificar'
    }
  ];
  
  const mockElementMenuData: ElementMenu[] = [
    {
      Id: 1,
      Nombre: 'Administración',
      Descripcion: 'Menú de administración',
      IdPadre: 0,
      Controlador: 'Admin',
      Accion: 'Index',
      EsMenu: 'S',
      Orden: 1,
      ConAplicion: 'SIS001',
      Nivel: 1,
      EstadoReg: 'A',
      FechaEstadoReg: new Date('2023-01-01T00:00:00'),
      UsuarioCreacion: 'admin',
      FechaCreacion: new Date('2023-01-01T00:00:00'),
      FuncionCreacion: 'crear',
      UsuarioModificacion: 'admin',
      FechaModificacion: new Date('2023-01-02T00:00:00'),
      FuncionModificacion: 'modificar'
    },
    {
      Id: 2,
      Nombre: 'Usuarios',
      Descripcion: 'Gestión de usuarios',
      IdPadre: 1,
      Controlador: 'Users',
      Accion: 'Index',
      EsMenu: 'S',
      Orden: 1,
      ConAplicion: 'SIS001',
      Nivel: 2,
      EstadoReg: 'A',
      FechaEstadoReg: new Date('2023-01-01T00:00:00'),
      UsuarioCreacion: 'admin',
      FechaCreacion: new Date('2023-01-01T00:00:00'),
      FuncionCreacion: 'crear',
      UsuarioModificacion: 'admin',
      FechaModificacion: new Date('2023-01-02T00:00:00'),
      FuncionModificacion: 'modificar'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debería devolver null si no se proporciona rol', async () => {
    const result = await ApiGetMenus('');
    
    expect(result).toBeNull();
    expect(EnvModule.FetchWithTimeout).not.toHaveBeenCalled();
  });

  test('debería obtener los menús correctamente cuando la API responde con éxito', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue(mockRawMenusData)
    };
    
    (EnvModule.FetchWithTimeout as jest.Mock).mockResolvedValue(mockResponse);
    (ModuleMenu.mapRawArrayToElementMenuArray as jest.Mock).mockReturnValue(mockElementMenuData);

    const result = await ApiGetMenus(mockRol);

    expect(EnvModule.GetApiArquitectura).toHaveBeenCalledTimes(1);
    expect(EnvModule.GetSistema).toHaveBeenCalledTimes(1);
    expect(EnvModule.GetNameApiKey).toHaveBeenCalledTimes(1);
    expect(EnvModule.GetKeyApiKey).toHaveBeenCalledTimes(1);
    
    expect(EnvModule.FetchWithTimeout).toHaveBeenCalledWith(
      `${mockApiUrl}/Elemento/${mockRol}/${mockSistemaCodigo}`,
      {
        method: 'GET',
        headers: {
          [mockApiKeyName]: mockApiKeyValue,
          'Content-Type': 'application/json; charset=utf-8',
        }
      }
    );
    
    expect(mockResponse.json).toHaveBeenCalledTimes(1);

    expect(ModuleMenu.mapRawArrayToElementMenuArray).toHaveBeenCalledWith(mockRawMenusData);
    
    expect(result).toEqual(mockElementMenuData);
  });

  test('debería lanzar un error cuando la API responde con error', async () => {
    const mockErrorStatus = 404;
    const mockErrorStatusText = 'Not Found';
    
    const mockResponse = {
      ok: false,
      status: mockErrorStatus,
      statusText: mockErrorStatusText,
    };
    
    (EnvModule.FetchWithTimeout as jest.Mock).mockResolvedValue(mockResponse);

    await expect(ApiGetMenus(mockRol)).rejects.toThrow(
      `Error al obtener roles para ${mockRol}: ${mockErrorStatus} - ${mockErrorStatusText}`
    );

    expect(ModuleMenu.mapRawArrayToElementMenuArray).not.toHaveBeenCalled();
  });

  test('debería manejar errores de red durante la petición fetch', async () => {
    const networkError = new Error('Network error');
    (EnvModule.FetchWithTimeout as jest.Mock).mockRejectedValue(networkError);

    await expect(ApiGetMenus(mockRol)).rejects.toThrow(
      `Error al obtener roles para ${mockRol}: Network error`
    );
    
    expect(ModuleMenu.mapRawArrayToElementMenuArray).not.toHaveBeenCalled();
  });

  test('debería manejar errores no instancias de Error', async () => {
    const nonErrorObject = 'String de error en lugar de objeto Error';
    (EnvModule.FetchWithTimeout as jest.Mock).mockRejectedValue(nonErrorObject);

    await expect(ApiGetMenus(mockRol)).rejects.toThrow(
      `Error al obtener roles para ${mockRol}: ${nonErrorObject}`
    );
    
    expect(ModuleMenu.mapRawArrayToElementMenuArray).not.toHaveBeenCalled();
  });

  test('debería manejar errores durante el mapeo de datos', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue(mockRawMenusData)
    };
    
    const mappingError = new Error('Error durante el mapeo');
    
    (EnvModule.FetchWithTimeout as jest.Mock).mockResolvedValue(mockResponse);
    (ModuleMenu.mapRawArrayToElementMenuArray as jest.Mock).mockImplementation(() => {
      throw mappingError;
    });

    await expect(ApiGetMenus(mockRol)).rejects.toThrow(
      `Error al obtener roles para ${mockRol}: Error durante el mapeo`
    );

    expect(mockResponse.json).toHaveBeenCalledTimes(1);

    expect(ModuleMenu.mapRawArrayToElementMenuArray).toHaveBeenCalledWith(mockRawMenusData);
  });
  
  test('debería manejar errores durante la extracción de JSON de la respuesta', async () => {
    const jsonError = new Error('Invalid JSON');
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockRejectedValue(jsonError)
    };
    
    (EnvModule.FetchWithTimeout as jest.Mock).mockResolvedValue(mockResponse);

    await expect(ApiGetMenus(mockRol)).rejects.toThrow(
      `Error al obtener roles para ${mockRol}: Invalid JSON`
    );
    
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    
    expect(ModuleMenu.mapRawArrayToElementMenuArray).not.toHaveBeenCalled();
  });
});