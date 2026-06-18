import type { VentaConProducto } from "@/features/ventas/types"
import { etiquetaMetodoPago } from "@/features/ventas/types"
import { formatCurrency } from "@/shared/utils/formatCurrency"
import { formatTime } from "@/shared/utils/formatTime"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"

type TablaVentasProps = {
  ventas: VentaConProducto[]
}

export function TablaVentas({ ventas }: TablaVentasProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hora</TableHead>
          <TableHead>Detalle</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ventas.map((venta) => (
          <TableRow key={venta.id}>
            <TableCell className="tabular-nums text-muted-foreground">
              {formatTime(venta.created_at)}
            </TableCell>
            <TableCell className="font-medium">
              {venta.nombre_producto}
            </TableCell>
            <TableCell>{etiquetaMetodoPago(venta.metodo_pago)}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(venta.valor)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
