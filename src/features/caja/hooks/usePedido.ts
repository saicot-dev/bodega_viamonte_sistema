import { useMemo, useReducer } from "react"

import type { LineaPedido, Producto } from "@/features/caja/types"

type EstadoPedido = {
  lineas: LineaPedido[]
}

type AccionPedido =
  | { type: "agregar"; producto: Producto }
  | { type: "quitar"; productoId: string }
  | { type: "cambiarCantidad"; productoId: string; cantidad: number }
  | { type: "limpiar" }

function reducer(estado: EstadoPedido, accion: AccionPedido): EstadoPedido {
  switch (accion.type) {
    case "agregar": {
      const existente = estado.lineas.find(
        (l) => l.producto.id === accion.producto.id,
      )
      if (existente) {
        return {
          lineas: estado.lineas.map((l) =>
            l.producto.id === accion.producto.id
              ? { ...l, cantidad: l.cantidad + 1 }
              : l,
          ),
        }
      }
      return {
        lineas: [...estado.lineas, { producto: accion.producto, cantidad: 1 }],
      }
    }
    case "quitar":
      return {
        lineas: estado.lineas.filter(
          (l) => l.producto.id !== accion.productoId,
        ),
      }
    case "cambiarCantidad": {
      if (accion.cantidad <= 0) {
        return {
          lineas: estado.lineas.filter(
            (l) => l.producto.id !== accion.productoId,
          ),
        }
      }
      return {
        lineas: estado.lineas.map((l) =>
          l.producto.id === accion.productoId
            ? { ...l, cantidad: accion.cantidad }
            : l,
        ),
      }
    }
    case "limpiar":
      return { lineas: [] }
  }
}

/**
 * Estado del pedido en curso. Vive solo en memoria (no se persiste): guardar la
 * venta es parte del módulo Ventas.
 */
export function usePedido() {
  const [estado, dispatch] = useReducer(reducer, { lineas: [] })

  const total = useMemo(
    () =>
      estado.lineas.reduce(
        (acc, l) => acc + l.producto.valor * l.cantidad,
        0,
      ),
    [estado.lineas],
  )

  const cantidadTotal = useMemo(
    () => estado.lineas.reduce((acc, l) => acc + l.cantidad, 0),
    [estado.lineas],
  )

  return {
    lineas: estado.lineas,
    total,
    cantidadTotal,
    agregar: (producto: Producto) => dispatch({ type: "agregar", producto }),
    quitar: (productoId: string) => dispatch({ type: "quitar", productoId }),
    cambiarCantidad: (productoId: string, cantidad: number) =>
      dispatch({ type: "cambiarCantidad", productoId, cantidad }),
    limpiar: () => dispatch({ type: "limpiar" }),
  }
}
