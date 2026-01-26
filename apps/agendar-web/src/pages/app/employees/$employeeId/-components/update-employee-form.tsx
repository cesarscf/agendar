import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import React from "react"
import { useForm } from "react-hook-form"
import type z from "zod"
import LogoUploader from "@/components/logo-uploader"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { deleteEmployee } from "@/http/employees/delete-employee"
import { updateEmployee } from "@/http/employees/update-employee"
import { maskPhone } from "@/lib/masks"
import { uploadImage } from "@/lib/upload-image"
import {
  type Employee,
  updateEmployeeSchema,
} from "@/lib/validations/employees"

type Inputs = z.infer<typeof updateEmployeeSchema>

export function UpdateEmployeeForm({ employee }: { employee: Employee }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isLoading, setIsLoading] = React.useState(false)
  const [imageFile, setImageFile] = React.useState<File | null>(null)

  const form = useForm<Inputs>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      id: employee.id,
      name: employee.name,
      phone: maskPhone(employee.phone ?? ""),
      email: employee.email,
      active: employee.active,
      address: employee.address,
      biography: employee.biography,
    },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateEmployee,
  })

  const { mutateAsync: deleteServiceMutate, isPending: deleteIsPending } =
    useMutation({
      mutationFn: deleteEmployee,
    })

  async function onSubmit(values: Inputs) {
    setIsLoading(true)
    let image: string | undefined

    if (imageFile) {
      const imageUrl = await uploadImage(imageFile)

      image = imageUrl
    } else {
      image = employee.avatarUrl
    }

    await mutateAsync({ ...values, avatarUrl: image, id: employee.id })

    queryClient.invalidateQueries({ queryKey: [employee.id] })

    setIsLoading(false)
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite aqui o telefone do profissional"
                  {...field}
                  onChange={e => field.onChange(maskPhone(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Imagem do profissional</FormLabel>
          <FormControl>
            <div className="flex justify-start">
              <LogoUploader
                value={imageFile}
                imageUrl={employee.avatarUrl ?? null}
                onChange={setImageFile}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite aqui a biografia do profissional"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-0.5">
                <FormLabel>Status - Ativo/Desativado</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-row gap-4">
          <Button type="submit" disabled={isPending || isLoading}>
            Salvar
            {isPending || isLoading ? (
              <Loader2 className="size-4 animate-spin ml-2" />
            ) : null}
          </Button>
          <Button
            variant="destructive"
            type="button"
            disabled={deleteIsPending || isLoading}
            onClick={async () => {
              if (
                confirm(
                  "Tem certeza que deseja excluir este funcionário? Todos os dados relacionados serão excluídos."
                )
              ) {
                await deleteServiceMutate(employee.id)

                queryClient.invalidateQueries({ queryKey: ["employees"] })

                navigate({ to: "/app/employees" })
              }
            }}
          >
            Excluir
            {deleteIsPending || isLoading ? (
              <Loader2 className="size-4 animate-spin ml-2" />
            ) : null}
          </Button>
        </div>
      </form>
    </Form>
  )
}
