import type { Tables } from "@/integrations/supabase/types"

export type Evento = Tables<"eventos">

export type EstadoEvento = "sin_fecha" | "activado" | "terminado"

/** Etiquetas legibles de cada estado, para la UI. */
export const ESTADOS_EVENTO: Record<EstadoEvento, string> = {
  sin_fecha: "Sin fecha",
  activado: "Activado",
  terminado: "Terminado",
}

export function etiquetaEstado(estado: string): string {
  return ESTADOS_EVENTO[estado as EstadoEvento] ?? estado
}

/** Evento con su total real calculado desde las ventas asociadas. */
export type EventoConTotal = Evento & {
  total_ventas: number
  cantidad_ventas: number
}
