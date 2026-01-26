import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, Loader2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  type CustomerPackage,
  getCustomerPackages,
} from "@/http/customers/get-customer-packages";

interface CustomerPackagesProps {
  customerId: string;
}

export function CustomerPackages({ customerId }: CustomerPackagesProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["customer-packages", customerId],
    queryFn: () => getCustomerPackages(customerId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Erro ao carregar pacotes do cliente
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum pacote encontrado</h3>
        <p className="text-muted-foreground">
          Este cliente ainda não possui nenhum pacote de serviços.
        </p>
      </div>
    );
  }

  const getPackageStatus = (pkg: CustomerPackage) => {
    if (pkg.remainingSessions === 0) {
      return {
        label: "Finalizado",
        variant: "secondary" as const,
        icon: CheckCircle,
      };
    }
    if (pkg.remainingSessions > 0) {
      return {
        label: "Em andamento",
        variant: "default" as const,
        icon: Clock,
      };
    }
    return { label: "Inativo", variant: "outline" as const, icon: Package };
  };

  const getUsagePercentage = (pkg: CustomerPackage) => {
    return (pkg.usedSessions / pkg.totalSessions) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Pacotes de Serviços</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((pkg) => {
          const status = getPackageStatus(pkg);
          const usagePercentage = getUsagePercentage(pkg);
          const StatusIcon = status.icon;

          return (
            <Card key={pkg.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {pkg.name || "Pacote sem nome"}
                  </CardTitle>
                  <Badge variant={status.variant}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                {pkg.description && (
                  <p className="text-sm text-muted-foreground">
                    {pkg.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso de uso</span>
                    <span>{Math.round(usagePercentage)}%</span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">
                      Serviços usados:
                    </span>
                    <p className="font-medium">{pkg.usedSessions}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">
                      Serviços restantes:
                    </span>
                    <p className="font-medium">{pkg.remainingSessions}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Total de serviços:
                  </span>
                  <span className="font-medium">{pkg.totalSessions}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Status do pagamento:
                  </span>
                  <Badge variant={pkg.paid ? "default" : "destructive"}>
                    {pkg.paid ? "Pago" : "Pendente"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
