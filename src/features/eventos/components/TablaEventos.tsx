import type { EventoConTotal } from "@/features/eventos/types"
import { etiquetaEstado } from "@/features/eventos/types"
import {
  useActivarEvento,
  useTerminarEvento,
} from "@/features/eventos/hooks/useEventosMutations"
import { formatCurrency } from "@/shared/utils/formatCurrency"
import { formatDate } from "@/shared/utils/formatDate"
import { cn } from "@/shared/utils/cn"
import { Button } from "@/shared/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"

type TablaEventosProps = {
  eventos: EventoConTotal[]
}

export function TablaEventos({ eventos }: TablaEventosProps) {
  const activar = useActivarEvento()
  const terminar = useTerminarEvento()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Evento</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {eventos.map((evento) => (
          <TableRow key={evento.id}>
            <TableCell className="font-medium">{evento.nombre}</TableCell>
            <TableCell className="text-muted-foreground">
              {evento.fecha ? formatDate(evento.fecha) : "—"}
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium",
                  evento.estado === "activado" &&
                    "border-primary bg-primary text-primary-foreground",
                  evento.estado === "terminado" && "text-muted-foreground",
                )}
              >
                {etiquetaEstado(evento.estado)}
              </span>
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(evento.total_ventas)}
            </TableCell>
            <TableCell className="text-right">
              {evento.estado !== "activado" && evento.estado !== "terminado" && (
                <Button
                  size="sm"
                  onClick={() => activar.mutate(evento.id)}
                  disabled={activar.isPending}
                >
                  Activar
                </Button>
              )}
              {evento.estado === "activado" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => terminar.mutate(evento.id)}
                  disabled={terminar.isPending}
                >
                  Terminar
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
