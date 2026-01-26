import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus, Trash } from "lucide-react";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Switch } from "@/components/ui/switch";
import { activateLoyaltyProgram } from "@/http/loyalty/activate-loyalty-program";
import { deleteLoyaltyProgram } from "@/http/loyalty/delete-loyalty-program";
import { desactiveLoyaltyProgram } from "@/http/loyalty/desactive-loyalty-program";
import { updateLoyaltyProgram } from "@/http/loyalty/update-loyalty-program";
import {
  type LoyaltyProgram,
  updateLoyaltyProgramSchema,
} from "@/lib/validations/loyalty-program";
import type { Service } from "@/lib/validations/service";

type Inputs = z.infer<typeof updateLoyaltyProgramSchema>;

export function UpdateLoyaltyProgram({
  program,
  services,
}: {
  program: LoyaltyProgram;
  services: Service[];
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isActive, setIsActive] = React.useState(program.active);

  const form = useForm<Inputs>({
    resolver: zodResolver(updateLoyaltyProgramSchema),
    defaultValues: {
      id: program.id,
      name: program.name,
      requiredPoints: program.requiredPoints,
      serviceRewardId: program.serviceRewardId,
      rules: program.rules.map((it) => ({
        points: it.points,
        serviceId: it.serviceId,
        serviceName: it.serviceName,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateLoyaltyProgram,
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message || "Erro ao atualizar programa de fidelidade");
    },
  });

  const toggleActivationMutation = useMutation({
    mutationFn: async (active: boolean) => {
      if (active) {
        await activateLoyaltyProgram(program.id);
      } else {
        await desactiveLoyaltyProgram(program.id);
      }
    },
    onSuccess: (_, active) => {
      setIsActive(active);
      queryClient.invalidateQueries({
        queryKey: ["loyalty-program", program.id],
      });
      queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] });
      toast.success(
        active
          ? "Programa de fidelidade ativado com sucesso!"
          : "Programa de fidelidade desativado com sucesso!",
      );
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao alterar status do programa");
    },
  });

  const {
    mutateAsync: deleteLoyaltyProgramMutate,
    isPending: deleteIsPending,
  } = useMutation({
    mutationFn: deleteLoyaltyProgram,
  });

  const handleToggleActivation = (checked: boolean) => {
    toggleActivationMutation.mutate(checked);
  };

  async function onSubmit(values: Inputs) {
    setIsLoading(true);

    await mutateAsync(values);

    queryClient.invalidateQueries({
      queryKey: ["loyalty-program", program.id],
    });
    queryClient.invalidateQueries({ queryKey: ["loyalty-programs"] });

    toast.success("Programa de fidelidade atualizado com sucesso!");

    setIsLoading(false);
  }

  return (
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
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite aqui o nome do pacote" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <FormLabel>Status do Programa</FormLabel>
            <p className="text-sm text-muted-foreground">
              {isActive
                ? "Programa ativo e disponível para clientes"
                : "Programa desativado"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {isActive ? "Ativo" : "Inativo"}
            </span>
            <Switch
              checked={isActive}
              disabled={toggleActivationMutation.isPending}
              onCheckedChange={handleToggleActivation}
            />
          </div>
        </div>

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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Regras</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  points: 1,
                  serviceId: "",
                  serviceName: "Nome do serviço",
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar regra
            </Button>
          </div>

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
                name={`rules.${index}.points`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel>Pontos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

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
                  "Tem certeza que deseja excluir este programa de fidelidade? Todos os dados relacionados serão excluídos.",
                )
              ) {
                await deleteLoyaltyProgramMutate(program.id);

                queryClient.invalidateQueries({
                  queryKey: ["loyalty-programs"],
                });

                navigate({ to: "/app/loyalty-programs" });
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
