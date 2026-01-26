# Subscription (Assinaturas SaaS)

Gerenciamento de planos e assinaturas via Stripe.

## Planos

Tiers por quantidade de profissionais:
| Plano | Preço/mês |
|-------|-----------|
| 1 Profissional | R$ 79,90 |
| 2-7 Profissionais | R$ 99,70 |
| 8-15 Profissionais | R$ 164,90 |
| 15+ Profissionais | R$ 219,90 |

Descontos por período:
- Semestral: 10% OFF
- Anual: 20% OFF

## Status da Subscription

```typescript
type SubscriptionStatus = "active" | "trialing" | "canceled" | "unpaid" | ...
```

Status válidos para acesso: `"active"` ou `"trialing"`

## Webhook Stripe

Endpoint: `POST /webhook/stripe`

### Eventos Tratados:

| Evento | Ação |
|--------|------|
| `customer.subscription.updated` | Atualiza status e período |
| `customer.subscription.deleted` | Atualiza status e `currentPeriodEnd` |
| `setup_intent.succeeded` | Salva novo cartão como default |
| `invoice.payment_failed` | Status → `"unpaid"` |
| `invoice.paid` | Status → `"active"` ou `"trialing"` |

### Setup Intent (Novo Cartão):
1. Recupera payment method do Stripe
2. Marca cartões anteriores como `isDefault: false`
3. Insere novo cartão como default

### Validação de Assinatura:
- Middleware `requireActiveSubscription`
- Verifica: status válido + `currentPeriodEnd > now`
- Bypass em desenvolvimento (`NODE_ENV === "development"`)

## Integrações

```
Partner.integrationPaymentId → Stripe Customer ID
Subscription.integrationSubscriptionId → Stripe Subscription ID
PartnerPaymentMethod.integrationPaymentMethodId → Stripe PaymentMethod ID
```
