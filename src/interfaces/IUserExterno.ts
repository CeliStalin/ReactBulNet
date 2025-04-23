interface UserExterno{
    UsuarioAdId:number,
    PassEncriptado:string,
    Iv:string,
    Nombres:string,
    ApellidoPaterno:string,
    ApellidoMaterno:string,
    Email:string,
    Telefono:string,
    Bloqueado:string,
    DebeCambiar:string,
    IntentosFallidos:number,
    CodigoPromotor:string,
    EstadoReg:string,
    FechaEstadoRegistro:Date,
    UsuarioCreacion:string,
    FechaCreacion:Date,
    UsuarioModificacion:string,
    FechaModificacion:Date,
    FuncionModificacion:string
}
export type {
    UserExterno
}