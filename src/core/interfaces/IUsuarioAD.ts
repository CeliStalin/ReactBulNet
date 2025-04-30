import { UserExterno } from './IUserExterno'

interface UsuarioAd{
    IdUsuario:number,
    UserName:string,
    TipoUsuario:string,
    Cargo:number,
    UnorCorrelativo:number,
    TipoEmpleado:string,
    TicvCodigo:string,
    TiavCodigo:string,
    Rut:number,
    Dv:string,
    UsuarioExterno:UserExterno,
    EstadoReg:string,
    FechaEstadoRegistro:Date,
    UsuarioCreacion:string,
    FechaCreacion:Date,
    FuncionCreacion:string,
    UsuarioModificacion:string,
    FechaModificacion:Date,
    FuncionModificacion:string
}
export type{
    UsuarioAd
}