import { Check } from "lucide-react";

interface Reason {
  title: string;
  description: string;
}

const reasons: Reason[] = [
  {
    title: "Agendamentos em tempo real",
    description:
      "Permita que seus clientes reservem serviços a qualquer hora, sem precisar enviar mensagens, ligar ou esperar retorno.",
  },
  {
    title: "Redução de faltas",
    description:
      "Ative lembretes automáticos por SMS ou WhatsApp e diminua drasticamente os esquecimentos e cancelamentos de última hora.",
  },
  {
    title: "Agenda organizada e inteligente",
    description:
      "Visualize seus horários por dia, semana ou mês. Evite conflitos, bloqueie horários e acompanhe tudo em um único lugar.",
  },
  {
    title: "Perfil profissional completo",
    description:
      "Mostre seus serviços, valores, fotos e disponibilidade. Um catálogo digital pronto para encantar clientes.",
  },
  {
    title: "Mais profissionalismo para o seu negócio",
    description:
      "Com processos automatizados, você ganha tempo para focar no que realmente importa: entregar um excelente atendimento.",
  },
  {
    title:
      "Funciona para vários tipos de negócios que trabalham com agendamentos",
    description:
      "Perfeito para salões de beleza, barbearias, clínicas, estúdios, banho e tosa e qualquer serviço que dependa de agenda.",
  },
];

export function WhyUse() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="text-foreground">Por que usar o </span>
          <span className="text-[#F4C430]">Agendar?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex gap-4 p-6 rounded-lg border-2 hover:border-[#F4C430]/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#F4C430]/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#F4C430]" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
