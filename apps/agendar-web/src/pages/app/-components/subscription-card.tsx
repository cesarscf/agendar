import { ArrowUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Subscription {
  id: string
  status: string
  plan: {
    id: string
    name: string
    price: string
  }
}

interface Plan {
  maximumProfessionalsIncluded: number
  minimumProfessionalsIncluded: number
}

interface SimpleSubscriptionCardProps {
  subscription?: Subscription
  plan?: Plan
  totalEmployees: number
  isLoading?: boolean
  onUpgrade?: () => void
}

export function SimpleSubscriptionCard({
  subscription,
  plan,
  totalEmployees = 0,
  isLoading = false,
  onUpgrade,
}: SimpleSubscriptionCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-3">
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-muted rounded w-2/3"></div>
            <div className="h-2 bg-muted rounded w-full"></div>
            <div className="h-6 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription || !plan) {
    return (
      <Card className="w-full border-dashed">
        <CardContent className="p-3 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Nenhum plano ativo
          </p>
          <Button size="sm" className="w-full" onClick={onUpgrade}>
            Escolher Plano
          </Button>
        </CardContent>
      </Card>
    )
  }

  const isFreePlan = subscription.plan.name === "Plano Gratuito"
  const maxEmployees = plan.maximumProfessionalsIncluded
  const usagePercentage = isFreePlan ? 0 : (totalEmployees / maxEmployees) * 100
  const isNearLimit = !isFreePlan && usagePercentage >= 80

  return (
    <Card className="w-full py-2">
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">{subscription.plan.name}</h4>
          </div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>

        {!isFreePlan && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Funcionários</span>
              <span
                className={`font-medium ${isNearLimit ? "text-orange-600" : "text-muted-foreground"}`}
              >
                {totalEmployees}/{maxEmployees}
              </span>
            </div>

            <Progress
              value={usagePercentage}
              className={`h-1.5 ${isNearLimit ? "[&>div]:bg-orange-500" : "[&>div]:bg-green-500"}`}
            />
          </div>
        )}

        <Button
          size="sm"
          variant={isNearLimit ? "default" : "outline"}
          className="w-full h-7 text-xs"
          onClick={onUpgrade}
        >
          <ArrowUp className="h-3 w-3 mr-1" />
          {isNearLimit ? "Upgrade Necessário" : "Fazer Upgrade"}
        </Button>
      </CardContent>
    </Card>
  )
}
