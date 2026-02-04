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
import { createCategory } from "@/http/categories/create-category"
import { createCategorySchema } from "@/lib/validations/category"

type Inputs = z.infer<typeof createCategorySchema>

export function CreateCategoryForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<Inputs>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      onSuccess?.()
    },
  })

  async function onSubmit(values: Inputs) {
    mutate({ ...values })
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
