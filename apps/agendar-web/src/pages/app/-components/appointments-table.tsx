import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Briefcase, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Appointment } from "@/http/appointments/get-appointments";
import { CancelDialog } from "./cancel-dialog";
import { CheckinDialog } from "./checkin-dialog";

interface AppointmentsTableProps {
  appointments: Appointment[];
  onInvalidateQueries: () => void;
}

const statusMap = {
  scheduled: { label: "Agendado", variant: "scheduled" as const },
  completed: { label: "Concluído", variant: "completed" as const },
  canceled: { label: "Cancelado", variant: "canceled" as const },
};

export function AppointmentsTable({
  appointments,
  onInvalidateQueries,
}: AppointmentsTableProps) {
  const handleCheckinSuccess = () => {
    toast.success("Check-in realizado com sucesso!");
    onInvalidateQueries();
  };

  const handleCancelSuccess = () => {
    toast.success("Agendamento cancelado com sucesso!");
    onInvalidateQueries();
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Profissional</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow
              key={appointment.id}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground text-sm">
                    {appointment.customer.name}
                  </p>
                  {appointment.package && (
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        📦 Pacote
                      </Badge>
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{appointment.professional.name}</span>
                </div>
              </TableCell>

              <TableCell>
                <p className="text-sm font-medium">
                  {appointment.service.name}
                </p>
              </TableCell>

              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(appointment.startTime, "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(appointment.startTime, "HH:mm", {
                      locale: ptBR,
                    })}{" "}
                    -{" "}
                    {format(appointment.endTime, "HH:mm", {
                      locale: ptBR,
                    })}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    statusMap[appointment.status as keyof typeof statusMap]
                      ?.variant || "default"
                  }
                >
                  {statusMap[appointment.status as keyof typeof statusMap]
                    ?.label || appointment.status}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                {appointment.status === "scheduled" && (
                  <div className="flex gap-2 justify-end">
                    <CheckinDialog
                      onSuccess={handleCheckinSuccess}
                      data={appointment}
                    />
                    <CancelDialog
                      onSuccess={handleCancelSuccess}
                      data={appointment}
                    />
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
