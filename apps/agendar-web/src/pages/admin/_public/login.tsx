import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import type z from "zod"
import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { adminLogin } from "@/http/admin/login"
import { adminLoginSchema } from "@/lib/validations/admin-auth"

type SearchParams = {
  redirect?: string
}

export const Route = createFileRoute("/admin/_public/login")({
  component: AdminLogin,
  validateSearch: (search: SearchParams) => {
    return {
      redirect: search.redirect,
    }
  },
})

type Inputs = z.infer<typeof adminLoginSchema>

function AdminLogin() {
  const navigate = useNavigate()
  const { redirect } = Route.useSearch()

  const { mutateAsync: authenticate, isPending } = useMutation({
    mutationFn: adminLogin,
  })

  const form = useForm<Inputs>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: Inputs) {
    await authenticate(values)

    const redirectTo = redirect ? decodeURIComponent(redirect) : "/admin"
    navigate({ to: redirectTo })
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold">Admin - Agendar</h1>
            <p className="text-muted-foreground text-sm">
              Painel administrativo da plataforma
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
