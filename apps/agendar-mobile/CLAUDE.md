# Mobile - Agendar

App React Native para gestão do estabelecimento.

## Comandos

```bash
bun run start    # Expo start
bun run android  # Run no Android
bun run ios      # Run no iOS
```

## Stack

- **Framework**: React Native 0.81 + Expo 54
- **Router**: Expo Router (file-based)
- **State/Data**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Styling**: NativeWind (Tailwind para RN)
- **Push Notifications**: React Native Firebase
- **Storage**: Async Storage + Secure Store

## Rotas (Expo Router)

File-based routing em `src/app/`:
- `(tabs)/` - Tabs principais do app
- `(tabs)/establishment/` - Gestão do estabelecimento
- `(tabs)/settings/` - Configurações

## Padrões

### Data Fetching:
Hooks customizados em `src/hooks/data/`:
```typescript
// hooks/data/appointment/use-appointments.ts
export function useAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments
  })
}
```

### Validações:
Schemas Zod em `src/lib/validations/`:
```typescript
// lib/validations/appointment.ts
export const appointmentSchema = z.object({...})
```

### HTTP Client:
Axios em `src/http/api-client.ts` com:
- Base URL da API
- Token automático
- Header establishment

## Push Notifications

Firebase Cloud Messaging:
- Token FCM enviado para API ao fazer login
- Notificações de novos agendamentos

## Armazenamento

- **Secure Store**: Token JWT, dados sensíveis
- **Async Storage**: Cache, preferências

## Upload de Imagens

Utilitário em `src/lib/upload-image.ts`:
- Usa Firebase Storage
- Retorna URL pública
