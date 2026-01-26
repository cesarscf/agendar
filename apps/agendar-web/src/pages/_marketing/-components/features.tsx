import {
  BarChart3,
  Bell,
  Calendar,
  Clock,
  DollarSign,
  type LucideIcon,
  Users,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Calendar,
    title: "Agendamento Inteligente",
    description:
      "Sistema completo de agendamentos com calendário integrado, lembretes automáticos e gestão de horários disponíveis.",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description:
      "Mantenha um cadastro completo de seus clientes com histórico de agendamentos e informações de contato.",
  },
  {
    icon: Clock,
    title: "Controle de Horários",
    description:
      "Defina sua disponibilidade, duração de serviços e intervalos personalizados para cada tipo de atendimento.",
  },
  {
    icon: DollarSign,
    title: "Gestão Financeira",
    description:
      "Acompanhe receitas, despesas e comissões com relatórios detalhados e controle total das suas finanças.",
  },
  {
    icon: BarChart3,
    title: "Relatórios e Análises",
    description:
      "Visualize o desempenho do seu negócio com gráficos e estatísticas que ajudam na tomada de decisões.",
  },
  {
    icon: Bell,
    title: "Notificações Automáticas",
    description:
      "Envie lembretes automáticos para seus clientes via whatsapp e reduza o número de faltas.",
  },
]

export function Features() {
  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="text-foreground">Funcional</span>
          <span className="text-[#F4C430]">idades</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(feature => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#F4C430]/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#F4C430]" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
