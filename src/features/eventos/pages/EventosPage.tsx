import { useState } from "react"
import { Plus } from "lucide-react"

import { useEventos } from "@/features/eventos/hooks/useEventos"
import { TablaEventos } from "@/features/eventos/components/TablaEventos"
import { NuevoEventoDialog } from "@/features/eventos/components/NuevoEventoDialog"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function EventosPage() {
  const { data: eventos, isLoading, isError } = useEventos()
  const [nuevoAbierto, setNuevoAbierto] = useState(false)

  const totalEventos = eventos?.length ?? 0

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Eventos</h1>
          <p className="text-sm text-muted-foreground">
            Creá, activá y terminá los eventos del sistema.
          </p>
        </div>
        <Button onClick={() => setNuevoAbierto(true)}>
          <Plus />
          Nuevo evento
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          )}

          {isError && (
            <p className="text-sm text-destructive">
              No se pudieron cargar los eventos. Intentá recargar la página.
            </p>
          )}

          {!isLoading && !isError && totalEventos === 0 && (
            <p className="text-sm text-muted-foreground">
              Todavía no hay eventos. Creá el primero con “Nuevo evento”.
            </p>
          )}

          {!isLoading && !isError && totalEventos > 0 && (
            <TablaEventos eventos={eventos!} />
          )}
        </CardContent>
      </Card>

      <NuevoEventoDialog abierto={nuevoAbierto} onOpenChange={setNuevoAbierto} />
    </section>
  )
}
