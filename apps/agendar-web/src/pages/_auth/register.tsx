import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { AxiosError } from "axios"
import { Loader2, Mail } from "lucide-react"
import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { VerificationTimer } from "@/components/verification-timer"
import { preRegister, register } from "@/http/auth/register"
import { registerSchema } from "@/lib/validations/auth"

type SearchParams = {
  name?: string
  email?: string
  redirect?: string
}

export const Route = createFileRoute("/_auth/register")({
  component: Register,
  validateSearch: (search: SearchParams) => {
    return {
      name: search.name,
      email: search.email,
      redirect: search.redirect,
    }
  },
})

type Inputs = z.infer<typeof registerSchema>

function Register() {
  const { name, email, redirect } = Route.useSearch()
  const navigate = useNavigate()

  const [codeExpiresAt, setCodeExpiresAt] = useState(() => {
    const expirationTime = new Date()
    expirationTime.setMinutes(expirationTime.getMinutes() + 5)
    return expirationTime
  })

  const [isCodeExpired, setIsCodeExpired] = useState(false)

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      code: "",
      name: name || "",
      email: email || "",
      password: "",
      confirmPassword: "",
      state: "",
      city: "",
    },
  })

  const { mutateAsync: authenticate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success("Cadastro realizado!", {
        description:
          "Bem-vindo ao Agendar. Seu teste grátis de 7 dias começou!",
      })
    },
    onError: (error: Error) => {
      toast.error("Erro no cadastro", {
        description: error.message,
      })
    },
  })

  const { mutateAsync: resendCode, isPending: isResending } = useMutation({
    mutationFn: preRegister,
    onSuccess: () => {
      const newExpirationTime = new Date()
      newExpirationTime.setMinutes(newExpirationTime.getMinutes() + 5)
      setCodeExpiresAt(newExpirationTime)
      setIsCodeExpired(false)

      toast.success("Código reenviado!", {
        description: "Um novo código foi enviado para seu e-mail.",
      })
    },
    onError: error => {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ?? "Erro inesperado no servidor."

        toast.error(message)
        return
      }

      toast.error("Erro desconhecido. Tente novamente mais tarde.")
    },
  })

  async function onSubmit(values: Inputs) {
    const { ...registerData } = values
    await authenticate(registerData)

    const redirectTo = decodeURIComponent(redirect ?? "/app")
    window.location.href = redirectTo
  }

  async function handleResendCode() {
    const nameValue = form.getValues("name")
    const emailValue = form.getValues("email")

    if (!nameValue || !emailValue) {
      toast.error("Dados incompletos", {
        description: "Nome e e-mail são necessários para reenviar o código.",
      })
      return
    }

    await resendCode({ name: nameValue, email: emailValue })
  }

  if (!name || !email) {
    navigate({ to: "/pre-register" })
    return null
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
        <h1 className="text-xl font-bold">Complete seu cadastro</h1>
        <div className="text-center text-sm">
          Já tem uma conta?{" "}
          <a href="/login" className="underline underline-offset-4">
            Entrar
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <VerificationTimer
          expiresAt={codeExpiresAt}
          onExpire={() => setIsCodeExpired(true)}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Verificação</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isCodeExpired}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Não recebeu o código?
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleResendCode}
          disabled={isResending || !isCodeExpired}
        >
          {isResending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Mail className="size-4 mr-2" />
              Reenviar código
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
