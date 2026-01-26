import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import type z from "zod"
import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { login } from "@/http/auth/login"
import { loginSchema } from "@/lib/validations/auth"

type AuthParams = {
  redirect?: string
}

export const Route = createFileRoute("/_auth/login")({
  component: Login,
  validateSearch: (search: AuthParams) => {
    return {
      redirect: search.redirect,
    }
  },
})

type Inputs = z.infer<typeof loginSchema>

function Login() {
  const { redirect } = Route.useSearch()

  const { mutateAsync: authenticate, isPending } = useMutation({
    mutationFn: login,
  })

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(values: Inputs) {
    await authenticate(values)

    const redirectTo = decodeURIComponent(redirect ?? "/app")
    window.location.href = redirectTo
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <a href="#" className="flex flex-col items-center gap-2 font-medium">
          <img
            src="/logo.jpg"
            alt="Logo Agendar"
            className="w-16 h-16 rounded-full object-cover border"
          />

          <span className="sr-only">Agendar</span>
        </a>
        <h1 className="text-xl font-bold">Bem-vindo ao Agendar</h1>
        <div className="text-center text-sm">
          Ainda não tem uma conta?{" "}
          <a href="/pre-register" className="underline underline-offset-4">
            Cadastre-se
          </a>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={checked => field.onChange(!!checked)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    Lembrar senha
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Entrar"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
