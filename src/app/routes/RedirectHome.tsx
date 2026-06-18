import { Navigate } from "react-router-dom"

import { useRolActual, useSesion } from "@/features/auth/hooks/useSesion"
import { homePorRol } from "@/features/auth/homePorRol"
import { Skeleton } from "@/shared/components/ui/skeleton"

/**
 * Punto de entrada ("/"): manda a cada usuario a su home según el rol.
 * - admin → /dashboard
 * - caja  → /caja
 */
export function RedirectHome() {
  const { session, cargando } = useSesion()
  const { data: rol, isLoading } = useRolActual(session?.user.id)

  if (cargando || (session && isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Skeleton className="h-32 w-full max-w-sm" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />
  }

  return <Navigate to={homePorRol(rol)} replace />
}
