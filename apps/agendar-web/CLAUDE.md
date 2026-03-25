# Web - Agendar

Frontend React para o painel administrativo e booking público.

## Comandos

```bash
bun run dev      # Desenvolvimento (porta 3000)
bun run build    # Build de produção
bun run preview  # Preview do build
```

## Stack

- **Framework**: React 19
- **Router**: TanStack Router (file-based)
- **State/Data**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Charts**: Recharts
- **Pagamentos**: Stripe React

## Rotas (TanStack Router)

File-based routing em `src/pages/`:
- `$slug/` - Rotas públicas de booking (por slug do estabelecimento)
- `_auth/` - Rotas autenticadas (painel admin)
- `_marketing/` - Landing pages públicas
- `app/` - App principal autenticado
- `checkout/` - Fluxo de pagamento

## Padrões

### Data Fetching (TanStack Query):
```typescript
const { data, isLoading } = useQuery({
  queryKey: ["appointments", establishmentId],
  queryFn: () => getAppointments(establishmentId)
})
```

### Forms (React Hook Form + Zod):
```typescript
const form = useForm<FormData>({
  resolver: zodResolver(formSchema)
})
```

### HTTP Client:
Axios configurado em `src/http/` com interceptors para:
- Token JWT automático
- Header `x-establishment-id`

## Autenticação e Permissionamento

- Token JWT + role armazenados em cookies (`js-cookie`)
- Interceptor adiciona token em requests
- `useAuth()` retorna `{ isAuthenticated, partner, employee, role, isLoading }`
- Role `"partner"` ou `"employee"` — determina layout e acesso

### Route Guards (`lib/route-guards.ts`):
- `requireAuth` — redireciona para `/login` se não autenticado
- `requirePartner` — redireciona para `/app` se role é employee

### Navegação por Role:
- **Partner**: Agenda, Relatórios gerenciais, Profissionais, Categorias, Serviços, Clientes, Pacotes, Fidelidade, Loja
- **Employee**: Minha Agenda (`/app`), Meus Relatórios (`/app/my-dashboard`)

### Rotas protegidas com `requirePartner`:
Todas as rotas de gestão (dashboard, employees, services, categories, customers, packages, loyalty-programs, store) e suas sub-rotas

## Temas

- Suporte a dark/light mode (`next-themes`)
- CSS variables para cores customizáveis por estabelecimento

## Variáveis de Ambiente

Validadas via Zod em `src/env.ts`:
- VITE_API_URL
- VITE_STRIPE_PUBLISHABLE_KEY
