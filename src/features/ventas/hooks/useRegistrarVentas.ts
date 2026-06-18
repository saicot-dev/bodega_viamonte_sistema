import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/integrations/supabase/client"
import type { LineaPedido } from "@/features/caja/types"
import type { MetodoPago } from "@/features/ventas/types"

type RegistrarVentasInput = {
  lineas: LineaPedido[]
  metodoPago: MetodoPago
  /** Evento activo al que se asocian las ventas. */
  eventoId: string
}

/**
 * Registra el pedido como ventas individuales: una fila por cada unidad de cada
 * producto (2 Fernet => 2 filas), todas con el método de pago elegido y
 * asociadas al evento activo. El valor guardado es el precio del producto al
 * momento de la venta.
 */
export function useRegistrarVentas() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ lineas, metodoPago, eventoId }: RegistrarVentasInput) => {
      const filas = lineas.flatMap((linea) =>
        Array.from({ length: linea.cantidad }, () => ({
          id_producto: linea.producto.id,
          valor: linea.producto.valor,
          metodo_pago: metodoPago,
          id_eventos: eventoId,
        })),
      )

      if (filas.length === 0) {
        throw new Error("El pedido está vacío")
      }

      const { error } = await supabase.from("ventas").insert(filas)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] })
      queryClient.invalidateQueries({ queryKey: ["eventos"] })
    },
  })
}
