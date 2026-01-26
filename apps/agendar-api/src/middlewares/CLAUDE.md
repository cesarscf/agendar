# Middlewares

Middlewares de autenticação e autorização.

## auth.ts (Partner Auth)

Autenticação de proprietários/partners via JWT.

### Métodos adicionados ao request:

```typescript
request.getCurrentPartnerId(): Promise<string>
// Extrai partnerId do JWT (campo 'sub')
// Throws UnauthorizedError se token inválido

request.getCurrentEstablishmentId(): Promise<{ establishmentId: string, partnerId: string }>
// 1. Obtém partnerId do token
// 2. Se header 'x-establishment-id' presente:
//    - Valida se partner é dono do establishment
//    - Throws ForbiddenError se não for
// 3. Se header ausente:
//    - Retorna primeiro establishment do partner
```

## customer-auth.ts (Customer Auth)

Autenticação de clientes via headers (sem JWT).

### Headers esperados:
```
x-customer-phone: string
x-establishment-id: string
```

### Método adicionado:
```typescript
request.getCurrentCustomerEstablishmentId(): Promise<{ customerId: string, establishmentId: string }>
// Busca customer por phone + establishmentId
```

## admin-auth.ts (Admin Auth)

Autenticação de administradores do sistema.

## require-active-subscription.ts

Validação de assinatura ativa.

### Lógica:
1. Obtém partnerId do token
2. Busca subscription mais recente do partner
3. Verifica:
   - `status === "active"` ou `status === "trialing"`
   - `currentPeriodEnd > now`
4. Throws ForbiddenError se inválido

### Bypass em desenvolvimento:
```typescript
if (env.NODE_ENV === "development") return // Skip validation
```

## Uso nos Plugins

```typescript
// Registrar middleware no plugin
typedApp.register(auth)
typedApp.register(requireActiveSubscription)

// Usar métodos no handler
const { establishmentId } = await request.getCurrentEstablishmentId()
```
