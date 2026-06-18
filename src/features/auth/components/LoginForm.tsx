import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { loginSchema, type LoginFormValues } from "@/features/auth/schema"
import { useLogin } from "@/features/auth/hooks/useLogin"
import { useToast } from "@/shared/hooks/use-toast"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"

export function LoginForm() {
  const navigate = useNavigate()
  const login = useLogin()
  const { toast } = useToast()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function handleSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: () => {
        // Ir a la raíz; RedirectHome decide el destino según el rol.
        navigate("/", { replace: true })
      },
      onError: (error) => {
        toast({
          title: "No pudimos iniciar sesión",
          description: "Verificá tu email y contraseña e intentá de nuevo.",
          variant: "destructive",
        })
        if (import.meta.env.DEV) console.error(error)
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@viamonte.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending && <Loader2 className="animate-spin" />}
          Iniciar sesión
        </Button>
      </form>
    </Form>
  )
}
