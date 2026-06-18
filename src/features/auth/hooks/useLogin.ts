import { useMutation } from "@tanstack/react-query"

import { supabase } from "@/integrations/supabase/client"
import type { LoginFormValues } from "@/features/auth/schema"

/**
 * Login del sistema contra Supabase auth.
 *
 * El manejo del éxito (redirect) y del error (toast) lo hace el componente que
 * consume este hook, según error-handling.txt. Acá solo se lanza el error de
 * Supabase si las credenciales son inválidas.
 */
export function useLogin() {
  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) throw error
      return data
    },
  })
}
