import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "@tanstack/react-router"
import {
  Activity,
  Box,
  CalendarDays,
  FolderTree,
  Gift,
  LogOut,
  Package2,
  Scissors,
  ShoppingBag,
  UserCog,
  UserSquare,
} from "lucide-react"
import type * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEmployees } from "@/hooks/use-employees"
import { useEstablishment } from "@/hooks/use-establishment"
import { useSubscription } from "@/hooks/use-subscription"
import { getPlan } from "@/http/payments/get-plan"
import { clearToken } from "@/lib/auth"
import { queryKeys } from "@/lib/query-keys"
import { NavMain } from "./main-nav"
import { NavUser } from "./nav-user"
import { SimpleSubscriptionCard } from "./subscription-card"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { establishment } = useEstablishment()
  const { currentSubscription } = useSubscription()
  const { data: employees } = useEmployees()

  const { data: plan, isLoading: planIsLoading } = useQuery({
    queryKey: queryKeys.plan(currentSubscription?.plan.id ?? ""),
    queryFn: () => getPlan(currentSubscription?.plan.id!),
    enabled: !!currentSubscription?.plan.id,
  })

  const totalEmployees = employees?.length ?? 0

  function handleLogout() {
    queryClient.clear()
    clearToken()
    navigate({
      to: "/login",
      replace: true,
      search: { redirect: undefined },
    })
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href={`/${establishment?.slug}`} target="_blank">
                {establishment?.logoUrl ? (
                  <img
                    src={establishment.logoUrl || "/placeholder.svg"}
                    alt={establishment.name}
                    className="object-cover size-8 rounded-xl border-2 border-border/20"
                  />
                ) : (
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package2 className="size-4 text-primary" />
                  </div>
                )}
                <span className="text-base font-semibold">
                  {establishment?.name}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            {
              title: "Agenda",
              url: "/app",
              icon: CalendarDays,
              isActive: pathname === "/app",
            },
            {
              title: "Relatórios gerenciais",
              url: "/app/dashboard",
              icon: Activity,
              isActive: pathname === "/app/dashboard",
            },
            {
              title: "Profissionais",
              url: "/app/employees",
              icon: UserCog,
              isActive: pathname === "/app/employees",
            },
            {
              title: "Categorias",
              url: "/app/categories",
              icon: FolderTree,
              isActive: pathname === "/app/categories",
            },
            {
              title: "Serviços",
              url: "/app/services",
              icon: Scissors,
              isActive: pathname === "/app/services",
            },
            {
              title: "Clientes",
              url: "/app/customers",
              icon: UserSquare,
              isActive: pathname === "/app/customers",
            },
            {
              title: "Pacotes",
              url: "/app/packages",
              icon: Box,
              isActive: pathname === "/app/packages",
            },
            {
              title: "Fidelidade",
              url: "/app/loyalty-programs",
              icon: Gift,
              isActive: pathname === "/app/loyalty-programs",
            },
            {
              title: "Loja",
              url: "/app/store",
              icon: ShoppingBag,
              isActive: pathname === "/app/store",
            },
          ]}
        />

        <SidebarMenu className="px-2 mt-4">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut />
              Sair
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-2 mt-auto">
          <SimpleSubscriptionCard
            subscription={currentSubscription ?? undefined}
            plan={plan}
            totalEmployees={totalEmployees}
            isLoading={planIsLoading}
            onUpgrade={() => {
              navigate({ to: "/", href: "/#plans" })
            }}
          />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
