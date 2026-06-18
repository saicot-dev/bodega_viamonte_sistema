/**
 * Formato de moneda centralizado (peso argentino). Toda la app debe usar esta
 * utilidad en lugar de repetir toFixed(2) suelto, según las reglas de dinero.
 */
const formatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
})

export function formatCurrency(valor: number): string {
  return formatter.format(valor)
}
