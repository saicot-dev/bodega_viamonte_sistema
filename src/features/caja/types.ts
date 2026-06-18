import type { Tables } from "@/integrations/supabase/types"

/** Producto del catálogo, tal como viene de la base. */
export type Producto = Tables<"productos">

/** Una línea del pedido en curso (producto + cantidad). Vive solo en memoria. */
export type LineaPedido = {
  producto: Producto
  cantidad: number
}

/** Un ingrediente de la receta del producto. */
export type Ingrediente = {
  nombre: string
  cantidad?: string
}

/** Ficha del producto: descripción en texto + lista de ingredientes. */
export type FichaProducto = {
  descripcion: string
  ingredientes: Ingrediente[]
}
