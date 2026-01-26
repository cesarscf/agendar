import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getService } from "@/http/services/get-service";
import { UpdateServiceForm } from "./-components/update-service-form";

export const Route = createFileRoute("/app/services/$serviceId/")({
  component: Service,
});

function Service() {
  const { serviceId } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["services", serviceId],
    queryFn: () => getService(serviceId),
  });

  if (!data || isLoading) {
    return null;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="p-6">
      <Button size="icon" variant="outline" asChild>
        <Link to="/app/services">
          <ChevronLeft />
        </Link>
      </Button>

      <div className="my-4">
        <h1 className="text-2xl font-bold text-foreground">
          Atualizar serviço
        </h1>
        <p className="text-muted-foreground">Atualize o serviço {data.name}</p>
      </div>

      <UpdateServiceForm service={data} />
    </div>
  );
}
