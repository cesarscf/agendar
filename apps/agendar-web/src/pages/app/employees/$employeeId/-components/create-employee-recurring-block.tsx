import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock2Icon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";

import { createEmployeeRecurringBlock } from "@/http/employees/create-employee-recurring-block";
import { convertLocalTimeToUTC, weekdays } from "@/lib/utils";
import { createRecurringBlockSchema } from "@/lib/validations/blocks";

type Inputs = z.infer<typeof createRecurringBlockSchema>;

export function CreateEmployeeRecurringBlock({
  employeeId,
  onSuccess,
}: {
  employeeId: string;
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<Inputs>({
    resolver: zodResolver(createRecurringBlockSchema),
    defaultValues: {
      endTime: "",
      reason: "",
      startTime: "",
      weekday: 0,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createEmployeeRecurringBlock,
  });

  async function onSubmit(values: Inputs) {
    await mutateAsync({
      ...values,
      employeeId,
      startTime: convertLocalTimeToUTC(values.startTime),
      endTime: convertLocalTimeToUTC(values.endTime),
    });

    queryClient.invalidateQueries({
      queryKey: ["employee", employeeId, "recurring-blocks"],
    });

    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-md"
      >
        <FormField
          control={form.control}
          name="weekday"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Dia da semana</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o dia da semana" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {weekdays.map((day, index) => (
                    <SelectItem key={day} value={String(index)}>
                      {day}
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
          name="startTime"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Hora de Início</FormLabel>
              <FormControl>
                <div className="relative flex w-full items-center gap-2">
                  <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                  <Input
                    type="time"
                    className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora de Fim</FormLabel>
              <FormControl>
                <div className="relative flex w-full items-center gap-2">
                  <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                  <Input
                    type="time"
                    className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite aqui o motivo do bloqueio"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="ml-auto" disabled={isPending}>
          Salvar
          {isPending ? <Loader2 className="size-4 animate-spin ml-2" /> : null}
        </Button>
      </form>
    </Form>
  );
}
