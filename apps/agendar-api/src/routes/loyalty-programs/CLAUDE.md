# Loyalty Programs (Fidelidade)

Sistema de programas de fidelidade por estabelecimento.

## Modelo

```
LoyaltyProgram (Programa)
├── name: Nome do programa
├── serviceRewardId: Serviço que é a recompensa (ex: "Manicure grátis")
├── requiredPoints: Pontos necessários para resgatar
├── active: Status do programa
└── rules: LoyaltyPointRules[] (quais serviços geram quantos pontos)

CustomerLoyaltyPoints (Saldo)
├── customerId: Cliente
├── loyaltyProgramId: Programa
└── points: Saldo atual de pontos
```

## Regras de Negócio

### Configuração do Programa:
1. Estabelecimento define o serviço de recompensa (ex: "Escova grátis")
2. Define quantos pontos são necessários (ex: 100 pontos)
3. Define regras: quais serviços geram quantos pontos

### Exemplo de Programa:
```
Programa: "Fidelidade Bronze"
- Recompensa: Escova (serviceRewardId)
- Pontos necessários: 50

Regras:
- Corte: 10 pontos
- Coloração: 20 pontos
- Manicure: 5 pontos
```

### Acúmulo de Pontos:
- Ao completar agendamento com pagamento normal
- Sistema busca regra do serviço em `loyaltyPointRules`
- Adiciona pontos ao saldo do cliente

### Resgate de Pontos:
- Ao completar agendamento com `paymentType === "loyalty"`
- Sistema deduz `requiredPoints` do programa
- Pontos nunca ficam negativos (`Math.max(0, pontos - required)`)

## Validações

- Programa pertence ao establishment via header
- Pelo menos 1 regra de pontos ao criar programa
- Pontos mínimo de 1 por regra
