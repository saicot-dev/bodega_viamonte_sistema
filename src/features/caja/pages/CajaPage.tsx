import { useState } from "react"

import { ProductosGrid } from "@/features/caja/components/ProductosGrid"
import { PanelPedido } from "@/features/caja/components/PanelPedido"
import { usePedidoContext } from "@/features/caja/hooks/PedidoContext"
import { CobroDialog } from "@/features/ventas/components/CobroDialog"
import { useRegistrarVentas } from "@/features/ventas/hooks/useRegistrarVentas"
import { useEventoActivo } from "@/features/eventos/hooks/useEventos"
import type { MetodoPago } from "@/features/ventas/types"
import { useToast } from "@/shared/hooks/use-toast"

export function CajaPage() {
  const pedido = usePedidoContext()
  const registrar = useRegistrarVentas()
  const { data: eventoActivo } = useEventoActivo()
  const { toast } = useToast()
  const [cobroAbierto, setCobroAbierto] = useState(false)

  function cantidadEnPedido(productoId: string) {
    return (
      pedido.lineas.find((l) => l.producto.id === productoId)?.cantidad ?? 0
    )
  }

  function handleFinalizar() {
    if (!eventoActivo) {
      toast({
        title: "No hay un evento activo",
        description:
          "El administrador debe activar un evento antes de registrar ventas.",
        variant: "destructive",
      })
      return
    }
    setCobroAbierto(true)
  }

  function handleConfirmar(metodo: MetodoPago) {
    if (!eventoActivo) return
    registrar.mutate(
      { lineas: pedido.lineas, metodoPago: metodo, eventoId: eventoActivo.id },
      {
        onSuccess: () => {
          toast({ title: "Venta registrada correctamente" })
          pedido.limpiar()
          setCobroAbierto(false)
        },
        onError: (error) => {
          toast({
            title: "No se pudo registrar la venta",
            description: "Intentá de nuevo o contactá al administrador.",
            variant: "destructive",
          })
          if (import.meta.env.DEV) console.error(error)
        },
      },
    )
  }

  return (
    <div className="grid gap-6 lg:h-[calc(100vh-7rem)] lg:grid-cols-[1fr_24rem]">
      <section className="flex min-h-0 flex-col">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h1 className="text-3xl font-bold text-foreground">Caja</h1>
          {eventoActivo ? (
            <span className="text-sm text-muted-foreground">
              Evento: <span className="font-semibold text-foreground">{eventoActivo.nombre}</span>
            </span>
          ) : (
            <span className="text-sm font-medium text-destructive">
              Sin evento activo
            </span>
          )}
        </div>
        <ProductosGrid
          onAgregar={pedido.agregar}
          cantidadEnPedido={cantidadEnPedido}
          altoCompleto
        />
      </section>

      <aside className="lg:h-full">
        <PanelPedido
          lineas={pedido.lineas}
          total={pedido.total}
          onCambiarCantidad={pedido.cambiarCantidad}
          onQuitar={pedido.quitar}
          onLimpiar={pedido.limpiar}
          onFinalizar={handleFinalizar}
        />
      </aside>

      <CobroDialog
        abierto={cobroAbierto}
        total={pedido.total}
        registrando={registrar.isPending}
        onOpenChange={setCobroAbierto}
        onConfirmar={handleConfirmar}
      />
    </div>
  )
}
