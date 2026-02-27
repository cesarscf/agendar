import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { set } from "date-fns"
import { ArrowLeft, Check, Loader2, User } from "lucide-react"
import React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import {
  type CreateAppointmentRequest,
  createAppointment,
} from "@/http/appointments/create-appointment"
import { createPublicCustomer } from "@/http/public/create-public-customer"
import type { PublicEstablishment } from "@/http/public/get-public-establishment"
import { getPublicServiceById } from "@/http/public/get-public-service-by-id"
import { getPublicServiceProfessionals } from "@/http/public/get-public-service-professionals"
import { formatDate, formatPriceFromCents, onlyNumbers } from "@/lib/utils"
import type { CreateCustomerRequest } from "@/lib/validations/customer"
import { CalendarBooking } from "./calendar-booking"
import { CreateCustomerForm } from "./customer-form"

type Step = "professional" | "calendar" | "customer" | "summary" | "success"

interface SchedulingProps {
  slug: string
  serviceId: string
  establishment: PublicEstablishment
}

const steps = [
  { key: "professional", label: "Profissional" },
  { key: "calendar", label: "Horário" },
  { key: "customer", label: "Seus dados" },
  { key: "summary", label: "Resumo" },
  { key: "success", label: "Concluído" },
] as const

export function SchedulingFromService({
  slug,
  serviceId,
  establishment,
}: SchedulingProps) {
  const [loading, setLoading] = React.useState(false)
  const queryClient = useQueryClient()
  const [step, setStep] = React.useState<Step>("professional")
  const [selectedProfessionalId, setSelectedProfessionalId] = React.useState<
    string | null
  >(null)
  const [selectedDate, setSelectedDate] = React.useState<Date>()
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
  const [customerData, setCustomerData] =
    React.useState<CreateCustomerRequest | null>(null)

  const customerFormRef = React.useRef<any>(null)

  const { data: service, isLoading: serviceLoading } = useQuery({
    queryKey: ["service", slug, serviceId],
    queryFn: () => getPublicServiceById({ slug, serviceId }),
  })

  const { data: professionals, isLoading: professionalsLoading } = useQuery({
    queryKey: ["service-professionals", slug, serviceId],
    queryFn: () => getPublicServiceProfessionals({ slug, serviceId }),
  })

  const { mutateAsync: createAppointmentMutate, isPending } = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["public", "time-slots"],
      })
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      })
    },
  })

  const isLoading = serviceLoading || professionalsLoading
  const selectedProfessional = professionals?.find(
    p => p.id === selectedProfessionalId
  )

  async function handleConfirmBooking() {
    setLoading(true)

    if (
      !selectedProfessionalId ||
      !selectedDate ||
      !selectedTime ||
      !customerData
    ) {
      setLoading(false)
      return
    }

    const [hours, minutes] = selectedTime.split(":").map(Number)
    const startTime = set(selectedDate, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    })

    const customerCreated = await createPublicCustomer({
      ...customerData,
      slug,
    })
    if (!customerCreated) {
      setLoading(false)
      return toast.error("Falha ao criar o usuário")
    }

    const payload: CreateAppointmentRequest = {
      employeeId: selectedProfessionalId,
      serviceId,
      date: selectedDate,
      startTime,
      customerPhone: onlyNumbers(customerData.phoneNumber!),
      establishmentId: establishment.id,
    }

    await createAppointmentMutate(payload)
    setStep("success")
    setLoading(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 animate-pulse w-full max-w-md">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  const currentIndex = steps.findIndex(s => s.key === step)

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4 pb-4">
          {establishment.logoUrl ? (
            <img
              src={establishment.logoUrl}
              alt={establishment.name}
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
          )}
          <h2 className="text-lg font-semibold text-center">
            {establishment.name}
          </h2>

          <div className="flex items-start justify-between w-full max-w-sm px-2">
            {steps.map((s, index) => {
              const isActive = index === currentIndex
              const isCompleted = index < currentIndex

              return (
                <div key={s.key} className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      flex items-center justify-center w-9 h-9 shrink-0 rounded-full border-2 transition-all
                      ${
                        isActive
                          ? "border-primary bg-primary text-white"
                          : ""
                      }
                      ${
                        isCompleted
                          ? "border-primary bg-primary/20 text-primary"
                          : ""
                      }
                      ${
                        !isActive && !isCompleted
                          ? "border-muted-foreground/30 text-muted-foreground"
                          : ""
                      }
                    `}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                  </div>

                  <span
                    className={`mt-1 text-[10px] font-medium text-center leading-tight min-h-[1rem] transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-transparent"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-6">
          {service && (
            <div className="text-center space-y-1">
              <h3 className="font-medium text-base">{service.name}</h3>
              <span className="font-semibold text-primary">
                {formatPriceFromCents(service.price)}
              </span>
            </div>
          )}

          {step === "professional" && (
            <div className="space-y-4">
              <h3 className="font-medium text-center">
                Escolha o profissional
              </h3>
              <div className="space-y-3">
                {professionals?.map(p => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      selectedProfessionalId === p.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedProfessionalId(p.id)}
                  >
                    {p.avatarUrl ? (
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {p.biography}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "calendar" && (
            <CalendarBooking
              serviceId={serviceId}
              employeeId={selectedProfessionalId}
              establishmentId={establishment.id}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          )}

          {step === "customer" && (
            <CreateCustomerForm
              onSubmit={values => {
                setCustomerData(values)
                setStep("summary")
              }}
              formRef={customerFormRef}
              establishmentSlug={establishment.slug}
              serviceId={serviceId}
            />
          )}

          {step === "summary" && (
            <div className="space-y-4">
              <h3 className="font-medium text-center">Resumo do agendamento</h3>
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-medium">Serviço:</span> {service?.name}
                </p>
                <p>
                  <span className="font-medium">Profissional:</span>{" "}
                  {selectedProfessional?.name}
                </p>
                <p>
                  <span className="font-medium">Data:</span>{" "}
                  {selectedDate && formatDate(selectedDate, "dd/MM/yyyy")}
                </p>
                <p>
                  <span className="font-medium">Horário:</span> {selectedTime}
                </p>
                <p>
                  <span className="font-medium">Cliente:</span>{" "}
                  {customerData?.name}
                </p>
                <p>
                  <span className="font-medium">Telefone:</span>{" "}
                  {customerData?.phoneNumber}
                </p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-medium text-lg">Agendamento confirmado!</h3>
              <p className="text-sm text-muted-foreground">
                Você receberá uma confirmação por WhatsApp.
              </p>
              <div className="text-sm space-y-1">
                <p>{service?.name}</p>
                <p>{selectedProfessional?.name}</p>
                {selectedDate && (
                  <p>
                    {formatDate(selectedDate, "dd/MM/yyyy")} às {selectedTime}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {step === "professional" && (
              <Button
                className="w-full"
                disabled={!selectedProfessionalId}
                onClick={() => setStep("calendar")}
              >
                Escolher horário
              </Button>
            )}

            {step === "calendar" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setStep("professional")}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                </Button>
                <Button
                  className="flex-1"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep("customer")}
                >
                  Continuar
                </Button>
              </>
            )}

            {step === "customer" && (
              <>
                <Button variant="outline" onClick={() => setStep("calendar")}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => customerFormRef.current?.submit()}
                >
                  Continuar
                </Button>
              </>
            )}

            {step === "summary" && (
              <>
                <Button variant="outline" onClick={() => setStep("customer")}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirmBooking}
                  disabled={isPending || loading}
                >
                  {(isPending || loading) ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Confirmar"
                  )}
                </Button>
              </>
            )}

            {step === "success" && (
              <Button
                className="w-full"
                onClick={() => {
                  setStep("professional")
                  setSelectedProfessionalId(null)
                  setSelectedDate(undefined)
                  setSelectedTime(null)
                  setCustomerData(null)
                }}
              >
                Fazer novo agendamento
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
