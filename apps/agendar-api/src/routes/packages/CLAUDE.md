# Packages (Pacotes de Serviços)

Bundles de serviços vendidos como pacote.

## Modelo

```
Package (Definição do pacote)
├── name, price, commission, description, image
├── active: Status
└── packageItems: PackageItem[] (serviços incluídos)

PackageItem (Itens do pacote)
├── packageId: Pacote pai
├── serviceId: Serviço incluído
└── quantity: Quantidade de sessões

CustomerServicePackage (Pacote comprado pelo cliente)
├── customerId: Cliente que comprou
├── servicePackageId: Pacote original
├── totalSessions: Total de sessões disponíveis
├── remainingSessions: Sessões restantes
├── paid: Se foi pago
├── expiresAt: Data de expiração (opcional)
└── purchasedAt: Data da compra
```

## Regras de Negócio

### Criação de Pacote:
- Preço recebido em centavos, convertido para reais no DB
- Comissão recebida como percentual ("25"), convertida para decimal (0.25)

### Compra pelo Cliente:
- Cria `customerServicePackage` com `totalSessions` = soma das quantidades dos itens
- `remainingSessions` começa igual a `totalSessions`

### Uso do Pacote:
- Ao agendar: aloca sessão do pacote (não decrementa ainda)
- Ao completar agendamento: registra uso e decrementa `remainingSessions`

### Seleção Automática de Pacote:
1. Busca pacotes do cliente com `remainingSessions > 0`
2. Verifica se pacote não expirou (`expiresAt > now` ou null)
3. Conta agendamentos "scheduled" ou "completed" vinculados
4. Se slots < totalSessions, usa esse pacote
5. Se nenhum disponível, **cria novo customerServicePackage automaticamente**

### Priorização:
- Pacotes mais antigos primeiro (`orderBy purchasedAt`)
