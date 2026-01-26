# Dashboard (Analytics)

Métricas e relatórios para o estabelecimento.

## Padrão de Consulta

Todas as métricas:
- Filtram por `establishmentId` (do token)
- Filtram por período (`startDate`, `endDate` no formato "YYYY-MM-DD")
- Consideram apenas agendamentos com `status = "completed"`

## Métricas Disponíveis

### Financeiras:
- **Revenue**: Receita total (`SUM(paymentAmount)`)
- **Daily Revenue**: Receita por dia
- **Net Revenue**: Receita - Comissões
- **Average Ticket**: Ticket médio (`AVG(paymentAmount)`)

### Por Funcionário:
- **Employee Revenue**: Faturamento por profissional
- **Employee Commission**: Comissão por profissional

### Por Serviço:
- **Most Booked Services**: Serviços mais agendados
- **Top Services**: Serviços que mais faturam
- **Services by Employee**: Serviços por funcionário
- **Monthly Services**: Serviços por mês

### Pagamentos:
- **Top Payment Methods**: Distribuição por forma de pagamento

## Cálculo de Comissão

```sql
SUM(
  CASE WHEN status = 'completed'
    AND date BETWEEN startDate AND endDate
    AND commission IS NOT NULL
  THEN paymentAmount * commission
  END
)
```

## Retorno em Centavos

Valores monetários retornados em centavos (multiplicados por 100):
```typescript
revenueInCents: Math.round(parseFloat(totalCommission) * 100)
```
