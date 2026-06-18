import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/integrations/supabase/client"

/**
 * Cierra la sesión de Supabase y limpia la caché de React Query para no dejar
 * datos del usuario anterior en memoria.
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
