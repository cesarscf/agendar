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
import type { Employee } from "@/lib/validations/employees";
import type { Service } from "@/lib/validations/service";

export interface DashboardFilters {
  startDate: string;
  endDate: string;
  professionalId?: string;
  serviceId?: string;
}

interface DashboardFiltersProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: Partial<DashboardFilters>) => void;
  onClearFilters: () => void;
  employees?: Employee[];
  services?: Service[];
  isLoadingEmployees?: boolean;
  isLoadingServices?: boolean;
}

export function DashboardFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  employees = [],
  services = [],
  isLoadingEmployees = false,
  isLoadingServices = false,
}: DashboardFiltersProps) {
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
    if (date) {
      onFiltersChange({
        startDate: format(date, "yyyy-MM-dd"),
      });
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      onFiltersChange({
        endDate: format(date, "yyyy-MM-dd"),
      });
    }
  };

  const handleProfessionalIdChange = (value: string) => {
    onFiltersChange({
      professionalId: value || undefined,
    });
  };

  const handleServiceIdChange = (value: string) => {
    onFiltersChange({
      serviceId: value || undefined,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtros:</span>
      </div>

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
        value={filters.professionalId || "all"}
        onValueChange={(value) =>
          handleProfessionalIdChange(value === "all" ? "" : value)
        }
        disabled={isLoadingEmployees}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Todos os profissionais" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os profissionais</SelectItem>
          {employees.map((employee) => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.serviceId || "all"}
        onValueChange={(value) =>
          handleServiceIdChange(value === "all" ? "" : value)
        }
        disabled={isLoadingServices}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Todos os serviços" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os serviços</SelectItem>
          {services.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" onClick={onClearFilters}>
        <X className="h-4 w-4 mr-1" />
        Limpar
      </Button>
    </div>
  );
}
