import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cancelAppointment } from "@/http/appointments/cancel-appointment"
import type { Appointment } from "@/http/appointments/get-appointments"

const cancelSchema = z.object({
  reason: z.string().optional(),
})

type CancelFormValues = z.infer<typeof cancelSchema>

export function CancelDialog({
  data,
  onSuccess,
}: {
  data: Appointment
  onSuccess: () => void
}) {
  const [open, setOpen] = useState(false)

  const form = useForm<CancelFormValues>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      reason: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      onSuccess()
      setOpen(false)
      form.reset()
    },
    onError: () => {
      toast.error("Falha ao cancelar agendamento. Tente novamente.")
    },
  })

  const handleSubmit = (values: CancelFormValues) => {
    mutate({
      appointmentId: data.id,
      reason: values.reason,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <X className="h-4 w-4 mr-1" />
          Cancelar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cancelar Agendamento</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja cancelar o agendamento de{" "}
            <strong>{data.customer.name}</strong> para{" "}
            <strong>{data.service.name}</strong>?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo do cancelamento (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                     
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Voltar
              </Button>
              <Button type="submit" disabled={isPending} variant="destructive">
                {isPending && <Loader2 className="animate-spin size-4 mr-2" />}
                Confirmar Cancelamento
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
