import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
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

import { updateCategory } from "@/http/categories/update-category"
import { type Category, categorySchema } from "@/lib/validations/category"

type Inputs = z.infer<typeof categorySchema>

export function UpdateCategoryForm({
  category,
  onSuccess,
}: {
  category: Category
  onSuccess?: () => void
}) {
  const form = useForm<Inputs>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
    },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateCategory,
  })

  async function onSubmit(values: Inputs) {
    await mutateAsync({ ...values, id: category.id })

    onSuccess?.()
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-lg"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite aqui o nome da categoria"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          Salvar
          {isPending ? <Loader2 className="size-4 animate-spin ml-2" /> : null}
        </Button>
      </form>
    </Form>
  )
}
