import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
import { deleteCustomer } from "@/http/customers/delete-customer"
import { updateCustomer } from "@/http/customers/update-customer"
import { maskCPF, maskDate, maskPhone } from "@/lib/masks"
import { formatIsoToDateBr } from "@/lib/utils"
import { type Customer, updateCustomerSchema } from "@/lib/validations/customer"

type Inputs = z.infer<typeof updateCustomerSchema>

export function UpdateCustomerForm({ customer }: { customer: Customer }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<Inputs>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      id: customer.id,
      name: customer.name,
      phoneNumber: maskPhone(customer?.phoneNumber ?? ""),
      birthDate: formatIsoToDateBr(customer?.birthDate ?? ""),
      email: customer.email ?? "",
      address: customer.address ?? "",
      cpf: maskCPF(customer.cpf ?? ""),
      city: customer.city ?? "",
      state: customer.state ?? "",
      notes: customer.notes ?? "",
    },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateCustomer,
  })

  const { mutateAsync: deleteCustomerMutate, isPending: deleteIsPending } =
    useMutation({
      mutationFn: deleteCustomer,
    })

  async function onSubmit(values: Inputs) {
    await mutateAsync({ ...values, id: customer.id })

    queryClient.invalidateQueries({ queryKey: ["customer", customer.id] })
    queryClient.invalidateQueries({ queryKey: ["customers"] })

    toast.success("Cliente atualizado com sucesso!")
  }

  return (
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
                  placeholder="Digite aqui o nome do profissional"
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
                  placeholder="Digite aqui o telefone do cliente"
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
                  placeholder="12/34/5678"
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
                <Input
                  placeholder="Digite aqui o email do profissional"
                  {...field}
                />
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
                  placeholder="000.000.000-00"
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
                  placeholder="Digite aqui a complemento do endereço"
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
                  placeholder="Digite aqui as anotações para esse cliente"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row gap-4">
          <Button type="submit" disabled={isPending}>
            Salvar
            {isPending ? (
              <Loader2 className="size-4 animate-spin ml-2" />
            ) : null}
          </Button>
          <Button
            variant="destructive"
            type="button"
            disabled={deleteIsPending}
            onClick={async () => {
              if (
                confirm(
                  "Tem certeza que deseja excluir este cliente? Todos os dados relacionados serão excluídos."
                )
              ) {
                await deleteCustomerMutate(customer.id)

                queryClient.invalidateQueries({ queryKey: ["customers"] })

                navigate({ to: "/app/customers" })
              }
            }}
          >
            Excluir
            {deleteIsPending ? (
              <Loader2 className="size-4 animate-spin ml-2" />
            ) : null}
          </Button>
        </div>
      </form>
    </Form>
  )
}
