import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, FilterIcon, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Filters {
  status: string;
  startDate: string | null;
  endDate: string | null;
  serviceId: string | null;
  employeeId: string | null;
  perPage: number;
  page: number;
}

interface AppointmentsFiltersProps {
  filters: Filters;
  services?: Array<{ id: string; name: string }>;
  employees?: Array<{ id: string; name: string }>;
  onFiltersChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
}

export function AppointmentsFilters({
  filters,
  services,
  employees,
  onFiltersChange,
  onClearFilters,
}: AppointmentsFiltersProps) {
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    filters.startDate ? parseISO(filters.startDate) : undefined,
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    filters.endDate ? parseISO(filters.endDate) : undefined,
  );

  React.useEffect(() => {
    setStartDate(filters.startDate ? parseISO(filters.startDate) : undefined);
  }, [filters.startDate]);

  React.useEffect(() => {
    setEndDate(filters.endDate ? parseISO(filters.endDate) : undefined);
  }, [filters.endDate]);

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    onFiltersChange({
      startDate: date ? format(date, "yyyy-MM-dd") : null,
      page: 1,
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    onFiltersChange({
      endDate: date ? format(date, "yyyy-MM-dd") : null,
      page: 1,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg my-4">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtros:</span>
      </div>

      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ status: value, page: 1 })}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="scheduled">Agendado</SelectItem>
          <SelectItem value="completed">Concluído</SelectItem>
          <SelectItem value="canceled">Cancelado</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-40 justify-start text-left font-normal",
              !startDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "dd/MM/yyyy") : "Data inicial"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={handleStartDateChange}
            initialFocus
            locale={ptBR}
            formatters={{
              formatWeekdayName: (date) =>
                date.toLocaleString("pt-BR", { weekday: "short" }),
            }}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-40 justify-start text-left font-normal",
              !endDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "dd/MM/yyyy") : "Data final"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={handleEndDateChange}
            initialFocus
            locale={ptBR}
            formatters={{
              formatWeekdayName: (date) =>
                date.toLocaleString("pt-BR", { weekday: "short" }),
            }}
          />
        </PopoverContent>
      </Popover>

      <Select
        value={filters.serviceId || "all"}
        onValueChange={(value) =>
          onFiltersChange({
            serviceId: value === "all" ? null : value,
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Serviço" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os serviços</SelectItem>
          {services?.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.employeeId || "all"}
        onValueChange={(value) =>
          onFiltersChange({
            employeeId: value === "all" ? null : value,
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Profissional" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os profissionais</SelectItem>
          {employees?.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.perPage.toString()}
        onValueChange={(value) =>
          onFiltersChange({ perPage: Number.parseInt(value), page: 1 })
        }
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" onClick={onClearFilters}>
        <X className="h-4 w-4 mr-1" />
        Limpar
      </Button>
    </div>
  );
}
