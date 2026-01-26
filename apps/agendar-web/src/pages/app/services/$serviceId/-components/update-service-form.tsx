import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import LogoUploader from "@/components/logo-uploader";
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
import { MaskInput } from "@/components/ui/mask-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getCategories } from "@/http/categories/get-categories";
import { deleteService } from "@/http/services/delete-service";
import { updateService } from "@/http/services/update-service";
import { uploadImage } from "@/lib/upload-image";
import { convertCentsToUnmasked, formatDurationToString } from "@/lib/utils";
import { type Service, updateServiceSchema } from "@/lib/validations/service";

type Inputs = z.infer<typeof updateServiceSchema>;

export function UpdateServiceForm({ service }: { service: Service }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    service.categories?.map((cat) => cat.id) || [],
  );

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const form = useForm<Inputs>({
    resolver: zodResolver(updateServiceSchema),
    defaultValues: {
      id: service.id,
      name: service.name,
      description: service.description,
      active: service.active,
      durationInMinutes: formatDurationToString(
        Number(service.durationInMinutes),
      ),
      price: convertCentsToUnmasked(service.price),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [service.id] });

      setIsLoading(false);
    },
  });

  const { mutateAsync: deleteServiceMutate, isPending: deleteIsPending } =
    useMutation({
      mutationFn: deleteService,
    });

  async function onSubmit(values: Inputs) {
    setIsLoading(true);
    let image: string | undefined;

    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);

      image = imageUrl;
    } else {
      image = service.image;
    }

    mutate({
      ...values,
      image: image ?? undefined,
      id: service.id,
      categoryIds: selectedCategories,
    });
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
                <Input placeholder="Digite aqui o nome do serviço" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Categorias</FormLabel>
          <FormControl>
            <Select
              value={""}
              onValueChange={(value) => {
                if (value && !selectedCategories.includes(value)) {
                  setSelectedCategories([...selectedCategories, value]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Adicionar categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter(
                    (category) => !selectedCategories.includes(category.id),
                  )
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </FormControl>
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId);
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
                          selectedCategories.filter((id) => id !== categoryId),
                        );
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Imagem do serviço</FormLabel>
          <FormControl>
            <div className="flex justify-start">
              <LogoUploader
                value={imageFile}
                imageUrl={service.image ?? null}
                onChange={setImageFile}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>

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
                    field.onChange(unmaskedValue);
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
              <FormLabel>Duração do serviço</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite aqui a duração do serviço"
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
                  "Tem certeza que deseja excluir este serviço? Todos os dados relacionados serão excluídos.",
                )
              ) {
                await deleteServiceMutate(service.id);

                queryClient.invalidateQueries({ queryKey: ["services"] });

                navigate({ to: "/app/services" });
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
  );
}
