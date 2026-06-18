export type Rol = "admin" | "caja"

export type Usuario = {
  id: string
  nombre: string
  email: string
  rol: Rol
}
