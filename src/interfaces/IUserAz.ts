export interface IUser {
    id: string;
    displayName: string;
    givenName?: string;
    surname?: string;
    userPrincipalName: string;
    mail?: string;
    jobTitle?: string;
    mobilePhone?: string;
    officeLocation?: string;
    preferredLanguage?: string;
    photo?: string;
  }
  
  export interface IUsuarioAD {
    id: number;
    identificacion: string;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    correo: string;
    activo: boolean;
    telefono?: string;
    fechaCreacion: Date;
    fechaModificacion?: Date;
  }
  
  export interface IRol {
    id: number;
    nombre: string;
    descripcion?: string;
    activo: boolean;
  }
  
  export interface IAuthState {
    isSignedIn: boolean;
    usuario: IUser | null;
    usuarioAD: IUsuarioAD | null;
    roles: IRol[];
    loading: boolean;
    error?: string;
    errorAD?: string;
    errorRoles?: string;
  }