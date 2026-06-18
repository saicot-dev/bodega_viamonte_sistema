import { NavLink, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

import { useRolActual, useSesion } from "@/features/auth/hooks/useSesion"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { cn } from "@/shared/utils/cn"
import { Button } from "@/shared/components/ui/button"

const LINKS_ADMIN = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/eventos", label: "Eventos" },
] as const

const LINKS_CAJA = [
  { to: "/caja", label: "Caja" },
  { to: "/ventas", label: "Ventas" },
  { to: "/clientes", label: "Clientes" },
] as const

export function Navbar() {
  const navigate = useNavigate()
  const { session } = useSesion()
  const { data: rol } = useRolActual(session?.user.id)
  const logout = useLogout()

  const links = rol === "admin" ? LINKS_ADMIN : LINKS_CAJA

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => navigate("/auth/login", { replace: true }),
    })
  }

  return (
    <header className="border-b bg-card">
      <nav className="relative flex h-16 items-center px-5">
        <img
          src="/logoviamonte.png"
          alt="Viamonte Winery"
          className="h-11 w-auto"
        />

        <ul className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md border px-5 py-2 text-sm font-semibold tracking-wide transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:bg-accent",
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          {session?.user.email && (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.email}
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut />
            Salir
          </Button>
        </div>
      </nav>
    </header>
  )
}
