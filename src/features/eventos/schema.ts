import { z } from "zod"

export const eventoSchema = z.object({
  nombre: z.string().min(1, "Ingresá un nombre para el evento"),
  fecha: z.string().optional(),
})

export type EventoFormValues = z.infer<typeof eventoSchema>
