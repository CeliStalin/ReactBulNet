interface RolResponse{
    IdUsuario:number,
    CodApp:string,
    Rol:string,
    TipoRol:string,
    InicioVigencia:Date,
    FinVigencia?:Date,
    EstadoReg:string,
    FecEstadoReg:Date,
    UsuarioCreacion:string,
    FechaCreacion:Date,
    FuncionCreacion:string,
    UsuarioModificacion: string,
    FechaModificacion:Date,
    FuncionModificacion:string
}
export type{
    RolResponse 
}