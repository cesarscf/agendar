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
import { getCategories } from "@/http/categories/get-categories"
import { createService } from "@/http/services/create-service"
import { uploadImage } from "@/lib/upload-image"
import { createServiceSchema } from "@/lib/validations/service"

export const Route = createFileRoute("/app/services/new/")({
  component: NewService,
})
type Inputs = z.infer<typeof createServiceSchema>

function NewService() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = React.useState(false)
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  )

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const form = useForm<Inputs>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      durationInMinutes: "",
      active: true,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      navigate({ to: "/app/services" })
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    },
  })

  async function onSubmit(values: Inputs) {
    setIsLoading(true)
    let image: string | undefined

    if (imageFile) {
      const imageUrl = await uploadImage(imageFile)

      image = imageUrl
    }

    mutate({
      ...values,
      image: image ?? undefined,
      active: true,
      categoryIds:
        selectedCategories.length > 0 ? selectedCategories : undefined,
    })
  }

  return (
    <div className="p-6">
      <Button size="icon" variant="outline" asChild>
        <Link to="/app/services">
          <ChevronLeft />
        </Link>
      </Button>

      <div className="my-4">
        <h1 className="text-2xl font-bold text-foreground">
          Adicionar um novo serviço
        </h1>
        <p className="text-muted-foreground">
          Crie um novo serviço para sua loja
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
                    placeholder="Digite aqui o nome do serviço"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Categorias</FormLabel>
            <FormControl>
              <Select
                value={selectedCategories[0] || ""}
                onValueChange={value => {
                  if (value && !selectedCategories.includes(value)) {
                    setSelectedCategories([...selectedCategories, value])
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter(
                      category => !selectedCategories.includes(category.id)
                    )
                    .map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormControl>
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategories.map(categoryId => {
                  const category = categories.find(c => c.id === categoryId)
                  return (
                    <div
                      key={categoryId}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                    >
                      {category?.name}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategories(
                            selectedCategories.filter(id => id !== categoryId)
                          )
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Imagem do serviço</FormLabel>
            <FormControl>
              <div className="flex justify-start">
                <LogoUploader value={imageFile} onChange={setImageFile} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do serviço*</FormLabel>
                <FormControl>
                  <MaskInput
                    mask="currency"
                    currency="BRL"
                    locale="pt-BR"
                    placeholder="R$ 0,00"
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
            name="durationInMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração do serviço*</FormLabel>
                <FormControl>
                  <Input placeholder="40 minutos" {...field} />
                </FormControl>
                <FormMessage />
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
                    placeholder="Digite aqui a descrição do serviço"
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
            {isPending || isLoading ? (
              <Loader2 className="size-4 animate-spin ml-2" />
            ) : null}
          </Button>
        </form>
      </Form>
    </div>
  )
}
