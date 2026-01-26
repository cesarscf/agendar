import { useQuery } from "@tanstack/react-query"
import { Gift, Loader2, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getCustomerLoyaltyPrograms } from "@/http/customers/get-customer-loyalty-programs"

interface CustomerLoyaltyProgramsProps {
  customerPhone: string
  establishmentId: string
}

export function CustomerLoyaltyPrograms({
  customerPhone,
  establishmentId,
}: CustomerLoyaltyProgramsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["customer-loyalty-programs", customerPhone],
    queryFn: () =>
      getCustomerLoyaltyPrograms({ customerPhone, establishmentId }),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Erro ao carregar programas de fidelidade
        </p>
      </div>
    )
  }

  if (!data?.loyaltyPrograms || data.loyaltyPrograms.length === 0) {
    return (
      <div className="text-center py-8">
        <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Nenhum programa de fidelidade
        </h3>
        <p className="text-muted-foreground">
          Este cliente ainda não participa de nenhum programa de fidelidade.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Programas de Fidelidade</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.loyaltyPrograms.map(program => (
          <Card key={program.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{program.name}</CardTitle>
                <Badge variant={program.active ? "default" : "secondary"}>
                  {program.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {program.rewardService.name}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{Math.round(program.progress)}%</span>
                </div>
                <Progress value={program.progress} className="h-2" />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Pontos atuais:</span>
                <span className="font-medium">{program.points}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Pontos necessários:
                </span>
                <span className="font-medium">{program.requiredPoints}</span>
              </div>

              {program.canRedeem && (
                <Badge
                  variant="outline"
                  className="w-full justify-center text-green-600 border-green-600"
                >
                  <Gift className="h-3 w-3 mr-1" />
                  Pode resgatar recompensa
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
