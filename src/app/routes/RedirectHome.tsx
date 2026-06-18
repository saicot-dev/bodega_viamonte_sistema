import { Navigate } from "react-router-dom"

import { useRolActual, useSesion } from "@/features/auth/hooks/useSesion"
import { homePorRol } from "@/features/auth/homePorRol"
import { PantallaCarga } from "@/shared/components/layout/PantallaCarga"

/**
 * Punto de entrada ("/"): manda a cada usuario a su home según el rol.
 * - admin → /dashboard
 * - caja  → /caja
 */
export function RedirectHome() {
  const { session, cargando } = useSesion()
  const { data: rol, isLoading } = useRolActual(session?.user.id)

  if (cargando || (session && isLoading)) {
    return <PantallaCarga />
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />
  }

  return <Navigate to={homePorRol(rol)} replace />
}
