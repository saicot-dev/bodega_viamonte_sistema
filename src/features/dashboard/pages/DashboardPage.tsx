import { useEventos } from "@/features/eventos/hooks/useEventos"
import { formatCurrency } from "@/shared/utils/formatCurrency"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function DashboardPage() {
  const { data: eventos, isLoading, isError } = useEventos()

  const recaudadoTotal = (eventos ?? []).reduce(
    (acc, e) => acc + e.total_ventas,
    0,
  )
  const ventasTotales = (eventos ?? []).reduce(
    (acc, e) => acc + e.cantidad_ventas,
    0,
  )
  const totalEventos = eventos?.length ?? 0

  return (
    <section className="mx-auto max-w-6xl">
      <h1 className="mb-1 text-3xl font-bold text-foreground">Dashboard</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Panel de control del administrador.
      </p>

      {isError && (
        <p className="text-sm text-destructive">
          No se pudo cargar el resumen. Intentá recargar la página.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <ResumenCard
          titulo="Recaudado total"
          valor={formatCurrency(recaudadoTotal)}
          cargando={isLoading}
        />
        <ResumenCard
          titulo="Ventas totales"
          valor={String(ventasTotales)}
          cargando={isLoading}
        />
        <ResumenCard
          titulo="Eventos"
          valor={String(totalEventos)}
          cargando={isLoading}
        />
      </div>
    </section>
  )
}

function ResumenCard({
  titulo,
  valor,
  cargando,
}: {
  titulo: string
  valor: string
  cargando: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-foreground">
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cargando ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-2xl font-semibold tabular-nums">{valor}</p>
        )}
      </CardContent>
    </Card>
  )
}
