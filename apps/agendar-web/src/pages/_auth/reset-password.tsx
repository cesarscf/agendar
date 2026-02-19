import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
import { resetPassword } from "@/http/auth/reset-password"
import { resetPasswordSchema } from "@/lib/validations/auth"

type SearchParams = {
  token?: string
}

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPassword,
  validateSearch: (search: SearchParams) => ({
    token: search.token,
  }),
  beforeLoad: ({ search }) => {
    if (!search.token) {
      throw redirect({ to: "/forgot-password" })
    }
  },
})

type Inputs = z.infer<typeof resetPasswordSchema>

function ResetPassword() {
  const { token } = Route.useSearch()
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const { mutateAsync: doReset, isPending, isError, error } = useMutation({
    mutationFn: (values: Inputs) =>
      resetPassword(token as string, values.password),
    onSuccess: () => {
      toast.success("Senha redefinida com sucesso!")
      navigate({ to: "/login" })
    },
  })

  async function onSubmit(values: Inputs) {
    await doReset(values)
  }

  const errorMessage =
    isError && error instanceof AxiosError
      ? (error.response?.data?.message ?? "Erro inesperado. Tente novamente.")
      : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <a href="/" className="flex flex-col items-center gap-2 font-medium">
          <img
            src="/logo.jpg"
            alt="Logo Agendar"
            className="w-16 h-16 rounded-full object-cover border"
          />
          <span className="sr-only">Agendar</span>
        </a>
        <h1 className="text-xl font-bold">Nova senha</h1>
        <div className="text-center text-sm text-muted-foreground">
          Crie uma nova senha para sua conta.
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <p>{errorMessage}</p>
          <p className="mt-1">
            <Link
              to="/forgot-password"
              className="underline underline-offset-4"
            >
              Solicitar um novo link
            </Link>
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova senha</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar nova senha</FormLabel>
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
              "Redefinir senha"
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        <Link to="/login" className="underline underline-offset-4">
          Voltar ao login
        </Link>
      </div>
    </div>
  )
}
