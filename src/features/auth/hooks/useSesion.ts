import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"

import { supabase } from "@/integrations/supabase/client"
import type { Rol } from "@/features/auth/types"

/**
 * Sesión de Supabase auth. Mantiene el estado sincronizado con los cambios de
 * autenticación (login, logout, refresh de token) y diferencia "cargando" de
 * "no hay sesión" para que las rutas protegidas no redirijan antes de tiempo.
 */
export function useSesion() {
  const [session, setSession] = useState<Session | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCargando(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nuevaSesion) => {
      setSession(nuevaSesion)
      setCargando(false)
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  return { session, cargando }
}

/**
 * Rol del usuario autenticado, leído de user_roles. La política RLS garantiza
 * que cada usuario solo puede leer su propia fila.
 */
export function useRolActual(userId: string | undefined) {
  return useQuery({
    queryKey: ["auth", "rol", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Rol | null> => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("rol")
        .eq("id", userId!)
        .maybeSingle()

      if (error) throw error
      if (!data) return null
      return data.rol as Rol
    },
  })
}
