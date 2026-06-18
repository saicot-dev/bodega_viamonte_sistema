import { useState } from "react"

import { METODOS_PAGO, type MetodoPago } from "@/features/ventas/types"
import { formatCurrency } from "@/shared/utils/formatCurrency"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"

type CobroDialogProps = {
  abierto: boolean
  total: number
  registrando: boolean
  onOpenChange: (abierto: boolean) => void
  onConfirmar: (metodo: MetodoPago) => void
}

export function CobroDialog({
  abierto,
  total,
  registrando,
  onOpenChange,
  onConfirmar,
}: CobroDialogProps) {
  const [metodo, setMetodo] = useState<MetodoPago | null>(null)

  return (
    <Dialog
      open={abierto}
      onOpenChange={(open) => {
        if (!open) setMetodo(null)
        onOpenChange(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cobrar pedido</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Total a cobrar:{" "}
          <span className="text-base font-semibold text-foreground">
            {formatCurrency(total)}
          </span>
        </p>

        <div>
          <p className="mb-2 text-sm font-medium">Método de pago</p>
          <div className="grid grid-cols-3 gap-2">
            {METODOS_PAGO.map((m) => (
              <Button
                key={m.valor}
                variant={metodo === m.valor ? "default" : "outline"}
                onClick={() => setMetodo(m.valor)}
              >
                {m.etiqueta}
              </Button>
            ))}
          </div>
        </div>

        <Button
          className="w-full"
          disabled={!metodo || registrando}
          onClick={() => metodo && onConfirmar(metodo)}
        >
          {registrando ? "Registrando…" : "Confirmar venta"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
