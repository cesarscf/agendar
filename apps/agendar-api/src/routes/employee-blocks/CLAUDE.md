# Employee Blocks (Bloqueios de Disponibilidade)

Gerenciamento de indisponibilidades dos profissionais.

## Tipos de Bloqueio

### Bloqueios Manuais (`employeeTimeBlocks`)
Indisponibilidades específicas com data/hora exata:
```typescript
{
  employeeId: uuid
  startsAt: timestamp  // Data e hora início
  endsAt: timestamp    // Data e hora fim
  reason?: string      // Motivo opcional
}
```

Exemplo: "Consulta médica dia 15/01 das 14:00 às 16:00"

### Bloqueios Recorrentes (`employeeRecurringBlocks`)
Indisponibilidades semanais que se repetem:
```typescript
{
  employeeId: uuid
  weekday: number      // 0=Domingo, 1=Segunda... 6=Sábado
  startTime: string    // "HH:mm" ex: "12:00"
  endTime: string      // "HH:mm" ex: "13:00"
  reason?: string
}
```

Exemplo: "Toda segunda-feira das 12:00 às 13:00 (almoço)"

## Validações

### Horário:
- `startTime < endTime` (início deve ser antes do fim)
- Weekday entre 0-6

### Ownership:
- Funcionário deve pertencer ao estabelecimento do token

## Impacto no Agendamento

Ambos os tipos são verificados na criação de agendamento:
```typescript
// 1. Checa bloqueios manuais
const conflictingBlock = await db
  .select()
  .from(employeeTimeBlocks)
  .where(
    and(
      eq(employeeTimeBlocks.employeeId, employeeId),
      lt(employeeTimeBlocks.startsAt, endTime),
      gt(employeeTimeBlocks.endsAt, startTime)
    )
  )

// 2. Checa bloqueios recorrentes
const weekday = startDatetime.getDay()
const recurringBlocks = await db
  .select()
  .from(employeeRecurringBlocks)
  .where(
    and(
      eq(employeeRecurringBlocks.employeeId, employeeId),
      eq(employeeRecurringBlocks.weekday, weekday)
    )
  )
```

Se houver conflito, retorna HTTP 409 com mensagem de erro.
