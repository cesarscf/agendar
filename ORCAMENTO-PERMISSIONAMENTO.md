# 💼 Orçamento - Sistema de Permissionamento

## 📌 Contexto

Este documento contém as perguntas e definições necessárias para montar o **orçamento completo** da implementação do sistema de controle de acesso (permissionamento) entre Dono e Funcionário.

---

## ✅ Decisões Já Tomadas

### Estrutura Básica:
- **2 níveis de acesso**: Dono (Owner) e Funcionário (Employee)
- **1 estabelecimento** por partner (mesmo que o backend suporte múltiplos)
- **Employee como conta separada** (Opção 1):
  - Employee terá login próprio (email + senha)
  - Registro na tabela `users` com `role: "employee"`
  - Vinculado ao `establishment` do Partner
  - Permite auditoria (saber quem fez o quê)

### Permissões Gerais:
- **Dono**: Acesso total (métricas, dados financeiros, gestão completa)
- **Funcionário**: Acesso operacional (sem dados sensíveis/financeiros)

---

## ❓ Perguntas Pendentes (Aguardando Respostas do Cliente)

### 1. **O que o Dono vai gerenciar?**

Esse CRUD é para:
- [ ] Apenas funcionários (adicionar, remover, editar)
- [ ] Apenas clientes
- [ ] Ambos (funcionários e clientes)

**Resposta:** _____________________

---

### 2. **O que o Funcionário PODE fazer?**

#### Agendamentos:
- [ ] Criar novos agendamentos
- [ ] Mudar horário ou serviço de um agendamento
- [ ] Cancelar agendamentos
- [ ] Marcar como concluído quando terminar o atendimento
- [ ] Ver a agenda completa do salão (todos os agendamentos)
- [ ] Ver apenas os agendamentos dele

**Respostas:** _____________________

#### Clientes:
- [ ] Cadastrar novos clientes
- [ ] Editar informações dos clientes (telefone, endereço, etc)
- [ ] Ver a lista de todos os clientes

**Respostas:** _____________________

#### Serviços:
- [ ] Ver a lista de serviços oferecidos
- [ ] Ver os preços dos serviços
- [ ] Criar ou alterar serviços e preços

**Respostas:** _____________________

#### Financeiro/Pagamentos:
- [ ] Registrar quando o cliente pagou
- [ ] Ver quanto custa cada serviço
- [ ] Ver quanto ele ganhou de comissão
- [ ] Ver quanto ganhou no dia

**Respostas:** _____________________

---

### 3. **O que o Funcionário NÃO PODE ver/fazer?**

- [ ] Faturamento total do salão
- [ ] Comissões de outros funcionários
- [ ] Informações do plano/pagamento da conta
- [ ] Configurações do salão (horário de funcionamento, etc)
- [ ] Adicionar ou remover outros funcionários
- [ ] Mudar preços dos serviços
- [ ] Criar pacotes promocionais
- [ ] Criar/editar programas de fidelidade
- [ ] Gerar relatórios completos do estabelecimento

**Respostas:** _____________________

---

### 4. **Como o Funcionário vai entrar no sistema?**

- [ ] Dono cadastra com email e cria senha temporária
- [ ] Dono manda convite por email e funcionário escolhe sua senha
- [ ] Funcionário usa telefone + senha simples
- [ ] Outra forma? Qual: _______________

**Resposta:** _____________________

---

### 5. **Onde implementar?**

- [ ] Só no site (web)
- [ ] Só no aplicativo (mobile)
- [ ] Nos dois (web e mobile)

**Resposta:** _____________________

---

## 📋 Próximos Passos

Quando tiver as respostas acima:

1. ✅ Marcar as opções desejadas
2. 💬 Enviar este documento com as respostas
3. 📊 Claude montará o orçamento detalhado com:
   - Escopo técnico completo
   - Lista de entregas (APIs, telas, funcionalidades)
   - Estimativa de tempo por módulo
   - Valor total do projeto

---

## 🔧 Implementação Técnica (Resumo)

### Backend (API):
- Adicionar campo `role` na tabela `users` ("partner" | "employee")
- Criar middleware de autorização baseado em roles
- Proteger rotas sensíveis (métricas, relatórios, configurações)
- Criar endpoints para CRUD de employees

### Frontend Web:
- Tela de gestão de funcionários (listar, adicionar, editar, remover)
- Ajustar rotas e componentes para respeitar permissões
- Ocultar/mostrar funcionalidades baseado no role

### Frontend Mobile:
- Tela de login com suporte a employee
- Interface simplificada para employee
- Controle de acesso a telas sensíveis

---

**📅 Data de Criação:** 14/02/2026
**👤 Responsável:** Cesar
**🔄 Status:** Aguardando respostas do cliente
