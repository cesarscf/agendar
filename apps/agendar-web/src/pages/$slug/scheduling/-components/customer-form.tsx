import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
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
import { customerVerify } from "@/http/public/customer-verify"
import { maskDate, maskPhone } from "@/lib/masks"
import { formatIsoToDateBr, onlyNumbers } from "@/lib/utils"
import {
  type CreateCustomerRequest,
  createCustomerSchema,
} from "@/lib/validations/customer"

export interface CreateCustomerFormProps {
  onSubmit: (values: CreateCustomerRequest) => void
  formRef?: React.Ref<any>
  establishmentSlug: string
  serviceId?: string
  packageId?: string
  onPackageAvailable?: (hasPackage: boolean) => void
}

export function CreateCustomerForm({
  onSubmit,
  formRef,
  establishmentSlug,
  packageId,
  onPackageAvailable,
}: CreateCustomerFormProps) {
  const form = useForm<CreateCustomerRequest>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      phoneNumber: "",
      email: "",
      cpf: "",
      notes: "",
      state: "",
      city: "",
      address: "",
    },
  })

  React.useImperativeHandle(formRef, () => ({
    submit: () => form.handleSubmit(onSubmit)(),
    getValues: () => form.getValues(),
  }))

  const debounceRef = React.useRef<NodeJS.Timeout | null>(null)

  async function handlePhoneChange(value: string) {
    const masked = maskPhone(value)
    form.setValue("phoneNumber", masked)

    const numbers = onlyNumbers(masked)

    if (numbers.length >= 11) {
      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(async () => {
        const verified = await customerVerify(
          numbers,
          establishmentSlug,
          packageId
        )

        const birthDate = formatIsoToDateBr(verified.birthDate ?? "")

        if (verified) {
          form.setValue("name", verified.name ?? "")
          form.setValue("phoneNumber", maskPhone(verified.phoneNumber))
          form.setValue("city", verified.city ?? "")
          form.setValue("cpf", verified.cpf ?? "")
          form.setValue("email", verified.email ?? "")
          form.setValue("state", verified.state ?? "")
          form.setValue("address", verified.address ?? "")
          form.setValue("birthDate", birthDate)

          if (
            onPackageAvailable &&
            verified.hasPackageAvailable !== undefined
          ) {
            onPackageAvailable(verified.hasPackageAvailable)
          }
        }
      }, 500)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone*</FormLabel>
              <FormControl>
                <Input
                  placeholder="(XX) XXXXX-XXXX"
                  {...field}
                  onChange={e => handlePhoneChange(e.target.value)}
                />
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
              <FormLabel>Nome*</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
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
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input
                  placeholder="DD/MM/AAAA"
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
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="exemplo@email.com" {...field} />
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
                <Input placeholder="000.000.000-00" {...field} />
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
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea placeholder="Notas sobre o cliente" {...field} />
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
                <Input placeholder="ES" {...field} />
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
                <Input placeholder="Vila Velha" {...field} />
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
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua, número, bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
