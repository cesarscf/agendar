import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ChevronLeft, Loader2 } from "lucide-react"
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
import { MaskInput } from "@/components/ui/mask-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createPackage } from "@/http/packages/create-package"
import { getServices } from "@/http/services/get-services"
import { uploadImage } from "@/lib/upload-image"
import { createPackageSchema } from "@/lib/validations/package"

export const Route = createFileRoute("/app/packages/new/")({
  component: NewPackage,
})

type Inputs = z.infer<typeof createPackageSchema>

function NewPackage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isLoading, setIsLoading] = React.useState(false)
  const [imageFile, setImageFile] = React.useState<File | null>(null)

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  })

  const form = useForm<Inputs>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      name: "",
      price: "",
      commission: "",
      description: "",
      active: true,
      serviceId: "",
      quantity: 1,
    },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPackage,
  })

  const watchPrice = form.watch("price")
  const watchQuantity = form.watch("quantity")

  const unitValue =
    watchPrice && watchQuantity && !Number.isNaN(watchQuantity)
      ? Number(watchPrice) / Number(watchQuantity || 1)
      : 0

  async function onSubmit(values: Inputs) {
    setIsLoading(true)
    let image: string | undefined

    if (imageFile) {
      const imageUrl = await uploadImage(imageFile)
      image = imageUrl
    }

    await mutateAsync({
      ...values,
      image,
      active: true,
      quantity: Number(values.quantity),
    })

    queryClient.invalidateQueries({ queryKey: ["packages"] })

    navigate({ to: "/app/packages" })
    setIsLoading(false)
  }

  return (
    <div className="p-6">
      <Button size="icon" variant="outline" asChild>
        <Link to="/app/packages">
          <ChevronLeft />
        </Link>
      </Button>

      <div className="my-4">
        <h1 className="text-2xl font-bold text-foreground">
          Adicionar um novo pacote
        </h1>
        <p className="text-muted-foreground">
          Adicione um novo pacote para sua loja
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-md"
        >
          <FormItem>
            <FormLabel>Imagem do pacote</FormLabel>
            <FormControl>
              <div className="flex justify-start">
                <LogoUploader value={imageFile} onChange={setImageFile} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do pacote</FormLabel>
                <FormControl>
                  <MaskInput
                    mask="currency"
                    currency="BRL"
                    locale="pt-BR"
                   
                    value={field.value}
                    onValueChange={(_maskedValue, unmaskedValue) => {
                      field.onChange(unmaskedValue)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comissão</FormLabel>
                <FormControl>
                  <MaskInput
                    mask="percentage"
                    value={field.value}
                    onValueChange={(_maskedValue, unmaskedValue) => {
                      field.onChange(unmaskedValue)
                    }}
                   
                    invalid={!!form.formState.errors.commission}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviço</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services?.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min="0"
                   
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
                {unitValue > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Valor por serviço:{" "}
                    <span className="font-medium">
                      {unitValue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                   
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="ml-auto"
            disabled={isPending || isLoading}
          >
            Salvar
            {isPending ||
              (isLoading && <Loader2 className="size-4 animate-spin ml-2" />)}
          </Button>
        </form>
      </Form>
    </div>
  )
}
