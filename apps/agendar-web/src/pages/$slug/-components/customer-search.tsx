import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AlertCircle,
  Calendar,
  Loader2,
  Package,
  Search,
  Trophy,
  XCircle,
} from "lucide-react"
import React from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GetCustomerInfoByPhone,
  type GetCustomerInfoByPhoneResponse,
} from "@/http/customers/get-customer-info-by-phone"
import { cancelAppointmentPublic } from "@/http/public/cancel-appointment-public"
import { maskPhone } from "@/lib/masks"
import { cn } from "@/lib/utils"

interface CustomerSearchProps {
  slug: string
  compact?: boolean
}

export function CustomerSearch({ slug, compact = false }: CustomerSearchProps) {
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [customerData, setCustomerData] =
    React.useState<GetCustomerInfoByPhoneResponse | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = React.useState<{
    id: string
    serviceName: string
  } | null>(null)

  const queryClient = useQueryClient()

  const searchCustomerMutation = useMutation({
    mutationFn: async (phone: string) => {
      return await GetCustomerInfoByPhone({ slug, phone })
    },
    onSuccess: data => {
      console.log(data)
      setCustomerData(data)

      setIsModalOpen(true)
      setError(null)
    },
    onError: () => {
      setError("Cliente não encontrado. Verifique o número e tente novamente.")
    },
  })

  const cancelAppointmentMutation = useMutation({
    mutationFn: async ({
      id,
      phoneNumber,
    }: {
      id: string
      phoneNumber: string
    }) => {
      return await cancelAppointmentPublic({ slug, id, phoneNumber })
    },
    onSuccess: () => {
      toast.success("Agendamento cancelado com sucesso!")
      setCancelDialogOpen(false)
      setAppointmentToCancel(null)
      const cleanPhone = phoneNumber.replace(/\D/g, "")
      searchCustomerMutation.mutate(cleanPhone)
      queryClient.invalidateQueries({
        queryKey: ["public", "customer", slug, cleanPhone],
      })
    },
    onError: () => {
      toast.error("Erro ao cancelar agendamento. Tente novamente.")
    },
  })

  const handleSearch = () => {
    setError(null)
    const cleanPhone = phoneNumber.replace(/\D/g, "")
    if (cleanPhone.length === 11) {
      searchCustomerMutation.mutate(cleanPhone)
    } else {
      setError("Por favor, insira um número de telefone válido com 11 dígitos.")
    }
  }

  const handleCancelClick = (appointmentId: string, serviceName: string) => {
    setAppointmentToCancel({ id: appointmentId, serviceName })
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = () => {
    if (appointmentToCancel && customerData) {
      const cleanPhone = customerData.customer.phoneNumber.replace(/\D/g, "")
      cancelAppointmentMutation.mutate({
        id: appointmentToCancel.id,
        phoneNumber: cleanPhone,
      })
    }
  }

  React.useEffect(() => {
    const cleanPhone = phoneNumber.replace(/\D/g, "")

    if (cleanPhone.length === 11) {
      const debounceTimer = setTimeout(() => {
        handleSearch()
      }, 800)

      return () => clearTimeout(debounceTimer)
    } else if (cleanPhone.length > 0 && cleanPhone.length < 11) {
      setError(null)
    }
  }, [phoneNumber])

  if (compact) {
    return (
      <>
        <div className="relative flex-1 sm:min-w-[250px]">
          <Input
            placeholder="Consulta de agendamos, pacotes e fidelidade"
            value={phoneNumber}
            onChange={e => setPhoneNumber(maskPhone(e.target.value))}
            className={cn("pr-9 h-10", error && "border-destructive")}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
          {searchCustomerMutation.isPending ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-sm transition-colors"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent
            className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            onInteractOutside={e => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Informações do Cliente</DialogTitle>
              <DialogDescription>
                {customerData?.customer.name} -{" "}
                {customerData && maskPhone(customerData.customer.phoneNumber)}
              </DialogDescription>
            </DialogHeader>

            {customerData && (
              <Tabs
                defaultValue="appointments"
                className="flex-1 overflow-hidden flex flex-col"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="appointments"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Agendamentos
                  </TabsTrigger>
                  <TabsTrigger
                    value="packages"
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    Pacotes
                  </TabsTrigger>
                  <TabsTrigger
                    value="loyalty"
                    className="flex items-center gap-2"
                  >
                    <Trophy className="h-4 w-4" />
                    Fidelidade
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto mt-4 pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                  <TabsContent
                    value="appointments"
                    className="space-y-3 m-0 h-full"
                  >
                    {customerData.appointments.length > 0 ? (
                      <div className="space-y-3">
                        {customerData.appointments.map((appointment, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold">
                                    {appointment.serviceName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {appointment.employeeName}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <span
                                    className={cn(
                                      "text-xs px-2 py-1 rounded-full font-medium",
                                      appointment.status === "completed" &&
                                        "bg-green-100 text-green-700",
                                      appointment.status === "scheduled" &&
                                        "bg-blue-100 text-blue-700",
                                      appointment.status === "canceled" &&
                                        "bg-red-100 text-red-700"
                                    )}
                                  >
                                    {appointment.status === "completed" &&
                                      "Concluído"}
                                    {appointment.status === "scheduled" &&
                                      "Agendado"}
                                    {appointment.status === "canceled" &&
                                      "Cancelado"}
                                  </span>
                                  {appointment.status === "scheduled" && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-auto px-2 py-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() =>
                                        handleCancelClick(
                                          appointment.id,
                                          appointment.serviceName
                                        )
                                      }
                                    >
                                      <XCircle className="h-4 w-4" />
                                      <span className="ml-1 text-xs">
                                        Cancelar
                                      </span>
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Data</p>
                                  <p className="font-medium">
                                    {new Date(
                                      appointment.date
                                    ).toLocaleDateString("pt-BR")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Horário
                                  </p>
                                  <p className="font-medium">
                                    {new Date(
                                      appointment.startTime
                                    ).toLocaleTimeString("pt-BR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {new Date(
                                      appointment.endTime
                                    ).toLocaleTimeString("pt-BR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Check-in
                                  </p>
                                  <p
                                    className={cn(
                                      "font-medium",
                                      appointment.checkin
                                        ? "text-green-600"
                                        : "text-muted-foreground"
                                    )}
                                  >
                                    {appointment.checkin ? "Sim" : "Não"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Pagamento
                                  </p>
                                  <p
                                    className={cn(
                                      "font-medium",
                                      appointment.paid
                                        ? "text-green-600"
                                        : "text-yellow-600"
                                    )}
                                  >
                                    {appointment.paid ? "Pago" : "Pendente"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Nenhum agendamento encontrado.</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Packages Tab */}
                  <TabsContent
                    value="packages"
                    className="space-y-3 m-0 h-full"
                  >
                    {customerData.packages.length > 0 ? (
                      <div className="space-y-3">
                        {customerData.packages.map((pkg, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold">
                                    {pkg.packageName}
                                  </p>
                                  {pkg.packageDescription && (
                                    <p className="text-sm text-muted-foreground">
                                      {pkg.packageDescription}
                                    </p>
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    "text-xs px-2 py-1 rounded-full font-medium",
                                    pkg.paid
                                      ? "bg-green-100 text-green-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  )}
                                >
                                  {pkg.paid ? "Pago" : "Pendente"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-muted-foreground">
                                    Sessões
                                  </p>
                                  <p className="font-medium">
                                    {pkg.remainingSessions} de{" "}
                                    {pkg.totalSessions} restantes
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Comprado em
                                  </p>
                                  <p className="font-medium">
                                    {new Date(
                                      pkg.purchasedAt
                                    ).toLocaleDateString("pt-BR")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Nenhum pacote encontrado.</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Loyalty Programs Tab */}
                  <TabsContent value="loyalty" className="space-y-3 m-0 h-full">
                    {customerData.loyaltyPrograms.length > 0 ? (
                      <div className="space-y-3">
                        {customerData.loyaltyPrograms.map(program => (
                          <Card key={program.id} className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <p className="font-semibold">{program.name}</p>
                                {program.canRedeem && (
                                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                                    Pode resgatar
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Progresso
                                  </span>
                                  <span className="font-medium">
                                    {program.points} / {program.requiredPoints}{" "}
                                    pontos
                                  </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{
                                      width: `${program.progress}%`,
                                    }}
                                  />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Recompensa: {program.rewardService.name}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Nenhum programa de fidelidade encontrado.</p>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            )}

            <div className="flex justify-end mt-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cancel Appointment Confirmation Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar agendamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja cancelar o agendamento de{" "}
                <strong>{appointmentToCancel?.serviceName}</strong>? Esta ação
                não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Não</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmCancel}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={cancelAppointmentMutation.isPending}
              >
                {cancelAppointmentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  "Sim, cancelar"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    <>
      <div className="mt-4 md:mr-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Informações de clientes"
              value={phoneNumber}
              onChange={e => setPhoneNumber(maskPhone(e.target.value))}
              className={cn("pr-10", error && "border-destructive")}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <Button
            onClick={handleSearch}
            disabled={searchCustomerMutation.isPending}
            size="default"
            className="sm:w-auto"
          >
            {searchCustomerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              "Buscar"
            )}
          </Button>
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={open => {
          if (open) setIsModalOpen(true)
        }}
      >
        <DialogContent
          className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
          onInteractOutside={e => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Informações do Cliente</DialogTitle>
            <DialogDescription>
              {customerData?.customer.name} -{" "}
              {customerData && maskPhone(customerData.customer.phoneNumber)}
            </DialogDescription>
          </DialogHeader>

          {customerData && (
            <Tabs
              defaultValue="appointments"
              className="flex-1 overflow-hidden flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="appointments"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Agendamentos
                </TabsTrigger>
                <TabsTrigger
                  value="packages"
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Pacotes
                </TabsTrigger>
                <TabsTrigger
                  value="loyalty"
                  className="flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  Fidelidade
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto mt-4 pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {/* Appointments Tab */}
                <TabsContent
                  value="appointments"
                  className="space-y-3 m-0 h-full"
                >
                  {customerData.appointments.length > 0 ? (
                    <div className="space-y-3">
                      {customerData.appointments.map((appointment, index) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold">
                                  {appointment.serviceName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.employeeName}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <span
                                  className={cn(
                                    "text-xs px-2 py-1 rounded-full font-medium",
                                    appointment.status === "completed" &&
                                      "bg-green-100 text-green-700",
                                    appointment.status === "scheduled" &&
                                      "bg-blue-100 text-blue-700",
                                    appointment.status === "canceled" &&
                                      "bg-red-100 text-red-700"
                                  )}
                                >
                                  {appointment.status === "completed" &&
                                    "Concluído"}
                                  {appointment.status === "scheduled" &&
                                    "Agendado"}
                                  {appointment.status === "canceled" &&
                                    "Cancelado"}
                                </span>
                                {appointment.status === "scheduled" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-auto px-2 py-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() =>
                                      handleCancelClick(
                                        appointment.id,
                                        appointment.serviceName
                                      )
                                    }
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span className="ml-1 text-xs">
                                      Cancelar
                                    </span>
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground">Data</p>
                                <p className="font-medium">
                                  {new Date(
                                    appointment.date
                                  ).toLocaleDateString("pt-BR")}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Horário</p>
                                <p className="font-medium">
                                  {new Date(
                                    appointment.startTime
                                  ).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  -{" "}
                                  {new Date(
                                    appointment.endTime
                                  ).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Check-in
                                </p>
                                <p
                                  className={cn(
                                    "font-medium",
                                    appointment.checkin
                                      ? "text-green-600"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {appointment.checkin ? "Sim" : "Não"}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Pagamento
                                </p>
                                <p
                                  className={cn(
                                    "font-medium",
                                    appointment.paid
                                      ? "text-green-600"
                                      : "text-yellow-600"
                                  )}
                                >
                                  {appointment.paid ? "Pago" : "Pendente"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>Nenhum agendamento encontrado.</p>
                    </div>
                  )}
                </TabsContent>

                {/* Packages Tab */}
                <TabsContent value="packages" className="space-y-3 m-0 h-full">
                  {customerData.packages.length > 0 ? (
                    <div className="space-y-3">
                      {customerData.packages.map((pkg, index) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold">
                                  {pkg.packageName}
                                </p>
                                {pkg.packageDescription && (
                                  <p className="text-sm text-muted-foreground">
                                    {pkg.packageDescription}
                                  </p>
                                )}
                              </div>
                              <span
                                className={cn(
                                  "text-xs px-2 py-1 rounded-full font-medium",
                                  pkg.paid
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                )}
                              >
                                {pkg.paid ? "Pago" : "Pendente"}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground">Sessões</p>
                                <p className="font-medium">
                                  {pkg.remainingSessions} de {pkg.totalSessions}{" "}
                                  restantes
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Comprado em
                                </p>
                                <p className="font-medium">
                                  {new Date(pkg.purchasedAt).toLocaleDateString(
                                    "pt-BR"
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>Nenhum pacote encontrado.</p>
                    </div>
                  )}
                </TabsContent>

                {/* Loyalty Programs Tab */}
                <TabsContent value="loyalty" className="space-y-3 m-0 h-full">
                  {customerData.loyaltyPrograms.length > 0 ? (
                    <div className="space-y-3">
                      {customerData.loyaltyPrograms.map(program => (
                        <Card key={program.id} className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <p className="font-semibold">{program.name}</p>
                              {program.canRedeem && (
                                <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                                  Pode resgatar
                                </span>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Progresso
                                </span>
                                <span className="font-medium">
                                  {program.points} / {program.requiredPoints}{" "}
                                  pontos
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{
                                    width: `${program.progress}%`,
                                  }}
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Recompensa: {program.rewardService.name}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>Nenhum programa de fidelidade encontrado.</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          )}

          <div className="flex justify-end mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar o agendamento de{" "}
              <strong>{appointmentToCancel?.serviceName}</strong>? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelAppointmentMutation.isPending}
            >
              {cancelAppointmentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                "Sim, cancelar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
