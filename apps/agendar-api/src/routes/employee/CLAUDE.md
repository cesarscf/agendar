# Employee Self (Rotas do Profissional Autenticado)

Endpoints exclusivos para employees autenticados. Todos usam o middleware `employee-auth.ts`.

## Endpoints

### `GET /employee/me`
Perfil do employee autenticado + dados básicos do establishment.

### `GET /employee/appointments`
Agendamentos do employee, com paginação e filtros.

Querystring:
- `page`, `perPage` — paginação
- `startDate`, `endDate` — filtro por período
- `status` — filtro por status ("scheduled", "completed", "canceled")

Sempre filtra por `employeeId` do token (não pode ver agendamentos de outros).

### `GET /employee/earnings`
Faturamento e comissão do employee no período.

Querystring:
- `startDate`, `endDate` — período (formato "YYYY-MM-DD", obrigatórios)

Retorna:
- `revenueInCents` — total faturado pelo employee
- `commissionInCents` — total de comissão do employee
- `completedAppointments` — quantidade de atendimentos concluídos

## Regra de Segurança

Todos os dados são filtrados pelo `employeeId` e `establishmentId` extraídos do JWT. Employee nunca acessa dados de outros profissionais.
