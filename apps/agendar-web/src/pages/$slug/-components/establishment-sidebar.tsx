import { Clock, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PublicEstablishment } from "@/http/public/get-public-establishment";
import { maskPhone } from "@/lib/masks";
import { convertUTCToLocalTime } from "@/lib/utils";

export function EstablishmentSidebar({
  establishment,
}: {
  establishment: PublicEstablishment;
}) {
  return (
    <div className="w-full lg:w-96 p-4 sm:p-6 space-y-4 sm:space-y-6 lg:border-l border-border">
      <Card className="p-4 bg-card border-border hidden lg:block">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-semibold text-card-foreground">Localização</h4>
        </div>
        <p className="text-sm text-muted-foreground text-balance">
          {establishment.address}
        </p>
        {establishment.googleMapsLink && (
          <Button size="sm" variant="outline" asChild>
            <a
              href={establishment.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver no Mapa
            </a>
          </Button>
        )}
      </Card>

      <BusinessHours availabilities={establishment.availabilities} />

      {establishment.phone && (
        <Card className="p-4 bg-card border-border gap-2 hidden lg:block">
          <h4 className="font-semibold text-card-foreground">Contato</h4>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-card-foreground">
              {maskPhone(establishment.phone)}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}

function BusinessHours({
  availabilities,
}: {
  availabilities: PublicEstablishment["availabilities"];
}) {
  const weekdays: Record<number, string> = {
    0: "Domingo",
    1: "Segunda-feira",
    2: "Terça-feira",
    3: "Quarta-feira",
    4: "Quinta-feira",
    5: "Sexta-feira",
    6: "Sábado",
  };

  function HourRow({ day, hours }: { day: string; hours: string | null }) {
    return (
      <div className="flex justify-between text-sm">
        <span className="text-card-foreground">{day}</span>
        <span className="text-muted-foreground">{hours ?? "Fechado"}</span>
      </div>
    );
  }

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h4 className="font-semibold text-card-foreground">
          Horário de atendimento
        </h4>
      </div>
      <div className="space-y-2">
        {Object.entries(weekdays).map(([key, label]) => {
          const availability = availabilities.find(
            (a) => a.weekday === Number(key),
          );

          let hours: string | null = null;

          function formatHour(time: string) {
            const localTime = convertUTCToLocalTime(time);
            const [h, m] = localTime.split(":");
            return `${h.padStart(2, "0")}:${m}`;
          }

          if (availability) {
            if (availability.breakStart && availability.breakEnd) {
              hours = `${formatHour(availability.opensAt)} - ${formatHour(
                availability.breakStart,
              )}, ${formatHour(availability.breakEnd)} - ${formatHour(
                availability.closesAt,
              )}`;
            } else {
              hours = `${formatHour(availability.opensAt)} - ${formatHour(
                availability.closesAt,
              )}`;
            }
          }

          return <HourRow key={key} day={label} hours={hours} />;
        })}
      </div>
    </Card>
  );
}
