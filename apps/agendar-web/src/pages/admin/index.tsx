import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { differenceInDays, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPartners } from "@/http/admin/get-partners"
import { requireAdminAuth } from "@/lib/admin-route-guards"
import { cn } from "@/lib/utils"

function getTrialDaysRemaining(currentPeriodEnd: string): number {
  const endDate = new Date(currentPeriodEnd)
  const now = new Date()
  return Math.max(0, differenceInDays(endDate, now))
}

export const Route = createFileRoute("/admin/")({
  beforeLoad: requireAdminAuth,
  component: AdminDashboard,
})

const statusLabels: Record<string, string> = {
  active: "Ativo",
  canceled: "Cancelado",
  past_due: "Vencido",
  trialing: "Trial",
  unpaid: "Nao pago",
  incomplete: "Incompleto",
  incomplete_expired: "Expirado",
  paused: "Pausado",
}

const statusVariants: Record<string, "completed" | "canceled" | "scheduled" | "secondary"> = {
  active: "completed",
  trialing: "scheduled",
  canceled: "canceled",
  past_due: "canceled",
  unpaid: "canceled",
  incomplete: "secondary",
  incomplete_expired: "canceled",
  paused: "secondary",
}

function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "partners"],
    queryFn: getPartners,
  })

  const partners = data?.partners ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Partners</h2>
        <p className="text-muted-foreground">
          {partners.length} parceiros cadastrados
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Localizacao</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead className="text-center">Estabelecimentos</TableHead>
                <TableHead>Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-muted-foreground text-center py-10"
                  >
                    Nenhum parceiro cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                partners.map(partner => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">
                      {partner.name}
                    </TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell>
                      {partner.city && partner.state
                        ? `${partner.city}, ${partner.state}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {partner.subscription ? (
                        partner.subscription.status === "trialing" ? (
                          <div>
                            <div className="font-medium text-blue-600">
                              Trial Gratuito
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {getTrialDaysRemaining(
                                partner.subscription.currentPeriodEnd
                              )}{" "}
                              dias restantes
                            </div>
                          </div>
                        ) : partner.subscription.plan ? (
                          <div>
                            <div className="font-medium">
                              {partner.subscription.plan.name}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              R$ {partner.subscription.plan.price}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {partner.subscription ? (
                        <Badge
                          variant={
                            statusVariants[partner.subscription.status] ??
                            "secondary"
                          }
                        >
                          {statusLabels[partner.subscription.status] ??
                            partner.subscription.status}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Sem plano</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {partner.subscription ? (
                        <div>
                          <span
                            className={cn(
                              new Date(partner.subscription.currentPeriodEnd) <
                                new Date() && "text-red-500"
                            )}
                          >
                            {format(
                              new Date(partner.subscription.currentPeriodEnd),
                              "dd/MM/yyyy",
                              { locale: ptBR }
                            )}
                          </span>
                          {partner.subscription.status === "trialing" && (
                            <div className="text-muted-foreground text-xs">
                              Fim do trial
                            </div>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {partner.establishmentsCount}
                    </TableCell>
                    <TableCell>
                      {format(new Date(partner.createdAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
