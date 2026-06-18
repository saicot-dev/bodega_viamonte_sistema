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
  /** Cantidad de columnas. Menos columnas = tarjetas más grandes (tablet). */
  columnas?: 3 | 4 | 5 | 6
}

// Clases fijas para que Tailwind las detecte (no interpolar dinámicamente).
const COLS_CLASS: Record<3 | 4 | 5 | 6, string> = {
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
}

export function ProductosGrid({
  onAgregar,
  cantidadEnPedido,
  altoCompleto = false,
  abrirDescripcionAlTocar = false,
  columnas = 5,
}: ProductosGridProps) {
  const { data: productos, isLoading, isError } = useProductos()

  if (isLoading) {
    return (
      <div className={cn("grid gap-4", COLS_CLASS[columnas])}>
        {Array.from({ length: 8 }).map((_, i) => (
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
        "grid auto-rows-min content-start gap-4",
        COLS_CLASS[columnas],
        // En Caja: la grilla llena el alto disponible y scrollea hacia abajo si
        // hay más filas de las que entran. auto-rows-min hace que cada fila tome
        // el alto natural de las tarjetas (no se comprimen ni se superponen).
        // El carrito queda fijo al lado (no scrollea).
        altoCompleto && "min-h-0 flex-1 overflow-y-auto pr-1",
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
