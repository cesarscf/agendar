import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { preRegister } from "@/http/auth/register";
import { preRegisterSchema } from "@/lib/validations/auth";

export const Route = createFileRoute("/_auth/pre-register")({
  component: PreRegister,
});

type Inputs = z.infer<typeof preRegisterSchema>;

function PreRegister() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(preRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { mutateAsync: sendCode, isPending } = useMutation({
    mutationFn: preRegister,
    onSuccess: () => {
      toast.success("Código enviado!", {
        description: "Verifique seu e-mail para continuar o cadastro.",
      });
    },
    onError: (error: Error) => {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ?? "Erro inesperado no servidor.";

        toast.error(message);
        return;
      }

      toast.error("Erro desconhecido. Tente novamente mais tarde.");
    },
  });

  async function onSubmit(values: Inputs) {
    await sendCode(values);

    navigate({
      to: "/register",
      search: {
        name: values.name,
        email: values.email,
        redirect: undefined,
      },
    });
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
        <h1 className="text-xl font-bold">Cadastre-se no Agendar</h1>
        <div className="text-center text-sm">
          Já tem uma conta?{" "}
          <a href="/login" className="underline underline-offset-4">
            Entrar
          </a>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Continuar
                <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
