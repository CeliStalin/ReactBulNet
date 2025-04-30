import { IUser, IUsuarioAD, IRol } from './IUserAz'

export interface IAuthConfig {
    clientId: string;
    authority: string;
    scopes: string[];
  }
  
  export interface IAuthResponse<T> {
    data: T;
    error: string;
  }
  
  export interface IAuthService {
    getMe(): Promise<IUser | string>;
    getUsuarioAD(email: string): Promise<IAuthResponse<IUsuarioAD>>;
    getRoles(email: string): Promise<IAuthResponse<IRol[]>>;
  }
  
  export interface IUseLocalStorage<T> {
    (key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void];
  }
  
  export type UseLocalStorageType = <T>(key: string, initialValue: T) => [T, (value: T | ((val: T) => T)) => void];
  export interface ILoginContextState {
    isSignedIn: boolean;
    usuario: IUser | null;
    usuarioAD: IUsuarioAD | null;
    roles: IRol[];
    loading: boolean;
    error: string;
    errorAD: string;
    errorRoles: string;
    login: () => Promise<void>;
    logout: () => Promise<void>;
  }