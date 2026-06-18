import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

import type { Rol } from "@/features/auth/types"
import { useRolActual, useSesion } from "@/features/auth/hooks/useSesion"
import { homePorRol } from "@/features/auth/homePorRol"
import { Skeleton } from "@/shared/components/ui/skeleton"

type ProtectedRouteProps = {
  children: ReactNode
  /** Roles permitidos. Si se omite, basta con estar autenticado. */
  requiredRole?: Rol[]
}

/**
 * Protege rutas sensibles contra la sesión real de Supabase.
 *
 * Recordar: este RBAC de frontend es UX. La seguridad real es el RLS de Supabase.
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { session, cargando: cargandoSesion } = useSesion()
  const userId = session?.user.id
  const { data: rol, isLoading: cargandoRol } = useRolActual(userId)

  // Mientras se resuelve la sesión (o el rol, si la ruta lo exige) no decidimos
  // todavía: evita un parpadeo de redirect al login en cada recarga.
  if (cargandoSesion || (requiredRole && userId && cargandoRol)) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Skeleton className="h-32 w-full max-w-sm" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />
  }

  if (requiredRole && (!rol || !requiredRole.includes(rol))) {
    return <Navigate to={homePorRol(rol)} replace />
  }

  return <>{children}</>
}
