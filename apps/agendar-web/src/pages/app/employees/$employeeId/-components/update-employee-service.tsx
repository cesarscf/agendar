import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2, Trash2 } from "lucide-react"
import React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod"
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
import { MaskInput } from "@/components/ui/mask-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateEmployeeServices } from "@/http/employees/update-employee-services"
import {
  type Employee,
  updateEmployeeServicesFormSchema,
} from "@/lib/validations/employees"
import type { Service } from "@/lib/validations/service"

type Inputs = z.infer<typeof updateEmployeeServicesFormSchema>

interface UpdateEmployeeServicesProps {
  employeeServices: Employee["services"]
  services: Service[]
  employeeId: string
}

export function UpdateEmployeeServices({
  employeeServices,
  services,
  employeeId,
}: UpdateEmployeeServicesProps) {
  const form = useForm<Inputs>({
    resolver: zodResolver(updateEmployeeServicesFormSchema),
    defaultValues: {
      employeeId,
      services: employeeServices.map(item => ({
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        commission: String(item.commission),
        active: item.active,
      })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  })

  const [newServiceId, setNewServiceId] = React.useState<string>("")
  const [newCommission, setNewCommission] = React.useState<string>("")

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateEmployeeServices,
  })

  function handleAddService() {
    const selected = services.find(s => s.id === newServiceId)
    if (!selected) {
      toast.error("Selecione um serviço válido para adicionar.")
      return
    }

    append({
      serviceId: selected.id,
      serviceName: selected.name,
      commission: newCommission,
      active: true,
    })

    setNewServiceId("")
    setNewCommission("")
  }

  async function onSubmit(data: Inputs) {
    const serviceIds = data.services.map(s => s.serviceId)

    const hasDuplicates = serviceIds.length !== new Set(serviceIds).size

    if (hasDuplicates) {
      toast.warning(
        "Existem serviços duplicados na lista. Remova os duplicados antes de salvar."
      )
      return
    }

    await mutateAsync(data)
    toast.success("Serviços atualizados com sucesso!")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 items-end border p-4 rounded-md">
          <FormItem>
            <FormLabel>Novo Serviço</FormLabel>
            <Select
              value={newServiceId}
              onValueChange={setNewServiceId}
              disabled={services.length === 0}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem>
            <FormLabel>Comissão</FormLabel>
            <FormControl>
              <MaskInput
                mask="percentage"
                value={newCommission}
                onValueChange={(_maskedValue, unmaskedValue) => {
                  setNewCommission(unmaskedValue)
                }}
                placeholder="0.00%"
              />
            </FormControl>
          </FormItem>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddService}
            className="h-10"
          >
            Adicionar
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center border p-4 rounded-md"
          >
            <FormField
              control={form.control}
              name={`services.${index}.serviceName`}
              render={() => (
                <FormItem>
                  <FormLabel>Serviço</FormLabel>
                  <FormControl>
                    <Input disabled value={field.serviceName} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`services.${index}.commission`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Comissão</FormLabel>
                  <FormControl>
                    <MaskInput
                      mask="percentage"
                      value={f.value}
                      onValueChange={(_maskedValue, unmaskedValue) => {
                        f.onChange(unmaskedValue)
                      }}
                      placeholder="10"
                      invalid={
                        !!form.formState.errors.services?.[index]?.commission
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-4 ml-auto items-center">
              <FormField
                control={form.control}
                name={`services.${index}.active`}
                render={({ field: f }) => (
                  <FormItem className="flex items-center">
                    <FormControl>
                      <Checkbox
                        checked={f.value}
                        onCheckedChange={checked =>
                          f.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <FormLabel>Ativo</FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
                className="h-10"
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}

        <Button type="submit" disabled={isPending} className="w-full">
          Salvar Serviços
          {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  )
}
