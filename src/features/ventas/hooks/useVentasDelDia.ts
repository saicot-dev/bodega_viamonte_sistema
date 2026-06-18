import { useQuery } from "@tanstack/react-query"

import { supabase } from "@/integrations/supabase/client"
import type { VentaConProducto } from "@/features/ventas/types"

function inicioDeHoyISO(): string {
  const ahora = new Date()
  const inicio = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate(),
  )
  return inicio.toISOString()
}

/**
 * Ventas registradas en el día de hoy, con el nombre del producto resuelto,
 * ordenadas de la más reciente a la más antigua.
 */
export function useVentasDelDia() {
  return useQuery({
    queryKey: ["ventas", "del-dia"],
    queryFn: async (): Promise<VentaConProducto[]> => {
      const { data, error } = await supabase
        .from("ventas")
        .select("id, valor, metodo_pago, created_at, productos(nombre_producto)")
        .gte("created_at", inicioDeHoyISO())
        .order("created_at", { ascending: false })

      if (error) throw error

      return (data ?? []).map((v) => ({
        id: v.id,
        valor: v.valor,
        metodo_pago: v.metodo_pago,
        created_at: v.created_at,
        nombre_producto: v.productos?.nombre_producto ?? "Producto eliminado",
      }))
    },
  })
}
