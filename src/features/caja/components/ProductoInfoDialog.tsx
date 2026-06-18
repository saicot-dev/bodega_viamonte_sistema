import { useDescripcionProducto } from "@/features/caja/hooks/useDescripcionProducto"
import { SinImagen } from "@/features/caja/components/SinImagen"
import type { Producto } from "@/features/caja/types"
import { formatCurrency } from "@/shared/utils/formatCurrency"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Skeleton } from "@/shared/components/ui/skeleton"

type ProductoInfoDialogProps = {
  producto: Producto
  abierto: boolean
  onOpenChange: (abierto: boolean) => void
}

export function ProductoInfoDialog({
  producto,
  abierto,
  onOpenChange,
}: ProductoInfoDialogProps) {
  const { data: ficha, isLoading, isError } = useDescripcionProducto(
    producto.id,
    abierto,
  )

  const tieneContenido =
    !!ficha && (ficha.descripcion.trim() !== "" || ficha.ingredientes.length > 0)

  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen w-screen max-w-none rounded-none p-0 sm:rounded-none">
        <div className="grid h-full grid-rows-[auto_1fr] md:grid-cols-2 md:grid-rows-1">
          {/* Izquierda: información */}
          <div className="flex flex-col overflow-y-auto p-8">
            <DialogHeader className="text-left">
              <DialogTitle className="text-3xl">
                {producto.nombre_producto}
              </DialogTitle>
              <p className="text-lg text-muted-foreground">
                {formatCurrency(producto.valor)}
              </p>
            </DialogHeader>

            <div className="mt-8 flex-1">
              {isLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              )}

              {isError && (
                <p className="text-sm text-destructive">
                  No se pudo cargar la información del producto.
                </p>
              )}

              {!isLoading && !isError && !tieneContenido && (
                <p className="text-muted-foreground">
                  Este producto todavía no tiene información cargada.
                </p>
              )}

              {!isLoading && !isError && tieneContenido && (
                <div className="space-y-8">
                  {ficha!.descripcion.trim() !== "" && (
                    <div>
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                        Descripción
                      </h3>
                      <p className="text-base leading-relaxed">
                        {ficha!.descripcion}
                      </p>
                    </div>
                  )}

                  {ficha!.ingredientes.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                        Ingredientes
                      </h3>
                      <ul className="space-y-1.5">
                        {ficha!.ingredientes.map((ing, i) => (
                          <li
                            key={`${ing.nombre}-${i}`}
                            className="flex items-baseline justify-between gap-4 border-b pb-1.5 text-base last:border-b-0"
                          >
                            <span>{ing.nombre}</span>
                            {ing.cantidad && (
                              <span className="text-muted-foreground">
                                {ing.cantidad}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Derecha: foto */}
          <div className="flex items-center justify-center overflow-hidden bg-muted">
            {producto.imagen ? (
              <img
                src={producto.imagen}
                alt={producto.nombre_producto}
                className="h-full w-full object-cover"
              />
            ) : (
              <SinImagen iconClassName="h-24 w-24" />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
