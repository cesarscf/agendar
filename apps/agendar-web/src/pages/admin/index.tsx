import { createFileRoute } from "@tanstack/react-router"
import { useAdminAuth } from "@/hooks/use-admin-auth"

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { admin } = useAdminAuth()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Admin ID</h3>
          <p className="text-muted-foreground text-sm">{admin?.id}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Role</h3>
          <p className="text-muted-foreground text-sm">{admin?.role}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Status</h3>
          <p className="text-sm text-green-500">Autenticado</p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="mb-4 font-medium">Funcionalidades em desenvolvimento</h3>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li>- Gerenciamento de partners</li>
          <li>- Relatorios da plataforma</li>
          <li>- Configuracoes do sistema</li>
          <li>- Logs e auditoria</li>
        </ul>
      </div>
    </div>
  )
}
