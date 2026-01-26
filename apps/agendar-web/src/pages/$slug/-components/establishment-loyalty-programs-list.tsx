import { Card } from "@/components/ui/card";
import type { PublicLoyaltyProgram } from "@/http/public/get-public-loyalties";

export function EstablishmentLoyaltyProgramsList({
  programs,
}: {
  programs: PublicLoyaltyProgram[];
}) {
  if (!programs.length) {
    return (
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Programas de Fidelidade
        </h3>
        <p className="text-muted-foreground text-sm">
          Nenhum programa de fidelidade disponível no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Programas de Fidelidade
      </h3>
      <div className="space-y-4">
        {programs.map((program, index) => (
          <LoyaltyProgramItem key={index} program={program} />
        ))}
      </div>
    </div>
  );
}

function LoyaltyProgramItem({ program }: { program: PublicLoyaltyProgram }) {
  return (
    <Card className="p-5 flex flex-col gap-4 bg-card rounded-xl border border-border shadow-sm">
      {/* Cabeçalho */}
      <div>
        <h4 className="text-lg font-semibold text-card-foreground">
          {program.name}
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          Junte pontos em seus serviços e troque por recompensas exclusivas.
        </p>
      </div>

      {/* Recompensa */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-sm">
          🎁 Recompensa:{" "}
          <span className="font-medium text-foreground">
            {program.serviceRewardName}
          </span>
        </p>
        <p className="text-sm">
          ⭐ Necessário:{" "}
          <span className="font-medium text-foreground">
            {program.requiredPoints} pontos
          </span>
        </p>
      </div>

      {/* Regras */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          Como acumular pontos:
        </p>
        <ul className="list-disc list-inside space-y-1">
          {program.rules.map((rule, i) => (
            <li key={i} className="text-sm text-muted-foreground">
              Ao realizar{" "}
              <span className="font-medium">{rule.serviceName}</span> você ganha{" "}
              <span className="font-semibold">{rule.points} ponto(s)</span>.
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
