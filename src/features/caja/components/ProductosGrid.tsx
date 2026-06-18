import { useProductos } from "@/features/caja/hooks/useProductos"
import { ProductoCard } from "@/features/caja/components/ProductoCard"
import type { Producto } from "@/features/caja/types"
import { cn } from "@/shared/utils/cn"
import { Skeleton } from "@/shared/components/ui/skeleton"

type ProductosGridProps = {
  /** Si se omite, la grilla es solo informativa (carta de productos). */
  onAgregar?: (producto: Producto) => void
  /** Unidades en el carrito por producto. Si se omite, no muestra badges. */
  cantidadEnPedido?: (productoId: string) => number
  /**
   * Si es true, la grilla llena el alto disponible repartiendo las filas y
   * scrollea internamente solo si desbordan (modo Caja en tablet). Si es false,
   * la grilla tiene alto natural y scrollea con la página (modo carta).
   */
  altoCompleto?: boolean
  /** Modo carta (Clientes): tocar la tarjeta abre la descripción, sin botón. */
  abrirDescripcionAlTocar?: boolean
}

export function ProductosGrid({
  onAgregar,
  cantidadEnPedido,
  altoCompleto = false,
  abrirDescripcionAlTocar = false,
}: ProductosGridProps) {
  const { data: productos, isLoading, isError } = useProductos()

  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive">
        No se pudieron cargar los productos. Intentá recargar la página.
      </div>
    )
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Todavía no hay productos cargados. Los productos los carga el administrador.
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid grid-cols-5 gap-4",
        altoCompleto && "min-h-0 flex-1 auto-rows-fr overflow-y-auto",
      )}
    >
      {productos.map((producto) => (
        <ProductoCard
          key={producto.id}
          producto={producto}
          onAgregar={onAgregar}
          cantidad={cantidadEnPedido?.(producto.id) ?? 0}
          abrirDescripcionAlTocar={abrirDescripcionAlTocar}
        />
      ))}
    </div>
  )
}
