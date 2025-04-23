interface ElementMenu{
    Id:number,
    Nombre:string,
    Descripcion:string,
    IdPadre:number,
    Controlador:string,
    Accion:string,
    EsMenu:string,
    Orden:number,
    ConAplicion:string,
    Nivel:number,
    EstadoReg:string,
    FechaEstadoReg:Date,
    UsuarioCreacion:string,
    FechaCreacion:Date,
    FuncionCreacion:string,
    UsuarioModificacion:string,
    FechaModificacion:Date,
    FuncionModificacion:string
}
export type{
    ElementMenu
}