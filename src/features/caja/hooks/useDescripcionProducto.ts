import { useQuery } from "@tanstack/react-query"

import { supabase } from "@/integrations/supabase/client"
import type { FichaProducto, Ingrediente } from "@/features/caja/types"

/**
 * Ficha de un producto: descripción (texto) e ingredientes. Solo consulta
 * cuando `habilitado` es true (el modal lo activa al abrirse). Devuelve null si
 * el producto todavía no tiene ficha cargada.
 */
export function useDescripcionProducto(
  productoId: string,
  habilitado: boolean,
) {
  return useQuery({
    queryKey: ["caja", "descripcion", productoId],
    enabled: habilitado,
    queryFn: async (): Promise<FichaProducto | null> => {
      const { data, error } = await supabase
        .from("descripcion_productos")
        .select("descripcion, ingredientes")
        .eq("id_producto", productoId)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      const ingredientes = Array.isArray(data.ingredientes)
        ? (data.ingredientes as Ingrediente[])
        : []

      return {
        descripcion: data.descripcion ?? "",
        ingredientes,
      }
    },
  })
}
