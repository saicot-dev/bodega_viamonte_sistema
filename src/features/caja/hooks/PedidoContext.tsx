import { createContext, useContext, type ReactNode } from "react"

import { usePedido } from "@/features/caja/hooks/usePedido"

type PedidoContextValue = ReturnType<typeof usePedido>

const PedidoContext = createContext<PedidoContextValue | null>(null)

/**
 * Provee el pedido en curso a toda la sección autenticada, para que tanto la
 * página de Caja como el navbar (contador de unidades) lean el mismo carrito.
 */
export function PedidoProvider({ children }: { children: ReactNode }) {
  const pedido = usePedido()
  return (
    <PedidoContext.Provider value={pedido}>{children}</PedidoContext.Provider>
  )
}

export function usePedidoContext() {
  const ctx = useContext(PedidoContext)
  if (!ctx) {
    throw new Error("usePedidoContext debe usarse dentro de <PedidoProvider>")
  }
  return ctx
}
