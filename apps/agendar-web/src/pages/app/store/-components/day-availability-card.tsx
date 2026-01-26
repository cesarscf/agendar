import { Clock2Icon, Coffee, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { Availability } from "@/lib/validations/availability";

interface DayAvailabilityCardProps {
  weekdayLabel: string;
  availability: Availability;
  onUpdate: (availability: Availability) => void;
}

export function DayAvailabilityCard({
  weekdayLabel,
  availability,
  onUpdate,
}: DayAvailabilityCardProps) {
  const isActive = !!(availability.opensAt && availability.closesAt);
  const hasBreakTime = !!(availability.breakStart && availability.breakEnd);

  const toggleDayActive = (active: boolean) => {
    if (active) {
      onUpdate({
        ...availability,
        opensAt: availability.opensAt || "09:00",
        closesAt: availability.closesAt || "18:00",
      });
    } else {
      onUpdate({
        ...availability,
        opensAt: "",
        closesAt: "",
        breakStart: "",
        breakEnd: "",
      });
    }
  };

  const toggleBreak = (hasBreak: boolean) => {
    if (hasBreak) {
      onUpdate({
        ...availability,
        breakStart: availability.breakStart || "12:00",
        breakEnd: availability.breakEnd || "13:00",
      });
    } else {
      onUpdate({
        ...availability,
        breakStart: "",
        breakEnd: "",
      });
    }
  };

  const clearDay = () => {
    onUpdate({
      ...availability,
      opensAt: "",
      closesAt: "",
      breakStart: "",
      breakEnd: "",
    });
  };

  const updateField = (key: keyof Availability, value: string) => {
    onUpdate({
      ...availability,
      [key]: value,
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{weekdayLabel}</h3>
          <div className="flex items-center gap-2">
            {isActive && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearDay}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <Label className="text-sm">
                {isActive ? "Aberto" : "Fechado"}
              </Label>
              <Switch checked={isActive} onCheckedChange={toggleDayActive} />
            </div>
          </div>
        </div>

        {isActive && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Abre às</Label>
                <div className="relative flex w-full items-center gap-2">
                  <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                  <Input
                    type="time"
                    className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    value={availability.opensAt}
                    onChange={(e) => updateField("opensAt", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fecha às</Label>
                <div className="relative flex w-full items-center gap-2">
                  <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                  <Input
                    type="time"
                    className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    value={availability.closesAt}
                    onChange={(e) => updateField("closesAt", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  <Label className="text-sm">Intervalo para almoço</Label>
                </div>
                <Switch checked={hasBreakTime} onCheckedChange={toggleBreak} />
              </div>

              {hasBreakTime && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label>Início do intervalo</Label>
                    <div className="relative flex w-full items-center gap-2">
                      <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                      <Input
                        type="time"
                        className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        value={availability.breakStart}
                        onChange={(e) =>
                          updateField("breakStart", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Fim do intervalo</Label>
                    <div className="relative flex w-full items-center gap-2">
                      <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
                      <Input
                        type="time"
                        className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        value={availability.breakEnd}
                        onChange={(e) =>
                          updateField("breakEnd", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
