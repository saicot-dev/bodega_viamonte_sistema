import { Outlet } from "react-router-dom"

import { PedidoProvider } from "@/features/caja/hooks/PedidoContext"
import { Navbar } from "@/shared/components/layout/Navbar"

export function AppLayout() {
  return (
    <PedidoProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="w-full flex-1 px-4 py-6">
          <Outlet />
        </main>
      </div>
    </PedidoProvider>
  )
}
