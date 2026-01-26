import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { deletePackage } from "@/http/packages/delete-package";
import { updatePackage } from "@/http/packages/update-package";
import { uploadImage } from "@/lib/upload-image";
import { convertCentsToUnmasked } from "@/lib/utils";
import {
  type PackageWithItems,
  updatePackageSchema,
} from "@/lib/validations/package";
import type { Service } from "@/lib/validations/service";

type Inputs = z.infer<typeof updatePackageSchema>;

export function UpdatePackageForm({
  pkg,
  services,
}: {
  pkg: PackageWithItems;
  services: Service[];
}) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const queryClient = useQueryClient();

  const form = useForm<Inputs>({
    resolver: zodResolver(updatePackageSchema),
    defaultValues: {
      id: pkg.id,
      name: pkg.name,
      price: convertCentsToUnmasked(pkg.price),
      active: pkg.active,
      commission: pkg.commission,
      description: pkg.description ?? "",
      quantity: pkg.items[0]?.quantity ?? 0,
      serviceId: pkg.items[0]?.serviceId ?? "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updatePackage,
  });

  const { mutateAsync: deletePackageMutate, isPending: deleteIsPending } =
    useMutation({
      mutationFn: deletePackage,
    });

  const watchPrice = form.watch("price");
  const watchQuantity = form.watch("quantity");

  const unitValue =
    watchPrice && watchQuantity && !Number.isNaN(watchQuantity)
      ? Number(watchPrice) / Number(watchQuantity || 1)
      : 0;

  async function onSubmit(values: Inputs) {
    setIsLoading(true);

    let image: string | undefined;

    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      image = imageUrl;
    }

    await mutateAsync({ ...values, image });

    queryClient.invalidateQueries({ queryKey: ["package", pkg.id] });

    toast.success("Alterações salvas com sucesso!");

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values);
        })}
        className="space-y-8 max-w-md"
      >
        <FormItem>
          <FormLabel>Imagem do pacote</FormLabel>
          <FormControl>
            <div className="flex justify-start">
              <LogoUploader
                value={imageFile}
                imageUrl={pkg.image ?? null}
                onChange={setImageFile}
              />
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
                <Input placeholder="Digite aqui o nome do pacote" {...field} />
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
          name="commission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comissão</FormLabel>
              <FormControl>
                <MaskInput
                  mask="percentage"
                  value={field.value}
                  onValueChange={(_maskedValue, unmaskedValue) => {
                    field.onChange(unmaskedValue);
                  }}
                  placeholder="0.00%"
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
                    {services.map((service) => (
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
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
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

        {/* Descrição */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite a descrição do pacote aqui"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botões */}
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
                  "Tem certeza que deseja excluir este pacote? Todos os dados relacionados serão excluídos.",
                )
              ) {
                await deletePackageMutate(pkg.id);

                queryClient.invalidateQueries({ queryKey: ["packages"] });

                navigate({ to: "/app/packages" });
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
