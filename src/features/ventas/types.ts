export type MetodoPago = "efectivo" | "tarjeta" | "transferencia"

/** Etiquetas legibles de cada método de pago, para la UI. */
export const METODOS_PAGO: ReadonlyArray<{
  valor: MetodoPago
  etiqueta: string
}> = [
  { valor: "efectivo", etiqueta: "Efectivo" },
  { valor: "tarjeta", etiqueta: "Tarjeta" },
  { valor: "transferencia", etiqueta: "Transferencia" },
]

export function etiquetaMetodoPago(metodo: string): string {
  return METODOS_PAGO.find((m) => m.valor === metodo)?.etiqueta ?? metodo
}

/** Una venta con el nombre del producto resuelto (para la tabla de registro). */
export type VentaConProducto = {
  id: string
  valor: number
  metodo_pago: string
  created_at: string
  nombre_producto: string
}
