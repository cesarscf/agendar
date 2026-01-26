# Endpoint de Relatório de Faturamento

## Visão Geral

Endpoint para consultar o faturamento total agregado por data, com filtros opcionais para refinar a análise por período, serviços, pacotes e profissional.

## Endpoint

```
GET /appointments/revenue-report
```

## Autenticação

Requer token JWT válido no header:
```
Authorization: Bearer {seu-token-jwt}
```

## Parâmetros de Query (todos opcionais)

| Parâmetro | Tipo | Formato | Descrição | Exemplo |
|-----------|------|---------|-----------|---------|
| `startDate` | string | `YYYY-MM-DD` | Data inicial do período para filtrar | `2024-04-01` |
| `endDate` | string | `YYYY-MM-DD` | Data final do período para filtrar | `2024-04-30` |
| `serviceId` | string | UUID | ID do serviço para filtrar | `550e8400-e29b-41d4-a716-446655440000` |
| `packageId` | string | UUID | ID do pacote para filtrar | `550e8400-e29b-41d4-a716-446655440001` |
| `employeeId` | string | UUID | ID do profissional para filtrar | `550e8400-e29b-41d4-a716-446655440002` |

### Observações sobre os parâmetros:

- **Todos os parâmetros são opcionais** - Se nenhum filtro for passado, retorna o faturamento de todos os agendamentos completados
- **`serviceId`, `packageId` e `employeeId`** aceitam apenas **um UUID por vez**
- **Range de datas**:
  - Pode passar apenas `startDate` (retorna tudo a partir dessa data)
  - Pode passar apenas `endDate` (retorna tudo até essa data)
  - Pode passar ambos (retorna tudo dentro do período)
  - **Quando ambos são fornecidos**: Todos os dias do período são incluídos, mesmo sem faturamento (com `value: 0`)

## Formato de Resposta

### Sucesso (200 OK)

```json
{
  "data": [
    {
      "date": "2024-04-01",
      "value": 222.50
    },
    {
      "date": "2024-04-02",
      "value": 97.00
    },
    {
      "date": "2024-04-22",
      "value": 224.75
    }
  ]
}
```

### Estrutura do objeto de resposta:

- **`data`** (array): Lista de objetos contendo o faturamento por data
  - **`date`** (string): Data no formato `YYYY-MM-DD`
  - **`value`** (number): Valor total do faturamento nessa data em reais

### Características da resposta:

- Os dados são **ordenados por data** (do mais antigo para o mais recente)
- Apenas **agendamentos com status "completed"** são incluídos no cálculo
- **Quando `startDate` e `endDate` são fornecidos**: Todas as datas do período são retornadas, incluindo dias sem faturamento com `value: 0`
- **Quando não há filtro de data completo**: Apenas datas com faturamento aparecem na lista
- Valores são retornados como **números decimais** (float)

## Exemplos de Uso

### 1. Faturamento total (sem filtros)

```bash
GET /appointments/revenue-report
```

Retorna o faturamento de todos os agendamentos completados, agregados por data.

### 2. Faturamento em um período específico

```bash
GET /appointments/revenue-report?startDate=2024-04-01&endDate=2024-04-30
```

Retorna o faturamento de abril de 2024.

### 3. Faturamento de um serviço específico

```bash
GET /appointments/revenue-report?serviceId=550e8400-e29b-41d4-a716-446655440000
```

Retorna apenas o faturamento gerado pelo serviço especificado.

### 4. Faturamento de um profissional em um período

```bash
GET /appointments/revenue-report?employeeId=550e8400-e29b-41d4-a716-446655440002&startDate=2024-04-01&endDate=2024-04-30
```

Retorna o faturamento gerado por um profissional específico em abril de 2024.

### 5. Faturamento de um pacote específico

```bash
GET /appointments/revenue-report?packageId=550e8400-e29b-41d4-a716-446655440003
```

Retorna apenas o faturamento de agendamentos vinculados ao pacote especificado.

### 6. Combinando múltiplos filtros

```bash
GET /appointments/revenue-report?startDate=2024-04-01&endDate=2024-04-30&serviceId=550e8400-e29b-41d4-a716-446655440000&employeeId=550e8400-e29b-41d4-a716-446655440002
```

Retorna o faturamento de um serviço específico realizado por um profissional específico em abril de 2024, incluindo todos os dias do mês (mesmo sem faturamento).

## Regras de Negócio

1. **Status de agendamento**: Apenas agendamentos com status `"completed"` são considerados como faturamento
2. **Valor do agendamento**: O valor considerado é o campo `paymentAmount` da tabela de agendamentos
3. **Agregação**: Os valores são somados por data (`date` do agendamento)
4. **Filtro de serviços**: Filtra pelo campo `serviceId` do agendamento
5. **Filtro de pacotes**: Filtra pelo campo `customerServicePackageId` do agendamento
6. **Filtro de profissional**: Filtra pelo campo `employeeId` do agendamento

## Casos de Uso

### Análise de Performance
- Visualizar o faturamento diário para identificar dias de maior/menor movimento
- Comparar faturamento entre diferentes períodos

### Relatórios por Profissional
- Acompanhar a produtividade individual de cada profissional
- Calcular comissões baseadas no faturamento

### Análise de Serviços
- Identificar quais serviços geram mais receita
- Comparar performance de diferentes serviços

### Gestão de Pacotes
- Analisar o faturamento gerado por vendas de pacotes
- Comparar receita de pacotes vs serviços avulsos

## Códigos de Resposta HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso - Retorna os dados de faturamento |
| 401 | Não autorizado - Token inválido ou ausente |
| 500 | Erro interno do servidor |

## Exemplo de Resposta Completa

### Request:
```http
GET /appointments/revenue-report?startDate=2024-04-01&endDate=2024-04-05&employeeId=550e8400-e29b-41d4-a716-446655440002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response:
```json
{
  "data": [
    {
      "date": "2024-04-01",
      "value": 150.00
    },
    {
      "date": "2024-04-02",
      "value": 220.50
    },
    {
      "date": "2024-04-03",
      "value": 180.00
    },
    {
      "date": "2024-04-05",
      "value": 95.00
    }
  ]
}
```

**Nota**: No exemplo acima, a consulta foi feita **sem** `startDate` e `endDate` juntos, por isso o dia 04/04 não aparece (apenas dias com faturamento são retornados). Se a consulta incluísse `startDate=2024-04-01&endDate=2024-04-05`, o dia 04/04 apareceria com `value: 0`.

## Notas Técnicas

- O endpoint utiliza agregação no banco de dados para melhor performance
- Os valores são convertidos de `DECIMAL` para `NUMBER` no response
- A query é otimizada para trabalhar com grandes volumes de dados
- Suporta índices nas colunas de filtro para consultas rápidas
