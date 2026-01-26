import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MaskInput } from "@/components/ui/mask-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cancelAppointment } from "@/http/appointments/cancel-appointment";
import { checkin, type PaymentType } from "@/http/appointments/checkin";
import type { Appointment } from "@/http/appointments/get-appointments";
import { checkBonus } from "@/http/loyalty/check-bonus";

const checkinCompletedSchema = z.object({
  status: z.literal("completed"),
  paymentType: z.string().min(1, "Selecione o tipo de pagamento"),
  paymentAmount: z.string().min(1, "Informe o valor do pagamento"),
  notes: z.string().optional(),
});

const cancelSchema = z.object({
  status: z.literal("canceled"),
  reason: z.string().optional(),
});

export type CheckinCompletedFormValues = z.infer<typeof checkinCompletedSchema>;
export type CancelFormValues = z.infer<typeof cancelSchema>;

export function CheckinDialog({
  data,
  onSuccess,
}: {
  data: Appointment;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    "completed" | "canceled"
  >("completed");
  const queryClient = useQueryClient();

  const { data: bonusData } = useQuery({
    queryKey: ["check-bonus", data.customer.id, data.service.id],
    queryFn: () =>
      checkBonus({
        customerId: data.customer.id,
        serviceId: data.service.id,
      }),
    enabled: open,
  });

  const { mutate: mutateCheckin, isPending: isPendingCheckin } = useMutation({
    mutationFn: checkin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["check-bonus", data.customer.id, data.service.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["customer-packages", data.customer.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["customer-loyalty-programs", data.customer.phoneNumber],
      });
      onSuccess();
      setOpen(false);
    },
    onError: () => {
      toast.error("Falha ao realizar o check-in. Tente novamente.");
    },
  });

  const { mutate: mutateCancel, isPending: isPendingCancel } = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      onSuccess();
      setOpen(false);
      cancelForm.reset();
    },
    onError: () => {
      toast.error("Falha ao cancelar agendamento. Tente novamente.");
    },
  });

  const isFirstPackageSession = data.package && !data.package.paid;
  const isPackageAlreadyPaid = data.package?.paid;
  const hasBonus = bonusData?.hasBonus || false;

  const getCheckinDefaultValues = (): CheckinCompletedFormValues => {
    // Lógica para appointment com package já pago
    if (isPackageAlreadyPaid) {
      return {
        status: "completed",
        paymentType: "package",
        paymentAmount: "0",
        notes: `Pagamento via pacote "${data.package?.name}"`,
      };
    }

    // Lógica padrão (sem package ou primeiro serviço do package)
    return {
      status: "completed",
      paymentType: "pix",
      paymentAmount:
        isFirstPackageSession && data.package
          ? data.package.price
          : data.service.servicePrice,
      notes:
        isFirstPackageSession && data.package
          ? `Pagamento do pacote "${data.package.name}" - Primeiro serviço`
          : "",
    };
  };

  const checkinForm = useForm<CheckinCompletedFormValues>({
    resolver: zodResolver(checkinCompletedSchema),
    defaultValues: getCheckinDefaultValues(),
  });

  const cancelForm = useForm<CancelFormValues>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      status: "canceled",
      reason: "",
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: ...
  useEffect(() => {
    const subscription = checkinForm.watch((value, { name }) => {
      if (name === "paymentType" && value.paymentType) {
        if (value.paymentType === "loyalty") {
          checkinForm.setValue("paymentAmount", "0");
          checkinForm.setValue(
            "notes",
            `Pagamento via fidelidade - ${bonusData?.currentPoints || 0} pontos disponíveis`,
          );
        } else if (value.paymentType !== "package") {
          // Preenche com o valor correto: pacote se for primeira sessão, senão serviço
          const correctAmount =
            isFirstPackageSession && data.package
              ? data.package.price
              : data.service.servicePrice;
          checkinForm.setValue("paymentAmount", correctAmount);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [checkinForm, bonusData?.currentPoints]);

  // Reseta os formulários ao alternar entre status
  // biome-ignore lint/correctness/useExhaustiveDependencies: ...
  useEffect(() => {
    if (selectedStatus === "canceled") {
      cancelForm.reset({
        status: "canceled",
        reason: "",
      });
    } else {
      checkinForm.reset(getCheckinDefaultValues());
    }
  }, [selectedStatus]);

  const currentPaymentType = checkinForm.watch("paymentType");
  const shouldDisablePaymentAmount =
    isPackageAlreadyPaid || currentPaymentType === "loyalty";

  const handleCheckinSubmit = async (values: CheckinCompletedFormValues) => {
    mutateCheckin({
      appointmentId: data.id,
      status: "completed",
      paymentType: values.paymentType as PaymentType,
      paymentAmount: values.paymentAmount,
      notes: values.notes,
    });
  };

  const handleCancelSubmit = async (values: CancelFormValues) => {
    mutateCancel({
      appointmentId: data.id,
      reason: values.reason,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Fazer Check-in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {selectedStatus === "canceled"
              ? "Cancelar Agendamento"
              : "Check-in"}
          </DialogTitle>
          <DialogDescription>
            {selectedStatus === "canceled" ? (
              <>
                Tem certeza que deseja cancelar o agendamento de{" "}
                <strong>{data.customer.name}</strong> para{" "}
                <strong>{data.service.name}</strong>?
              </>
            ) : (
              "Preencha as informações abaixo para concluir o check-in do cliente."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <p className="text-sm font-medium mb-1">Status</p>
            <Select
              value={selectedStatus}
              onValueChange={(value: "completed" | "canceled") =>
                setSelectedStatus(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedStatus === "canceled" ? (
            <Form {...cancelForm}>
              <form
                onSubmit={cancelForm.handleSubmit(handleCancelSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={cancelForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo do cancelamento (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite o motivo do cancelamento..."
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
                  <Button
                    type="submit"
                    disabled={isPendingCancel}
                    variant="destructive"
                  >
                    {isPendingCancel && (
                      <Loader2 className="animate-spin size-4 mr-2" />
                    )}
                    Confirmar Cancelamento
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <Form {...checkinForm}>
              <form
                onSubmit={checkinForm.handleSubmit(handleCheckinSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={checkinForm.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Pagamento</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value === "loyalty") {
                            checkinForm.setValue("paymentAmount", "0");
                            checkinForm.setValue(
                              "notes",
                              `Pagamento via fidelidade - ${bonusData?.currentPoints || 0} pontos disponíveis`,
                            );
                          } else if (value !== "package") {
                            // Preenche com o valor correto: pacote se for primeira sessão, senão serviço
                            const correctAmount =
                              isFirstPackageSession && data.package
                                ? data.package.price
                                : data.service.servicePrice;
                            checkinForm.setValue(
                              "paymentAmount",
                              correctAmount,
                            );
                          }
                        }}
                        disabled={isPackageAlreadyPaid}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o pagamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pix">Pix</SelectItem>
                          <SelectItem value="credit_card">
                            Cartão de Crédito
                          </SelectItem>
                          <SelectItem value="debit_card">
                            Cartão de Débito
                          </SelectItem>
                          <SelectItem value="cash">Dinheiro</SelectItem>
                          {data.package && !isFirstPackageSession && (
                            <SelectItem value="package">Pacote</SelectItem>
                          )}
                          {hasBonus && (
                            <SelectItem value="loyalty">Fidelidade</SelectItem>
                          )}
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={checkinForm.control}
                  name="paymentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Pagamento</FormLabel>
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
                          disabled={shouldDisablePaymentAmount}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={checkinForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anotações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite alguma observação..."
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
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isPendingCheckin}>
                    {isPendingCheckin && (
                      <Loader2 className="animate-spin size-4 mr-2" />
                    )}
                    Confirmar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
