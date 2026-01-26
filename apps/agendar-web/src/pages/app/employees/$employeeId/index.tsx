import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmployee } from "@/http/employees/get-employee";
import { getServices } from "@/http/services/get-services";
import { EmployeeBlocks } from "./-components/blocks";

import { UpdateEmployeeForm } from "./-components/update-employee-form";
import { UpdateEmployeeServices } from "./-components/update-employee-service";

export const Route = createFileRoute("/app/employees/$employeeId/")({
  component: Employee,
});

function Employee() {
  const { employeeId } = Route.useParams();

  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "geral",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => getEmployee(employeeId),
  });

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  if (!data || isLoading) {
    return null;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="p-6">
      <Tabs
        value={tab || "geral"}
        onValueChange={(value) => {
          setTab(value);
        }}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row gap-4 md:items-center w-full">
          <Button size="icon" variant="outline" asChild>
            <Link to="/app/employees">
              <ChevronLeft />
            </Link>
          </Button>
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="blocks">Bloqueios</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="geral">
          <div className="my-4">
            <h1 className="text-2xl font-bold text-foreground">
              Atualizar profissional
            </h1>
            <p className="text-muted-foreground">
              Atualize o profissional {data.name}
            </p>
          </div>

          <UpdateEmployeeForm employee={data} />
        </TabsContent>

        <TabsContent value="services">
          <div className="my-4">
            <h1 className="text-2xl font-bold text-foreground">
              Atualizar serviços do profissional
            </h1>
            <p className="text-muted-foreground">
              Atualize os serviços que o profissional {data.name} realiza
            </p>
          </div>

          <UpdateEmployeeServices
            employeeId={employeeId}
            employeeServices={data.services}
            services={services ?? []}
          />
        </TabsContent>

        <TabsContent value="blocks">
          <div className="my-4">
            <h1 className="text-2xl font-bold text-foreground">
              Atualizar os bloqueios do profissional
            </h1>
            <p className="text-muted-foreground">
              Atualize os bloqueios do profissional {data.name}
            </p>
          </div>

          <EmployeeBlocks employeeId={employeeId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
