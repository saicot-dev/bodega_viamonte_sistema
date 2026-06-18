import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"

import { ProtectedRoute } from "@/app/routes/ProtectedRoute"
import { RedirectHome } from "@/app/routes/RedirectHome"
import { AppLayout } from "@/shared/components/layout/AppLayout"
import { PantallaCarga } from "@/shared/components/layout/PantallaCarga"

const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({
    default: m.LoginPage,
  })),
)
const DashboardPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
)
const EventosPage = lazy(() =>
  import("@/features/eventos/pages/EventosPage").then((m) => ({
    default: m.EventosPage,
  })),
)
const CajaPage = lazy(() =>
  import("@/features/caja/pages/CajaPage").then((m) => ({
    default: m.CajaPage,
  })),
)
const VentasPage = lazy(() =>
  import("@/features/ventas/pages/VentasPage").then((m) => ({
    default: m.VentasPage,
  })),
)
const ClientesPage = lazy(() =>
  import("@/features/clientes/pages/ClientesPage").then((m) => ({
    default: m.ClientesPage,
  })),
)

export function AppRoutes() {
  return (
    <Suspense fallback={<PantallaCarga />}>
      <Routes>
        <Route path="/" element={<RedirectHome />} />
        <Route path="/auth/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Solo admin */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole={["admin"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/eventos"
            element={
              <ProtectedRoute requiredRole={["admin"]}>
                <EventosPage />
              </ProtectedRoute>
            }
          />
          {/* Solo caja (el admin no opera la caja ni ve ventas/clientes) */}
          <Route
            path="/caja"
            element={
              <ProtectedRoute requiredRole={["caja"]}>
                <CajaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ventas"
            element={
              <ProtectedRoute requiredRole={["caja"]}>
                <VentasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute requiredRole={["caja"]}>
                <ClientesPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<RedirectHome />} />
      </Routes>
    </Suspense>
  )
}
