import { AppProviders } from "@/app/providers/AppProviders"
import { AppRoutes } from "@/app/routes/AppRoutes"
import { Toaster } from "@/shared/components/ui/toaster"

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
      <Toaster />
    </AppProviders>
  )
}
