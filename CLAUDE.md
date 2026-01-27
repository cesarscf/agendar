# Agendar

Plataforma SaaS multi-tenant para agendamento de serviços, focada em salões de beleza e negócios similares.

## Ambiente

**Status**: Em desenvolvimento (não está em produção)

- Pode limpar dados do banco sem preocupação
- Pode atualizar/recriar tabelas livremente
- Dados são de teste

## Domínio do Negócio

O sistema permite que **Partners** (donos de negócio) gerenciem seus **Establishments** (estabelecimentos/filiais), onde **Employees** (profissionais) prestam **Services** (serviços) para **Customers** (clientes) através de **Appointments** (agendamentos).

### Modelo Multi-Tenancy

```
Partner (Dono da conta)
  └── Establishments (1 ou mais filiais)
       ├── Employees (Profissionais)
       │    └── Services que prestam (com comissão individual)
       ├── Services (Catálogo de serviços)
       ├── Packages (Pacotes de serviços)
       ├── Loyalty Programs (Programas de fidelidade)
       └── Customers (Clientes - identificados por telefone)
            └── Appointments (Agendamentos)
```

## Stack Tecnológica

- **API**: Fastify + TypeScript + Drizzle ORM + PostgreSQL
- **Web**: React 19 + TanStack Router/Query + Tailwind CSS 4
- **Mobile**: React Native + Expo + React Native Firebase
- **Pagamentos**: Stripe (subscriptions e webhooks)
- **Email**: Resend API
- **Notificações Push**: Firebase Cloud Messaging

## Convenções de Código

- **Formatter**: Biome
- **Line width**: 80 caracteres
- **Indentation**: 2 espaços
- **Path Aliases**: `@/*` → `./src/*`

### Commits

- **Não incluir** `Co-Authored-By` do Claude Code nos commits
- Mensagens em português ou inglês, concisas

### Convenções de Dados

| Tipo | Convenção |
|------|-----------|
| Timestamps | ISO 8601 com timezone |
| Datas | String "YYYY-MM-DD" |
| Preços | Decimal como string (ex: "10.50") |
| Centavos | Inteiro (1050 = R$10,50) |
| Comissão | Decimal 0-1 no DB, percentual no front (0.15 ↔ "15") |

### Utilitários de Conversão

```typescript
// Preços
centsToReais("1050") // "10.50"
reaisToCents(10.50)  // "1050"

// Comissão
commissionToDb("25")    // "0.25"
commissionToFront(0.25) // "25"
```

## Modelo de Negócio SaaS

Planos por quantidade de profissionais:
- 1 Profissional: R$ 79,90/mês
- 2-7 Profissionais: R$ 99,70/mês
- 8-15 Profissionais: R$ 164,90/mês
- 15+ Profissionais: R$ 219,90/mês

Descontos: Semestral 10% | Anual 20%

## Fluxos Críticos

### Booking Público (Cliente)
1. Cliente acessa `/public/{establishment-slug}`
2. Seleciona serviço, profissional, data/hora
3. Sistema valida disponibilidade e conflitos
4. Cria appointment e notifica estabelecimento via Firebase

### Completar Agendamento (Partner)
1. Marca appointment como "completed"
2. Sistema processa pacotes (se usado) ou pontos de fidelidade
3. Registra pagamento e calcula comissão do profissional
