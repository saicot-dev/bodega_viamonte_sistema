import { Wine } from "lucide-react"

import { cn } from "@/shared/utils/cn"

type SinImagenProps = {
  className?: string
  /** Tamaño del ícono de copa. */
  iconClassName?: string
}

/**
 * Placeholder elegante para productos sin foto: rayas diagonales sutiles en
 * tono dorado y una copa de vino tenue. Reemplaza el ícono de "imagen tachada".
 */
export function SinImagen({ className, iconClassName }: SinImagenProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-secondary",
        className,
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, hsl(var(--primary) / 0.10) 0, hsl(var(--primary) / 0.10) 1px, transparent 1px, transparent 11px)",
      }}
      aria-hidden
    >
      <Wine
        className={cn("text-primary/40", iconClassName ?? "h-10 w-10")}
        strokeWidth={1.25}
      />
    </div>
  )
}
