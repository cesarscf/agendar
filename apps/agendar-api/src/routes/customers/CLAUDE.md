# Customers (Clientes)

Gerenciamento de clientes do estabelecimento.

## Identificação

Cliente é identificado pela combinação **telefone + estabelecimento**:
```typescript
// Unique constraint
(phoneNumber, establishmentId)
```

Não existe cliente "global" - cada estabelecimento tem seu próprio cadastro.

## Campos do Cliente

```typescript
{
  id: uuid
  name: string
  phoneNumber: string  // Identificador principal
  email?: string
  cpf?: string
  birthDate?: date
  address?: string
  city?: string
  state?: string
  notes?: string       // Observações internas
  establishmentId: uuid
}
```

## Verificação por Telefone

```
GET /customers/verify?phone={phone}&slug={slug}&packageId={optional}
```

Retorna:
- Dados do cliente se existir
- `hasPackageAvailable`: boolean indicando se tem pacote ativo

### Critérios de Pacote Disponível:
- `paid: true`
- `remainingSessions > 0`
- `expiresAt > now` ou `expiresAt = null`

## Autenticação

### Rotas do Partner (admin):
- Usam JWT (Partner Auth)
- CRUD completo de clientes

### Rotas Públicas (cliente):
- Sem JWT
- Verificação por telefone + slug
- Headers `x-customer-phone` + `x-establishment-id`

## Relacionamentos

Cliente pode ter:
- Múltiplos `appointments`
- Múltiplos `customerServicePackages`
- Múltiplos `customerLoyaltyPoints` (por programa)
