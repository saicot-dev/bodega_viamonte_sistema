import { useQuery } from "@tanstack/react-query"

import { supabase } from "@/integrations/supabase/client"
import type { Producto } from "@/features/caja/types"

/**
 * Lista de productos activos del catálogo. La política RLS ya filtra los
 * productos con deleted_at, pero lo dejamos explícito por claridad.
 */
export function useProductos() {
  return useQuery({
    queryKey: ["caja", "productos"],
    queryFn: async (): Promise<Producto[]> => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .is("deleted_at", null)
        .order("nombre_producto", { ascending: true })

      if (error) throw error
      return data
    },
  })
}
