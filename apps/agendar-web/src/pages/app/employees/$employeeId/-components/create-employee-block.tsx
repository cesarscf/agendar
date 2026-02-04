import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, setHours, setMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Clock2Icon, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import type z from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { createEmployeeBlock } from "@/http/employees/create-employee-block"
import { cn, convertLocalDateToUTC } from "@/lib/utils"
import { createBlockSchema } from "@/lib/validations/blocks"

type Inputs = z.infer<typeof createBlockSchema>

export function CreateEmployeeBlock({
  employeeId,
  onSuccess,
}: {
  employeeId: string
  onSuccess?: () => void
}) {
  const queryClient = useQueryClient()
  const form = useForm<Inputs>({
    resolver: zodResolver(createBlockSchema),
    defaultValues: {
      startsAt: undefined,
      endsAt: undefined,
      reason: "",
    },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createEmployeeBlock,
  })

  async function onSubmit(values: Inputs) {
    await mutateAsync({
      ...values,
      employeeId,
      startsAt: convertLocalDateToUTC(values.startsAt),
      endsAt: convertLocalDateToUTC(values.endsAt),
    })
    queryClient.invalidateQueries({
      queryKey: ["employee", employeeId, "blocks"],
    })

    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-md"
      >
        <FormField
          control={form.control}
          name="startsAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Hora de Início</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, "PPP HH:mm", { locale: ptBR })
                        : "Selecione a data e hora de início"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={date => {
                      if (date) {
                        const existingDate = field.value || new Date()
                        const newDateTime = setMinutes(
                          setHours(date, existingDate.getHours()),
                          existingDate.getMinutes()
                        )
                        field.onChange(newDateTime)
                      } else {
                        field.onChange(undefined)
                      }
                    }}
                    locale={ptBR}
                  />
                  <div className="p-3 border-t border-border">
                    <div className="relative flex w-full items-center gap-2">
                      <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                      <Input
                        type="time"
                        className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        onChange={e => {
                          if (!e.target.value) return
                          const [hours, minutes] = e.target.value
                            .split(":")
                            .map(Number)
                          if (Number.isNaN(hours) || Number.isNaN(minutes))
                            return
                          const existingDate = field.value || new Date()
                          const newDateTime = setMinutes(
                            setHours(existingDate, hours),
                            minutes
                          )
                          field.onChange(newDateTime)
                        }}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endsAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Hora de Fim</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, "PPP HH:mm", { locale: ptBR })
                        : "Selecione a data e hora de fim"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={date => {
                      if (date) {
                        const existingDate = field.value || new Date()
                        const newDateTime = setMinutes(
                          setHours(date, existingDate.getHours()),
                          existingDate.getMinutes()
                        )
                        field.onChange(newDateTime)
                      } else {
                        field.onChange(undefined)
                      }
                    }}
                    initialFocus
                    locale={ptBR}
                  />
                  <div className="p-3 border-t border-border">
                    <div className="relative flex w-full items-center gap-2">
                      <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                      <Input
                        type="time"
                        className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        onChange={e => {
                          if (!e.target.value) return
                          const [hours, minutes] = e.target.value
                            .split(":")
                            .map(Number)
                          if (Number.isNaN(hours) || Number.isNaN(minutes))
                            return
                          const existingDate = field.value || new Date()
                          const newDateTime = setMinutes(
                            setHours(existingDate, hours),
                            minutes
                          )
                          field.onChange(newDateTime)
                        }}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
  )
}
