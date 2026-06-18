import type { Rol } from "@/features/auth/types"

/**
 * Ruta inicial de cada rol al entrar al sistema:
 * - admin → Dashboard (no opera la caja)
 * - caja  → Caja (no ve el dashboard)
 */
export function homePorRol(rol: Rol | null | undefined): string {
  return rol === "admin" ? "/dashboard" : "/caja"
}
