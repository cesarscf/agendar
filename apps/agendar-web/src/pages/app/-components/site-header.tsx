import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useEstablishment } from "@/hooks/use-establishment";
import { updateEstablishment } from "@/http/establishment/update-establishment";

export function SiteHeader() {
  const queryClient = useQueryClient();
  const { establishment } = useEstablishment();

  const { mutate, isPending } = useMutation({
    mutationFn: updateEstablishment,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["establishment"] });

      const previousData = queryClient.getQueryData(["establishment"]);

      queryClient.setQueryData(["establishment"], (old: any) => ({
        ...old,
        active: variables.active,
      }));

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["establishment"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["establishment"] });
    },
    onSuccess: () => {
      toast.success("Status atualizado!");
    },
  });

  function onToggle(value: boolean) {
    if (!establishment) return;
    mutate({ id: establishment.id, active: value });
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex items-center gap-2">
            <Label htmlFor="publish-store" className="text-sm">
              {establishment?.active ? "Publicado" : "Não publicado"}
            </Label>
            <Switch
              id="publish-store"
              checked={!!establishment?.active}
              onCheckedChange={onToggle}
              disabled={isPending}
            />
          </div>
          <ThemeToggle />
        </div>
        <img src="/agendar-logo.png" alt="Agendar" className="h-8 w-8" />
      </div>
    </header>
  );
}
