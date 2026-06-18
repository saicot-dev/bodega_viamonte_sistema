import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { eventoSchema, type EventoFormValues } from "@/features/eventos/schema"
import { useCrearEvento } from "@/features/eventos/hooks/useEventosMutations"
import { useToast } from "@/shared/hooks/use-toast"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"

type NuevoEventoDialogProps = {
  abierto: boolean
  onOpenChange: (abierto: boolean) => void
}

export function NuevoEventoDialog({
  abierto,
  onOpenChange,
}: NuevoEventoDialogProps) {
  const crear = useCrearEvento()
  const { toast } = useToast()

  const form = useForm<EventoFormValues>({
    resolver: zodResolver(eventoSchema),
    defaultValues: { nombre: "", fecha: "" },
  })

  function handleSubmit(values: EventoFormValues) {
    crear.mutate(
      { nombre: values.nombre, fecha: values.fecha || null },
      {
        onSuccess: () => {
          toast({ title: "Evento creado" })
          form.reset()
          onOpenChange(false)
        },
        onError: (error) => {
          toast({
            title: "No se pudo crear el evento",
            description: "Intentá de nuevo.",
            variant: "destructive",
          })
          if (import.meta.env.DEV) console.error(error)
        },
      },
    )
  }

  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo evento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Fiesta de fin de año" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha (opcional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={crear.isPending}
            >
              {crear.isPending ? "Creando…" : "Crear evento"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
