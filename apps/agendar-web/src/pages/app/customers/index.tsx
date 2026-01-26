import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Hammer,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCustomers } from "@/http/customers/get-customers";

export const Route = createFileRoute("/app/customers/")({
  component: Customers,
});

function Customers() {
  const navigate = useNavigate();

  const [name, setName] = React.useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const filteredCustomers = React.useMemo(() => {
    if (!data) return [];
    const query = name.toLowerCase();
    return data.filter((customer) =>
      customer.name?.toLowerCase().includes(query),
    );
  }, [data, name]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-xl" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-24" />
                      <div className="h-3 bg-muted rounded w-16" />
                    </div>
                  </div>
                  <div className="h-6 bg-muted rounded-full w-16" />
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
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus clientes
          </p>
        </div>
        <Button asChild>
          <Link to="/app/customers/new">Adicionar</Link>
        </Button>
      </div>
      <div className="relative mb-6 md:w-70 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar"
          className="pl-10 bg-background border-border text-foreground"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers?.map((customer) => (
          <Card
            key={customer.id}
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-border"
            onClick={() => {
              navigate({
                to: "/app/customers/$customerId",
                params: { customerId: customer.id },
              });
            }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base leading-tight group-hover:text-primary transition-colors">
                    {customer.name}
                  </h3>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {customer.email && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-muted-foreground">Email:</span>
                    </div>
                    <span className="font-medium text-blue-600">
                      {customer.email}
                    </span>
                  </div>
                )}
                {customer.phoneNumber && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">Telefone:</span>
                    </div>
                    <span className="font-medium text-green-600">
                      {customer.phoneNumber}
                    </span>
                  </div>
                )}
                {customer.birthDate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-orange-600" />
                      <span className="text-muted-foreground">Nascimento:</span>
                    </div>
                    <span className="font-medium text-orange-600">
                      {new Date(customer.birthDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                )}
                {customer.cpf && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-muted-foreground">CPF:</span>
                    </div>
                    <span className="font-medium text-gray-600">
                      {customer.cpf}
                    </span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <span className="text-muted-foreground">Endereço:</span>
                    </div>
                    <span className="font-medium text-purple-600 line-clamp-1">
                      {customer.address}
                    </span>
                  </div>
                )}
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data?.length === 0 && (
        <div className="text-center py-12">
          <Hammer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-muted-foreground">
            Comece criando seu primeiro cliente
          </p>
        </div>
      )}
    </div>
  );
}
