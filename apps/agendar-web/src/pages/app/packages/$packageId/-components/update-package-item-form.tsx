import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import type z from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updatePackageItems } from "@/http/packages/update-package-items";
import {
  type PackageItem,
  type UpdatePackageItemsRequest,
  updatePackageItemsSchema,
} from "@/lib/validations/package";
import type { Service } from "@/lib/validations/service";

interface UpdatePackageItemFormProps {
  items: PackageItem[];
  services: Service[];
  packageId: string;
}

export type Inputs = z.infer<typeof updatePackageItemsSchema>;

export function UpdatePackageItemForm({
  items,
  services,
  packageId,
}: UpdatePackageItemFormProps) {
  const form = useForm<Inputs>({
    resolver: zodResolver(updatePackageItemsSchema),
    defaultValues: {
      items: items.map((item) => ({
        serviceId: item.serviceId,
        quantity: item.quantity,
        name: item.name,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updatePackageItems,
  });

  async function handleSubmit(data: Inputs) {
    const payload: UpdatePackageItemsRequest = {
      items: data.items.map((item) => ({
        serviceId: item.serviceId,
        quantity: item.quantity,
      })),
    };

    await mutateAsync({ ...payload, packageId });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 max-w-md"
      >
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 mb-6 p-4 border rounded-md relative items-end"
          >
            <FormField
              control={form.control}
              name={`items.${index}.serviceId`}
              render={({ field: itemField }) => (
                <FormItem>
                  <FormLabel>Serviço</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      itemField.onChange(value);
                      const selectedService = services.find(
                        (s) => s.id === value,
                      );
                      if (selectedService) {
                        form.setValue(
                          `items.${index}.name`,
                          selectedService.name,
                        );
                      }
                    }}
                    value={itemField.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`items.${index}.quantity`}
              render={({ field: itemField }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      value={
                        Number.isNaN(itemField.value) ? "" : itemField.value
                      }
                      onChange={(e) =>
                        itemField.onChange(e.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
              className="w-full md:w-auto"
            >
              Remover
            </Button>
          </div>
        ))}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ serviceId: "", quantity: 1, name: "" })}
            className="w-full md:w-auto"
          >
            Adicionar Item
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto"
          >
            Salvar Itens do Pacote
            {isPending ? (
              <Loader2 className="size-4 animate-spin ml-2" />
            ) : null}
          </Button>
        </div>
      </form>
    </Form>
  );
}
