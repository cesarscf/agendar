# Database (Drizzle ORM)

Configuração do banco de dados PostgreSQL com Drizzle ORM.

## Conexão

```typescript
// db/index.ts
import { drizzle } from "drizzle-orm/node-postgres"
export const db = drizzle(...)
```

## Schemas

Cada entidade tem seu arquivo em `schema/`. Exportados centralizadamente em `schema/index.ts`.

## Padrões de Schema

### ID e Timestamps:
```typescript
id: uuid("id").primaryKey().defaultRandom()
createdAt: timestamp("created_at").defaultNow()
updatedAt: timestamp("updated_at").defaultNow()
```

### Foreign Keys:
```typescript
employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" })
```

### Enums:
```typescript
export const appointmentStatusEnum = pgEnum("appointment_status", ["scheduled", "completed", "canceled"])
```

## Relations

Definidas separadamente para eager loading:

```typescript
export const appointmentsRelations = relations(appointments, ({ one }) => ({
  employee: one(employees, {
    fields: [appointments.employeeId],
    references: [employees.id]
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id]
  })
}))
```

## Query Patterns

### Eager Loading:
```typescript
db.query.appointments.findFirst({
  where: eq(appointments.id, id),
  with: { employee: true, service: true }
})
```

### SQL Direto:
```typescript
db.select({
  total: sql<string>`SUM(${appointments.paymentAmount})`
})
.from(appointments)
.where(...)
```

## Migrações

```bash
bun run db:generate  # Gera migrações baseado nos schemas
bun run db:migrate   # Executa migrações pendentes
```

Arquivos de migração em `/drizzle`.

## Convenções de Dados

| Campo | Tipo PostgreSQL | Tipo TypeScript |
|-------|-----------------|-----------------|
| ID | uuid | string |
| Preço | decimal | string ("10.50") |
| Comissão | decimal | string ("0.25") |
| Data | varchar | string ("YYYY-MM-DD") |
| Horário | timestamp with tz | Date |
| Weekday | integer | number (0-6) |
