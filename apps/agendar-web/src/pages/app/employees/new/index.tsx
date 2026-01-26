import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowUp, ChevronLeft, Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import LogoUploader from "@/components/logo-uploader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSubscription } from "@/hooks/use-subscription";
import { createEmployee } from "@/http/employees/create-employee";
import { getEmployees } from "@/http/employees/get-employees";
import { getPlan } from "@/http/payments/get-plan";
import { maskPhone } from "@/lib/masks";
import { queryKeys } from "@/lib/query-keys";
import { uploadImage } from "@/lib/upload-image";
import { createEmployeeSchema } from "@/lib/validations/employees";

export const Route = createFileRoute("/app/employees/new/")({
  component: NewEmployee,
});

type Inputs = z.infer<typeof createEmployeeSchema>;

function NewEmployee() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const { currentSubscription } = useSubscription();

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const { data: plan, isLoading: planIsLoading } = useQuery({
    queryKey: queryKeys.plan(currentSubscription?.plan.id ?? ""),
    queryFn: () => getPlan(currentSubscription?.plan.id!),
    enabled: !!currentSubscription?.plan.id,
  });

  const totalEmployees = employees?.length ?? 0;
  const maxEmployees = plan?.maximumProfessionalsIncluded ?? 1;
  const hasReachedLimit = totalEmployees >= maxEmployees;

  const form = useForm<Inputs>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      biography: "",
      phone: "",
      active: true,
      avatarUrl: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  async function onSubmit(values: Inputs) {
    setIsLoading(true);
    let image: string | undefined;

    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);

      image = imageUrl;
    }

    await mutateAsync({ ...values, avatarUrl: image ?? "", active: true });

    navigate({ to: "/app/employees" });
    setIsLoading(false);
  }

  if (planIsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-10" />
          <div className="h-8 bg-muted rounded w-64" />
          <div className="h-4 bg-muted rounded w-96" />
        </div>
      </div>
    );
  }

  if (hasReachedLimit) {
    return (
      <div className="p-6">
        <Button size="icon" variant="outline" asChild>
          <Link to="/app/employees">
            <ChevronLeft />
          </Link>
        </Button>

        <div className="my-4">
          <h1 className="text-2xl font-bold text-foreground">
            Adicionar um novo profissional
          </h1>
          <p className="text-muted-foreground">
            Adicione um novo profissional para sua loja
          </p>
        </div>

        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Limite de funcionários atingido</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              Você atingiu o limite de {maxEmployees} funcionário(s) permitidos
              no plano {currentSubscription?.plan.name}.
            </p>
            <p>
              Para adicionar mais profissionais, faça o upgrade do seu plano
              para uma opção que suporte mais funcionários.
            </p>
            <Button
              className="w-full mt-2"
              onClick={() => {
                navigate({ to: "/", href: "/#plans" });
              }}
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Fazer Upgrade de Plano
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button size="icon" variant="outline" asChild>
        <Link to="/app/employees">
          <ChevronLeft />
        </Link>
      </Button>

      <div className="my-4">
        <h1 className="text-2xl font-bold text-foreground">
          Adicionar um novo profissional
        </h1>
        <p className="text-muted-foreground">
          Adicione um novo profissional para sua loja
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-md"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite aqui o nome do profissional"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(99) 99999-9999"
                    maxLength={15}
                    {...field}
                    onChange={(e) => field.onChange(maskPhone(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite aqui o email do profissional"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Imagem do profissional</FormLabel>
            <FormControl>
              <div className="flex justify-start">
                <LogoUploader value={imageFile} onChange={setImageFile} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite aqui o endereço do profissional"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="biography"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biografia</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite aqui o biografia do profissional"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="ml-auto"
            disabled={isPending || isLoading}
          >
            Salvar
            {isPending || isLoading ? (
              <Loader2 className="size-4 animate-spin ml-2" />
            ) : null}
          </Button>
        </form>
      </Form>
    </div>
  );
}
