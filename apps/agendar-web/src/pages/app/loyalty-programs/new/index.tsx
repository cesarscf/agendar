import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Loader2, Plus, Trash } from "lucide-react";
import React from "react";
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
import { createLoyaltyProgram } from "@/http/loyalty/create-loyalty-program";
import { getServices } from "@/http/services/get-services";
import { createLoyaltyProgramSchema } from "@/lib/validations/loyalty-program";

export const Route = createFileRoute("/app/loyalty-programs/new/")({
  component: NewLoyaltyProgram,
});

type Inputs = z.infer<typeof createLoyaltyProgramSchema>;

function NewLoyaltyProgram() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(createLoyaltyProgramSchema),
    defaultValues: {
      serviceRewardId: "",
      name: "",
      requiredPoints: 0,
      rules: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createLoyaltyProgram,
    onError: () => {
      setIsLoading(false);
    },
  });

  async function onSubmit(values: Inputs) {
    setIsLoading(true);

    await mutateAsync(values);

    queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] });
    navigate({ to: "/app/loyalty-programs" });

    setIsLoading(false);
  }

  return (
    <div className="p-6">
      <Button size="icon" variant="outline" asChild>
        <Link to="/app/loyalty-programs">
          <ChevronLeft />
        </Link>
      </Button>

      <div className="my-4">
        <h1 className="text-2xl font-bold text-foreground">
          Adicionar programa de fidelidade
        </h1>
        <p className="text-muted-foreground">
          Cadastre um novo programa de fidelidade e defina as regras.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-lg"
        >
          <FormField
            control={form.control}
            name="serviceRewardId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviço de recompensa</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services?.map((service) => (
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do programa</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do programa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requiredPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pontos necessários</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 100"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <div className="flex justify-between items-center mb-2">
              <FormLabel>Regras</FormLabel>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => append({ serviceId: "", points: 1 })}
              >
                <Plus className="size-4 mr-1" /> Adicionar regra
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((fieldItem, index) => (
                <div
                  key={fieldItem.id}
                  className="flex items-end gap-4 border p-4 rounded-lg"
                >
                  <FormField
                    control={form.control}
                    name={`rules.${index}.serviceId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Serviço</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {services?.map((service) => (
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
                    name={`rules.${index}.points`}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <FormLabel>Pontos</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 50"
                            min={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

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
  );
}
