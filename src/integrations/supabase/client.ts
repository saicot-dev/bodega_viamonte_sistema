import { createClient } from "@supabase/supabase-js"

import { type Database } from "@/integrations/supabase/types"

// La URL y la anon key del proyecto. La anon key es pública por diseño (viaja
// al navegador en cualquier caso); la seguridad real la da el RLS de Supabase.
// Se dejan como valores por defecto para el deploy; si hay variables de entorno
// (ej. en desarrollo local con .env.local), tienen prioridad.
const SUPABASE_URL_DEFAULT = "https://ckkpdawdvzpkuvsedcyd.supabase.co"
const SUPABASE_ANON_KEY_DEFAULT = "sb_publishable_3q3hSy7nsrUz9XWqKdrFDA_fPf6Ad4y"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL_DEFAULT
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY_DEFAULT

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
