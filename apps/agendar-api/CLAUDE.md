# API - Agendar

Backend Fastify para sistema de agendamento multi-tenant.

## Comandos

```bash
bun run dev      # Desenvolvimento (watch mode)
bun run local    # Desenvolvimento com .env.local
bun run build    # Build de produção
bun run db:generate  # Gerar migrações
bun run db:migrate   # Executar migrações
```

## Padrões Arquiteturais

### Plugin Pattern (Rotas)

Cada grupo de rotas é um plugin Fastify:

```typescript
// routes/appointments/index.ts
export async function appointmentsRoutes(app: FastifyInstance) {
  await createAppointment(app)
  await updateAppointmentStatus(app)
}

// server.ts - registro
app.register(appointmentsRoutes)
```

### Middleware via Hooks

Middlewares adicionam métodos ao `request` via `preHandler`:

```typescript
app.addHook("preHandler", async request => {
  request.getCurrentPartnerId = async () => { ... }
  request.getCurrentEstablishmentId = async () => { ... }
})
```

### Type-Safe Routes com Zod

```typescript
typedApp.post("/endpoint", {
  schema: {
    tags: ["Tag"],
    body: z.object({ field: z.string() }),
    response: { 201: z.object({ id: z.string().uuid() }) }
  }
}, async (request, reply) => { ... })
```

### Drizzle ORM com Relations

```typescript
// Query com eager loading
db.query.appointments.findFirst({
  where: eq(appointments.id, id),
  with: { employee: true, service: true }
})
```

## Autenticação (3 Camadas)

### Partner Auth (JWT)
- Token contém `sub` (partnerId)
- Header `x-establishment-id` roteia para estabelecimento
- `request.getCurrentPartnerId()` e `request.getCurrentEstablishmentId()`

### Customer Auth (Headers - sem JWT)
- Header `x-customer-phone` identifica cliente
- Header `x-establishment-id` define contexto
- Cliente identificado por telefone + establishment

### Subscription Validation
- Middleware `requireActiveSubscription`
- Verifica status ("active" | "trialing") e `currentPeriodEnd > now`
- Bypass em `NODE_ENV === "development"`

## Classes de Erro

```typescript
throw new UnauthorizedError("message") // 401
throw new ForbiddenError("message")    // 403
throw new BadRequestError("message")   // 400
```

## Padrão: Notificações Async

Responde primeiro, depois notifica (fire-and-forget):

```typescript
reply.status(201).send({ id: appointment.id })
messaging.send({...}).catch(err => logger.error(err))
```

## Padrão: Validação de Conflitos de Horário

SQL para detectar sobreposição (overlap):
```sql
startTime < :endTime AND endTime > :startTime
```

Aplicado em:
- Agendamentos existentes do funcionário
- Bloqueios manuais (`employeeTimeBlocks`)
- Bloqueios recorrentes (`employeeRecurringBlocks`)

## Convenções de Dados

| Tipo | Convenção |
|------|-----------|
| Preços | Decimal como string ("10.50") |
| Centavos | Inteiro (1050 = R$10,50) |
| Comissão | Decimal 0-1 no DB, percentual string no front |
| Datas | String "YYYY-MM-DD" |
| Weekday | 0=Domingo, 1=Segunda... (padrão JS) |

## Utilitários de Conversão

```typescript
// Preços (utils/price.ts)
centsToReais("1050") // "10.50"
reaisToCents(10.50)  // "1050"

// Comissão (utils/commission.ts)
commissionToDb("25")    // "0.25"
commissionToFront(0.25) // "25"
```

## Variáveis de Ambiente

Validadas via Zod em `src/env.ts`:
- DATABASE_URL
- JWT_SECRET
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
- FIREBASE_SERVICE_ACCOUNT_KEY_ENCODED_JSON
- RESEND_API_KEY, RESEND_EMAIL
