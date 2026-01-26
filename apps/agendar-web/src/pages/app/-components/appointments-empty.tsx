import { Calendar } from "lucide-react";

export function AppointmentsEmpty() {
  return (
    <div className="py-12 text-center">
      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-lg font-medium text-foreground mb-1">
        Nenhum agendamento encontrado
      </p>
      <p className="text-sm text-muted-foreground">Tente ajustar os filtros</p>
    </div>
  );
}
