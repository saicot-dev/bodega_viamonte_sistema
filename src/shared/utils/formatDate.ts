const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

/** Fecha (dd/mm/aaaa) de un string ISO o YYYY-MM-DD. */
export function formatDate(iso: string): string {
  // Para fechas tipo "2026-06-16" evitamos el corrimiento de zona horaria.
  const soloFecha = /^\d{4}-\d{2}-\d{2}$/.test(iso)
  const date = soloFecha ? new Date(`${iso}T00:00:00`) : new Date(iso)
  return dateFormatter.format(date)
}
