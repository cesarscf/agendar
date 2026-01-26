import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import {
  ArrowRight,
  ArrowUp,
  Hammer,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSubscription } from "@/hooks/use-subscription"
import { getEmployees } from "@/http/employees/get-employees"
import { getPlan } from "@/http/payments/get-plan"
import { queryKeys } from "@/lib/query-keys"

export const Route = createFileRoute("/app/employees/")({
  component: Employees,
})

function Employees() {
  const navigate = useNavigate()

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  })

  const { currentSubscription } = useSubscription()

  const { data: plan, isLoading: planIsLoading } = useQuery({
    queryKey: queryKeys.plan(currentSubscription?.plan.id ?? ""),
    queryFn: () => getPlan(currentSubscription?.plan.id!),
    enabled: !!currentSubscription?.plan.id,
  })

  const totalEmployees = employees?.length ?? 0
  const maxEmployees = plan?.maximumProfessionalsIncluded ?? 1
  const hasReachedLimit = totalEmployees >= maxEmployees

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-xl" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-24" />
                      <div className="h-3 bg-muted rounded w-16" />
                    </div>
                  </div>
                  <div className="h-6 bg-muted rounded-full w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded w-20" />
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus funcionários
          </p>
        </div>
        {hasReachedLimit ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button disabled={planIsLoading}>Adicionar</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">
                    Limite de funcionários atingido
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Você está usando {totalEmployees} de {maxEmployees}{" "}
                    funcionário(s) permitidos no plano{" "}
                    <span className="font-medium">
                      {currentSubscription?.plan.name}
                    </span>
                    .
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Para adicionar mais profissionais, faça o upgrade do seu
                  plano.
                </p>
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate({ to: "/", href: "/#plans" })
                  }}
                >
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Fazer Upgrade de Plano
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button asChild disabled={planIsLoading}>
            <Link to="/app/employees/new">Adicionar</Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees?.map(employee => (
          <Card
            key={employee.id}
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-border"
            onClick={() => {
              navigate({
                to: "/app/employees/$employeeId",
                params: { employeeId: employee.id },
              })
            }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {employee.avatarUrl ? (
                      <img
                        src={employee.avatarUrl || "/placeholder.svg"}
                        alt={employee.name}
                        className="object-cover w-12 h-12 rounded-xl border-2 border-border/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-base leading-tight group-hover:text-primary transition-colors">
                      {employee.name}
                    </h3>
                    {employee.biography && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {employee.biography}
                      </p>
                    )}
                  </div>
                </div>
                <Badge
                  variant={employee.active ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {employee.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {employee.email && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-muted-foreground">Email:</span>
                    </div>
                    <span className="font-medium text-blue-600">
                      {employee.email}
                    </span>
                  </div>
                )}
                {employee.phone && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">Telefone:</span>
                    </div>
                    <span className="font-medium text-green-600">
                      {employee.phone}
                    </span>
                  </div>
                )}
                {employee.address && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <span className="text-muted-foreground">Endereço:</span>
                    </div>
                    <span className="font-medium text-purple-600 line-clamp-1">
                      {employee.address}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between group-hover:bg-primary/10 transition-colors"
                  >
                    Ver detalhes
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {employees?.length === 0 && (
        <div className="text-center py-12">
          <Hammer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum funcionário encontrado
          </h3>
          <p className="text-muted-foreground">
            Comece criando seu primeiro funcionário
          </p>
        </div>
      )}
    </div>
  )
}
