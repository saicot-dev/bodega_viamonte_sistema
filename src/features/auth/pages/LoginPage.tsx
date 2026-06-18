import { Navigate } from "react-router-dom"

import { LoginForm } from "@/features/auth/components/LoginForm"
import { useSesion } from "@/features/auth/hooks/useSesion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

export function LoginPage() {
  const { session, cargando } = useSesion()

  // Si ya hay sesión, no mostrar el login: la raíz decide según el rol.
  if (!cargando && session) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4">
      <img
        src="/logoviamonte.png"
        alt="Viamonte Winery"
        className="h-24 w-auto"
      />
      <Card className="w-full max-w-sm border-2">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl tracking-wide">Sistema de Caja</CardTitle>
          <CardDescription>Ingresá con tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
}
