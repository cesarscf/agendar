import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Gift, Hammer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getLoyaltyPrograms } from "@/http/loyalty/get-loyalty-programs";

export const Route = createFileRoute("/app/loyalty-programs/")({
  component: LoyaltyPrograms,
});

function LoyaltyPrograms() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["loyalty-programs"],
    queryFn: getLoyaltyPrograms,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
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
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Programas de Fidelidade
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus programas de fidelidade
          </p>
        </div>
        <Button asChild>
          <Link to="/app/loyalty-programs/new">Adicionar</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((program) => (
          <Card
            key={program.id}
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-border"
            onClick={() =>
              navigate({
                to: "/app/loyalty-programs/$programId",
                params: { programId: program.id },
              })
            }
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base leading-tight group-hover:text-primary transition-colors">
                      {program.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Recompensa: {program.serviceRewardName}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={program.active ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {program.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Pontos Necessários:
                </span>
                <span className="font-medium text-foreground">
                  {program.requiredPoints}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground text-xs block mb-1">
                  Regras:
                </span>
                <ul className="text-xs space-y-1">
                  {program.rules.map((rule) => (
                    <li key={rule.serviceId} className="flex justify-between">
                      <span>{rule.serviceName}</span>
                      <span className="font-medium">+{rule.points} pts</span>
                    </li>
                  ))}
                </ul>
              </div>

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
            </CardContent>
          </Card>
        ))}
      </div>

      {data?.length === 0 && (
        <div className="text-center py-12">
          <Hammer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum programa encontrado
          </h3>
          <p className="text-muted-foreground">
            Comece criando seu primeiro programa de fidelidade
          </p>
        </div>
      )}
    </div>
  );
}
