const timeFormatter = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
})

/** Hora local (HH:mm) de una fecha ISO. */
export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso))
}
