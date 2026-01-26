# Public Routes (Booking Público)

Endpoints públicos para clientes fazerem agendamentos sem autenticação.

## Acesso via Slug

O estabelecimento é identificado pelo **slug** na URL:
```
GET /public/{slug}
GET /public/{slug}/services
GET /public/{slug}/professionals
```

O slug é uma string URL-friendly única (ex: "salao-beleza-sp").

## Endpoints Disponíveis

### Informações do Estabelecimento:
- `GET /:slug` - Info básica + horários de funcionamento
- `GET /:slug/services` - Catálogo de serviços
- `GET /:slug/professionals` - Profissionais disponíveis
- `GET /:slug/packages` - Pacotes de serviços

### Booking:
- `POST /appointments` - Criar agendamento (usa Customer Auth via headers)
- `POST /appointments/use-package` - Agendar usando pacote
- `DELETE /appointments/:id` - Cancelar agendamento

### Cliente:
- `POST /customers` - Criar/registrar cliente
- `GET /customers/verify` - Verificar se cliente existe por telefone

### Fidelidade:
- `GET /loyalty-programs` - Programas de fidelidade do estabelecimento

## Identificação do Cliente

Cliente identificado por **telefone + estabelecimento**:
```typescript
// Query params
phone: string  // Número de telefone
slug: string   // Slug do estabelecimento
```

## Verificação de Pacotes

Ao verificar cliente, retorna se tem pacote disponível:
- `paid: true`
- `remainingSessions > 0`
- Não expirado (`expiresAt > now` ou null)

## Sem Autenticação JWT

Rotas públicas não usam JWT. Autenticação via:
- Header `x-customer-phone`
- Header `x-establishment-id`
