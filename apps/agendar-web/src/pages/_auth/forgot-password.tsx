import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type z from "zod"
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
import { forgotPassword } from "@/http/auth/forgot-password"
import { forgotPasswordSchema } from "@/lib/validations/auth"

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPassword,
})

type Inputs = z.infer<typeof forgotPasswordSchema>

function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const { mutateAsync: sendReset, isPending } = useMutation({
    mutationFn: (values: Inputs) => forgotPassword(values.email),
  })

  async function onSubmit(values: Inputs) {
    await sendReset(values)
    setSubmitted(true)
  }

  if (submitted) {
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
          <h1 className="text-xl font-bold">Verifique seu e-mail</h1>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Se esse e-mail estiver cadastrado, você receberá as instruções para
          redefinir sua senha em breve.
        </p>
        <div className="text-center text-sm">
          <Link to="/login" className="underline underline-offset-4">
            Voltar ao login
          </Link>
        </div>
      </div>
    )
  }

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
        <h1 className="text-xl font-bold">Recuperar senha</h1>
        <div className="text-center text-sm text-muted-foreground">
          Informe seu e-mail para receber as instruções de redefinição.
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
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Enviar instruções"
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
