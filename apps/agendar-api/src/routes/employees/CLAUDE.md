# Employees (Profissionais)

Gerenciamento de profissionais/funcionários do estabelecimento.

## Modelo

```
Employee
├── name, email, phone, avatar, bio
├── active: Status do funcionário
└── establishmentId: Estabelecimento

EmployeeService (Serviços que o funcionário presta)
├── employeeId
├── serviceId
├── commission: Decimal 0-1 (ex: 0.25 = 25%)
└── active
```

## Regras de Negócio

### Comissão por Serviço:
- Cada funcionário pode ter comissão diferente por serviço
- Comissão recebida como percentual string ("25")
- Convertida para decimal no DB (0.25)
- Usado no cálculo: `paymentAmount * commission`

### Associação de Serviços:
- Operação de **replace**: deleta todas associações e recria
- Permite desativar serviço sem remover (`active: false`)

### Validação de Agendamento:
- Antes de criar agendamento, verifica se funcionário presta o serviço
- Busca em `employeeServices` por `employeeId + serviceId`

## Bloqueios de Disponibilidade

### Bloqueios Manuais (`employeeTimeBlocks`):
- Datas/horas específicas
- `startsAt`, `endsAt`: Timestamps completos

### Bloqueios Recorrentes (`employeeRecurringBlocks`):
- Padrões semanais (ex: "não trabalho segunda à tarde")
- `weekday`: 0=Domingo, 1=Segunda... (padrão JS)
- `startTime`, `endTime`: Horas do dia

Ambos são checados na criação de agendamento.
