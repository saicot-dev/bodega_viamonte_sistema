import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/integrations/supabase/client"

function invalidar(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["eventos"] })
}

type CrearEventoInput = {
  nombre: string
  fecha: string | null
}

/** Crea un evento nuevo (estado inicial: sin_fecha o sin fecha indicada). */
export function useCrearEvento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ nombre, fecha }: CrearEventoInput) => {
      const { error } = await supabase
        .from("eventos")
        .insert({ nombre, fecha, estado: "sin_fecha" })
      if (error) throw error
    },
    onSuccess: () => invalidar(queryClient),
  })
}

/**
 * Activa un evento. Como solo puede haber uno activado a la vez, primero pasa
 * a 'terminado' cualquier otro que estuviera activado.
 */
export function useActivarEvento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (eventoId: string) => {
      const { error: errTerminar } = await supabase
        .from("eventos")
        .update({ estado: "terminado" })
        .eq("estado", "activado")
        .neq("id", eventoId)
      if (errTerminar) throw errTerminar

      const { error } = await supabase
        .from("eventos")
        .update({ estado: "activado" })
        .eq("id", eventoId)
      if (error) throw error
    },
    onSuccess: () => invalidar(queryClient),
  })
}

/** Marca un evento como terminado. */
export function useTerminarEvento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (eventoId: string) => {
      const { error } = await supabase
        .from("eventos")
        .update({ estado: "terminado" })
        .eq("id", eventoId)
      if (error) throw error
    },
    onSuccess: () => invalidar(queryClient),
  })
}
