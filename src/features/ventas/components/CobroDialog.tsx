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
      <DialogContent className="flex h-[60vh] w-[60vw] max-w-none flex-col p-10">
        <DialogHeader>
          <DialogTitle className="text-3xl">Cobrar pedido</DialogTitle>
        </DialogHeader>

        <p className="text-lg text-muted-foreground">
          Total a cobrar:{" "}
          <span className="text-3xl font-bold text-foreground">
            {formatCurrency(total)}
          </span>
        </p>

        <div className="mt-4 flex flex-1 flex-col">
          <p className="mb-4 text-lg font-medium">Método de pago</p>
          <div className="grid flex-1 grid-cols-3 gap-4">
            {METODOS_PAGO.map((m) => (
              <Button
                key={m.valor}
                variant={metodo === m.valor ? "default" : "outline"}
                className="h-full text-2xl"
                onClick={() => setMetodo(m.valor)}
              >
                {m.etiqueta}
              </Button>
            ))}
          </div>
        </div>

        <Button
          className="mt-6 h-16 w-full text-xl"
          disabled={!metodo || registrando}
          onClick={() => metodo && onConfirmar(metodo)}
        >
          {registrando ? "Registrando…" : "Confirmar venta"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
