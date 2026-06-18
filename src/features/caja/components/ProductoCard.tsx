import { useState } from "react"
import { Info } from "lucide-react"

import type { Producto } from "@/features/caja/types"
import { formatCurrency } from "@/shared/utils/formatCurrency"
import { ProductoInfoDialog } from "@/features/caja/components/ProductoInfoDialog"
import { SinImagen } from "@/features/caja/components/SinImagen"
import { cn } from "@/shared/utils/cn"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"

type ProductoCardProps = {
  producto: Producto
  /**
   * Si se pasa, toda la tarjeta agrega el producto al pedido (modo Caja).
   * Si se omite, la tarjeta no agrega al pedido.
   */
  onAgregar?: (producto: Producto) => void
  /** Unidades de este producto en el carrito. Muestra un badge si es > 0. */
  cantidad?: number
  /**
   * Modo carta (Clientes): toda la tarjeta abre la descripción y no se muestra
   * el botón "Descripción". En modo Caja queda en false.
   */
  abrirDescripcionAlTocar?: boolean
}

export function ProductoCard({
  producto,
  onAgregar,
  cantidad = 0,
  abrirDescripcionAlTocar = false,
}: ProductoCardProps) {
  const [infoAbierta, setInfoAbierta] = useState(false)
  const [resaltado, setResaltado] = useState(false)

  const interactiva = !!onAgregar || abrirDescripcionAlTocar

  function handleTarjeta() {
    if (abrirDescripcionAlTocar) {
      setInfoAbierta(true)
      return
    }
    if (!onAgregar) return
    onAgregar(producto)
    // Pequeño resalte de confirmación al tocar (feedback en tablet).
    setResaltado(true)
    window.setTimeout(() => setResaltado(false), 200)
  }

  return (
    <Card
      role={interactiva ? "button" : undefined}
      tabIndex={interactiva ? 0 : undefined}
      aria-label={
        abrirDescripcionAlTocar
          ? `Ver descripción de ${producto.nombre_producto}`
          : onAgregar
            ? `Agregar ${producto.nombre_producto} al pedido`
            : undefined
      }
      onClick={interactiva ? handleTarjeta : undefined}
      onKeyDown={(e) => {
        if (interactiva && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          handleTarjeta()
        }
      }}
      className={cn(
        "flex min-h-52 select-none flex-col overflow-hidden transition-all",
        interactiva &&
          cn(
            "cursor-pointer active:scale-95",
            resaltado
              ? "ring-2 ring-primary"
              : "hover:ring-2 hover:ring-primary/40",
          ),
      )}
    >
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-muted">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre_producto}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <SinImagen iconClassName="h-12 w-12" />
        )}
        {cantidad > 0 && (
          <span
            className="absolute right-2 top-2 flex h-9 min-w-9 items-center justify-center rounded-full bg-primary px-2 text-base font-semibold text-primary-foreground shadow tabular-nums"
            aria-label={`${cantidad} en el carrito`}
          >
            {cantidad}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h3 className="text-base font-medium leading-tight">
            {producto.nombre_producto}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(producto.valor)}
          </p>
        </div>

        {/* En modo carta (Clientes) no se muestra: la tarjeta entera abre la
            descripción. En Caja el botón la abre sin agregar al pedido. */}
        {!abrirDescripcionAlTocar && (
          <Button
            variant="outline"
            className="h-11 w-full"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              setInfoAbierta(true)
            }}
          >
            <Info />
            Descripción
          </Button>
        )}
      </div>

      <ProductoInfoDialog
        producto={producto}
        abierto={infoAbierta}
        onOpenChange={setInfoAbierta}
      />
    </Card>
  )
}
