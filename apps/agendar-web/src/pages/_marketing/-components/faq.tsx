import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Como funciona o período de teste gratuito?",
    answer:
      "Você pode experimentar todas as funcionalidades do Agendar gratuitamente por 14 dias, sem precisar cadastrar cartão de crédito. Após o período de teste, você pode escolher o plano que melhor se adequa ao seu negócio.",
  },
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer:
      "Sim! Você pode cancelar sua assinatura a qualquer momento, sem taxas de cancelamento. Seu acesso continuará ativo até o final do período já pago.",
  },
  {
    question: "Como funcionam as notificações para os clientes?",
    answer:
      "O sistema envia lembretes automáticos por email para seus clientes antes dos agendamentos. Você pode personalizar o tempo de antecedência e a mensagem dos lembretes.",
  },
  {
    question: "Posso ter mais de um funcionário usando o sistema?",
    answer:
      "Sim! Dependendo do plano escolhido, você pode adicionar múltiplos funcionários, cada um com seu próprio acesso e agenda individual.",
  },
  {
    question: "Os dados dos meus clientes estão seguros?",
    answer:
      "Absolutamente. Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança para proteger todos os dados. Estamos em conformidade com a LGPD (Lei Geral de Proteção de Dados).",
  },
  {
    question: "Preciso instalar algum software?",
    answer:
      "Não! O Agendar é 100% online e funciona em qualquer navegador. Você também pode acessar através dos nossos aplicativos móveis para iOS e Android.",
  },
];

export function FAQ() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="text-foreground">Perguntas </span>
          <span className="text-[#F4C430]">Frequentes</span>
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
