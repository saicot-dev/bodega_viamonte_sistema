import { Minus, Plus, Trash2 } from "lucide-react"

import type { LineaPedido } from "@/features/caja/types"
import { formatCurrency } from "@/shared/utils/formatCurrency"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

type PanelPedidoProps = {
  lineas: LineaPedido[]
  total: number
  onCambiarCantidad: (productoId: string, cantidad: number) => void
  onQuitar: (productoId: string) => void
  onLimpiar: () => void
  onFinalizar: () => void
}

export function PanelPedido({
  lineas,
  total,
  onCambiarCantidad,
  onQuitar,
  onLimpiar,
  onFinalizar,
}: PanelPedidoProps) {
  const vacio = lineas.length === 0

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Pedido</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 overflow-y-auto">
        {vacio ? (
          <p className="text-sm text-muted-foreground">
            Tocá los productos para agregarlos al pedido.
          </p>
        ) : (
          lineas.map((linea) => (
            <div
              key={linea.producto.id}
              className="flex items-center gap-2 border-b pb-3 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {linea.producto.nombre_producto}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(linea.producto.valor)} c/u ·{" "}
                  {formatCurrency(linea.producto.valor * linea.cantidad)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  aria-label="Quitar una unidad"
                  onClick={() =>
                    onCambiarCantidad(linea.producto.id, linea.cantidad - 1)
                  }
                >
                  <Minus />
                </Button>
                <span className="w-6 text-center text-sm tabular-nums">
                  {linea.cantidad}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  aria-label="Agregar una unidad"
                  onClick={() =>
                    onCambiarCantidad(linea.producto.id, linea.cantidad + 1)
                  }
                >
                  <Plus />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive"
                  aria-label="Eliminar del pedido"
                  onClick={() => onQuitar(linea.producto.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3 border-t pt-4">
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{formatCurrency(total)}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={vacio}
            onClick={onLimpiar}
          >
            Vaciar
          </Button>
          <Button className="flex-1" disabled={vacio} onClick={onFinalizar}>
            Finalizar
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
