import { useVentasDelDia } from "@/features/ventas/hooks/useVentasDelDia"
import { TablaVentas } from "@/features/ventas/components/TablaVentas"
import { formatCurrency } from "@/shared/utils/formatCurrency"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function VentasPage() {
  const { data: ventas, isLoading, isError } = useVentasDelDia()

  const recaudado = (ventas ?? []).reduce((acc, v) => acc + v.valor, 0)
  const operaciones = ventas?.length ?? 0

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
          <p className="text-sm text-muted-foreground">
            Registro de las ventas de hoy.
          </p>
        </div>

        {/* Resumen del día, arriba a la derecha */}
        <div className="flex gap-3">
          <Card className="min-w-36">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground">
                Recaudado del día
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">
                {formatCurrency(recaudado)}
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-36">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground">
                Operaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">
                {operaciones}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ventas registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          )}

          {isError && (
            <p className="text-sm text-destructive">
              No se pudieron cargar las ventas. Intentá recargar la página.
            </p>
          )}

          {!isLoading && !isError && operaciones === 0 && (
            <p className="text-sm text-muted-foreground">
              Todavía no hay ventas registradas hoy.
            </p>
          )}

          {!isLoading && !isError && operaciones > 0 && (
            <TablaVentas ventas={ventas!} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}
