import { useQuery } from "@tanstack/react-query"

import { supabase } from "@/integrations/supabase/client"
import type { EventoConTotal } from "@/features/eventos/types"

/**
 * Lista de eventos con su total real calculado desde las ventas asociadas
 * (el total no se guarda fijo: se suma en vivo para que siempre sea exacto).
 */
export function useEventos() {
  return useQuery({
    queryKey: ["eventos", "lista"],
    queryFn: async (): Promise<EventoConTotal[]> => {
      const { data, error } = await supabase
        .from("eventos")
        .select("*, ventas(valor)")
        .order("created_at", { ascending: false })

      if (error) throw error

      return (data ?? []).map((e) => {
        const ventas = e.ventas ?? []
        return {
          ...e,
          ventas: undefined,
          total_ventas: ventas.reduce((acc, v) => acc + v.valor, 0),
          cantidad_ventas: ventas.length,
        } as unknown as EventoConTotal
      })
    },
  })
}

/** El evento actualmente activado (o null si no hay ninguno). */
export function useEventoActivo() {
  return useQuery({
    queryKey: ["eventos", "activo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .eq("estado", "activado")
        .maybeSingle()

      if (error) throw error
      return data
    },
  })
}
