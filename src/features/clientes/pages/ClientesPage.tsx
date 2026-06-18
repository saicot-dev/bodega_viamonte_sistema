import { ProductosGrid } from "@/features/caja/components/ProductosGrid"

export function ClientesPage() {
  return (
    <section>
      <h1 className="mb-1 text-3xl font-bold text-foreground">Carta</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Vista informativa de los productos. Tocá “Descripción” para ver las
        características de cada trago.
      </p>
      {/* Sin onAgregar (no agrega al pedido). Tocar la tarjeta abre la descripción. */}
      <ProductosGrid abrirDescripcionAlTocar />
    </section>
  )
}
