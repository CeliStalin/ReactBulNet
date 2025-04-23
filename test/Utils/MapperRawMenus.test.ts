import { RawMenusElemento } from '../../src/interfaces/IRawMenusElmento'
import { mapRawToElementMenu, mapRawArrayToElementMenuArray } from '../../src/Utils/MapperRawMenus'


describe('Menu Mapper Functions', () => {
    // Datos de prueba
    const mockDate1 = new Date('2023-01-15T10:30:00');
    const mockDate2 = new Date('2023-02-20T14:45:00');
    const mockDate3 = new Date('2023-03-25T16:20:00');
    
    const rawMenuElement: RawMenusElemento = {
      ID: 1,
      NOMBRE: 'Menu Principal',
      DESCRIPCION: 'Menú principal de la aplicación',
      ID_PADRE: 0,
      CONTROLADOR: 'HomeController',
      ACCION: 'Index',
      ES_MENU: 'S',
      ORDEN: 1,
      COD_APLICACION: 'APP01',
      NIVEL: 1,
      ESTADO_REG: 'A',
      FEC_ESTADO_REG: mockDate1,
      USUARIO_CREACION: 'admin',
      FECHA_CREACION: mockDate2,
      FUNCION_CREACION: 'CrearMenu',
      USUARIO_MODIF: 'supervisor',
      FECHA_MODIF: mockDate3,
      FUNCION_MODIF: 'ModificarMenu'
    };
  
    const rawMenuElementStringDates: RawMenusElemento = {
      ...rawMenuElement,
      FEC_ESTADO_REG: '2023-01-15T10:30:00' as unknown as Date,
      FECHA_CREACION: '2023-02-20T14:45:00' as unknown as Date,
      FECHA_MODIF: '2023-03-25T16:20:00' as unknown as Date
    };
  
    const rawMenuElementArray: RawMenusElemento[] = [
      rawMenuElement,
      {
        ...rawMenuElement,
        ID: 2,
        NOMBRE: 'Submenu',
        DESCRIPCION: 'Submenú de la aplicación',
        ID_PADRE: 1
      }
    ];
  
    describe('mapRawToElementMenu', () => {
      it('debería mapear correctamente los datos de RawMenusElemento a ElementMenu', () => {
        const result = mapRawToElementMenu(rawMenuElement);
        
        expect(result).toEqual({
          Id: 1,
          Nombre: 'Menu Principal',
          Descripcion: 'Menú principal de la aplicación',
          IdPadre: 0,
          Controlador: 'HomeController',
          Accion: 'Index',
          EsMenu: 'S',
          Orden: 1,
          ConAplicion: 'APP01',
          Nivel: 1,
          EstadoReg: 'A',
          FechaEstadoReg: mockDate1,
          UsuarioCreacion: 'admin',
          FechaCreacion: mockDate2,
          FuncionCreacion: 'CrearMenu',
          UsuarioModificacion: 'supervisor',
          FechaModificacion: mockDate3,
          FuncionModificacion: 'ModificarMenu'
        });
      });
  
      test('debería convertir correctamente las cadenas de texto de fechas a objetos Date', () => {
        const result = mapRawToElementMenu(rawMenuElementStringDates);
        
        expect(result.FechaEstadoReg).toBeInstanceOf(Date);
        expect(result.FechaCreacion).toBeInstanceOf(Date);
        expect(result.FechaModificacion).toBeInstanceOf(Date);
        
        expect(result.FechaEstadoReg.toISOString()).toBe(mockDate1.toISOString());
        expect(result.FechaCreacion.toISOString()).toBe(mockDate2.toISOString());
        expect(result.FechaModificacion.toISOString()).toBe(mockDate3.toISOString());
      });
  
      test('debería conservar las fechas si ya son instancias de Date', () => {
        const result = mapRawToElementMenu(rawMenuElement);
        
        expect(result.FechaEstadoReg).toBe(rawMenuElement.FEC_ESTADO_REG);
        expect(result.FechaCreacion).toBe(rawMenuElement.FECHA_CREACION);
        expect(result.FechaModificacion).toBe(rawMenuElement.FECHA_MODIF);
      });
    });
  
    describe('mapRawArrayToElementMenuArray', () => {
      it('debería mapear correctamente un array de RawMenusElemento a array de ElementMenu', () => {
        const result = mapRawArrayToElementMenuArray(rawMenuElementArray);
        
        expect(result).toHaveLength(2);
        expect(result[0].Id).toBe(1);
        expect(result[0].Nombre).toBe('Menu Principal');
        expect(result[1].Id).toBe(2);
        expect(result[1].Nombre).toBe('Submenu');
        expect(result[1].IdPadre).toBe(1);
      });
  
      test('debería devolver un array vacío cuando se proporciona un array vacío', () => {
        const result = mapRawArrayToElementMenuArray([]);
        expect(result).toHaveLength(0);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });
