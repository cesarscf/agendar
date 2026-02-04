import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ChevronLeft, Loader2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { createCustomer } from "@/http/customers/create-customer"
import { maskCPF, maskDate, maskPhone } from "@/lib/masks"
import { createCustomerSchema } from "@/lib/validations/customer"

export const Route = createFileRoute("/app/customers/new/")({
  component: NewCustomer,
})

type Inputs = z.infer<typeof createCustomerSchema>

function NewCustomer() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<Inputs>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      phoneNumber: "",
      email: "",
      cpf: "",
      city: "",
      state: "",
      address: "",
      notes: "",
    },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCustomer,
  })

  async function onSubmit(values: Inputs) {
    await mutateAsync({ ...values })

    queryClient.invalidateQueries({ queryKey: ["customers"] })

    navigate({ to: "/app/customers" })
  }

  return (
    <div className="p-6">
      <Button size="icon" variant="outline" asChild>
        <Link to="/app/customers">
          <ChevronLeft />
        </Link>
      </Button>

      <div className="my-4">
        <h1 className="text-2xl font-bold text-foreground">
          Adicionar um novo cliente
        </h1>
        <p className="text-muted-foreground">
          Adicione um novo cliente a sua loja
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-md"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                   
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                   
                    maxLength={15}
                    {...field}
                    onChange={e => field.onChange(maskPhone(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de aniversário</FormLabel>
                <FormControl>
                  <Input
                   
                    {...field}
                    onChange={e => field.onChange(maskDate(e.target.value))}
                  />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                   
                    maxLength={14}
                    {...field}
                    onChange={e => field.onChange(maskCPF(e.target.value))}
                  />
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

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Textarea
                   
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anotações</FormLabel>
                <FormControl>
                  <Textarea
                   
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="ml-auto" disabled={isPending}>
            Salvar
            {isPending ? (
              <Loader2 className="size-4 animate-spin ml-2" />
            ) : null}
          </Button>
        </form>
      </Form>
    </div>
  )
}
