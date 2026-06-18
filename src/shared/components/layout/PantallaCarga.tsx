import { Loader2 } from "lucide-react"

/**
 * Pantalla de carga a pantalla completa: logo de la bodega + spinner sobre
 * fondo limpio. Se usa mientras se resuelve la sesión o cargan las páginas.
 */
export function PantallaCarga() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <img
        src="/logoviamonte.png"
        alt="Viamonte Winery"
        className="h-20 w-auto"
      />
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  )
}
