# Subscription (Assinaturas SaaS)

Gerenciamento de planos e assinaturas via Stripe.

## Arquitetura

Usa **Stripe Checkout** e **Customer Portal** para simplificar o fluxo:

1. **Checkout Session**: Redireciona para página de pagamento do Stripe
2. **Customer Portal**: Redireciona para portal self-service do Stripe
3. **Webhooks**: Sincroniza estado entre Stripe e banco local

## Endpoints

| Endpoint | Descrição |
|----------|-----------|
| `POST /subscriptions/checkout-session` | Cria sessão de checkout no Stripe |
| `POST /subscriptions/customer-portal` | Cria sessão do portal do cliente |
| `POST /subscriptions/cancel` | Cancela assinatura |
| `GET /subscriptions` | Lista assinaturas do partner |
| `GET /subscriptions/:id` | Busca assinatura por ID |

## Fluxo de Nova Assinatura

```
1. Frontend chama POST /subscriptions/checkout-session
2. API cria Checkout Session no Stripe com metadata (partnerId, planId)
3. API retorna URL do Stripe Checkout
4. Frontend redireciona usuário para Stripe
5. Usuário completa pagamento no Stripe
6. Stripe envia webhook "checkout.session.completed"
7. API cria/atualiza subscription no banco
8. Stripe redireciona usuário para success_url
```

## Fluxo de Upgrade/Downgrade

```
1. Frontend chama POST /subscriptions/customer-portal
2. API cria Portal Session no Stripe
3. API retorna URL do Customer Portal
4. Frontend redireciona usuário para Portal
5. Usuário altera plano no Portal
6. Stripe envia webhook "customer.subscription.updated"
7. API atualiza subscription no banco
```

## Webhook Events

| Evento | Ação |
|--------|------|
| `checkout.session.completed` | Cria subscription no banco |
| `customer.subscription.updated` | Atualiza status, plano, período |
| `customer.subscription.deleted` | Marca como cancelada |
| `invoice.payment_failed` | Marca como past_due |
| `invoice.paid` | Atualiza status e período |

## Schema Simplificado

```typescript
subscriptions {
  id: uuid (PK)
  partnerId: uuid (FK, unique)  // 1 subscription por partner
  planId: uuid (FK)
  integrationSubscriptionId: string (unique)  // Stripe subscription ID
  status: string  // active, trialing, canceled, past_due, etc
  currentPeriodEnd: timestamp  // Direto do Stripe
  cancelAtPeriodEnd: boolean
  endedAt: timestamp | null
}
```

## Regras de Negócio

- **1 subscription por partner**: Garantido por unique constraint
- **Dados do Stripe são fonte de verdade**: currentPeriodEnd vem do Stripe
- **Webhook é idempotente**: Pode receber o mesmo evento múltiplas vezes
- **Metadata**: partnerId e planId passados via metadata para o webhook

## Cancelamento

- `immediately: false` (padrão): Cancela no fim do período
- `immediately: true`: Cancela imediatamente

## Ambiente

Configurar no Stripe Dashboard:
1. Criar Customer Portal com permissões de upgrade/downgrade
2. Configurar webhook para apontar para `/webhook/stripe`
3. Habilitar eventos necessários no webhook
