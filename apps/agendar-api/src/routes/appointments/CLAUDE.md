# Appointments

Gerenciamento de agendamentos de serviços.

## Status do Agendamento

```typescript
type AppointmentStatus = "scheduled" | "completed" | "canceled"
```

**Regra de transição**: Uma vez "completed", não pode voltar para outro status.

## Tipos de Pagamento

```typescript
type PaymentType = "pix" | "credit_card" | "debit_card" | "cash" | "package" | "loyalty" | "other"
```

## Criação de Agendamento

### Validações obrigatórias:
1. **Funcionário presta o serviço** - Checa `employeeServices`
2. **Sem conflito de horário** - Verifica overlap com agendamentos existentes
3. **Sem bloqueio manual** - Verifica `employeeTimeBlocks`
4. **Sem bloqueio recorrente** - Verifica `employeeRecurringBlocks` por dia da semana

### Cálculo de horário:
```typescript
endTime = startTime + service.durationInMinutes
```

### Detecção de conflito (overlap):
```sql
startTime < :newEndTime AND endTime > :newStartTime
```

### Notificação Firebase
Após criar, envia push notification ao estabelecimento (fire-and-forget).

## Completar Agendamento

Ao marcar como "completed", o sistema:

1. **Se usou pacote** (`customerServicePackageId`):
   - Registra uso em `customerServicePackageUsages`
   - Decrementa `remainingSessions` do pacote

2. **Processa fidelidade**:
   - Se `paymentType === "loyalty"`: **deduz** `requiredPoints` do programa
   - Se outro pagamento: **adiciona** pontos conforme `loyaltyPointRules`

## Agendamento com Pacote

### Fluxo de alocação:
1. Busca pacotes do cliente com `remainingSessions > 0`
2. Para cada pacote, conta agendamentos "scheduled" ou "completed"
3. Seleciona o primeiro pacote com slots disponíveis
4. Se nenhum disponível, **cria novo `customerServicePackage` automaticamente**

### Priorização:
- Pacotes mais antigos primeiro (`orderBy purchasedAt`)
- Respeita expiração (`expiresAt` se definido)

## Autenticação

- **Criação**: Customer Auth (headers `x-customer-phone` + `x-establishment-id`)
- **Atualização de status**: Partner Auth (JWT) + Subscription ativa
