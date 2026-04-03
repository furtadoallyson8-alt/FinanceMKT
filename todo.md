# Finance Dashboard - TODO

## Database & Backend
- [x] Criar schema de transações com campos: data, tipo, categoria, descrição, valor, método de pagamento, conta, cartão
- [x] Criar schema de categorias
- [x] Criar schema de contas/bancos
- [x] Criar schema de cartões
- [x] Migrar para localStorage (sem necessidade de banco de dados)
- [x] Criar utilitários de armazenamento local (storageUtils.ts)
- [x] Implementar operações CRUD com localStorage

## Frontend - UI & Design
- [x] Configurar tema dark premium com cores (navy, purple, orange/peach)
- [x] Implementar DashboardLayout com sidebar navigation
- [x] Criar componentes de KPI cards (Income, Expenses, Balance, Credit Card)
- [x] Criar seletores de mês e ano
- [x] Implementar tabela de transações responsiva
- [x] Criar modal de formulário de transação
- [x] Criar dialog de confirmação de exclusão

## Frontend - Gráficos
- [x] Gráfico donut de distribuição de receitas
- [x] Gráfico de barras horizontal para despesas por categoria
- [x] Gráfico de pizza para gastos em cartão de crédito

## Frontend - Funcionalidades
- [x] Integrar listagem de transações com localStorage
- [x] Implementar criação de transação via modal
- [x] Implementar edição de transação via modal pré-preenchido
- [x] Implementar exclusão de transação com confirmação
- [x] Validação de formulário com feedback visual
- [x] Seletor de categoria dinâmico
- [x] Estados de loading durante operações
- [x] Toast notifications para feedback
- [x] Filtros por mês e ano
- [x] Busca/filtro de transações por categoria, tipo ou descrição
- [x] Exportação para CSV/Excel
- [x] Dados de exemplo para demonstração (categorias, contas, cartões pré-configurados)

## Frontend - Páginas
- [x] Dashboard principal com CRUD completo de transações

## Fora do Escopo (Não Solicitado)
- Página Cash Flow
- Página Transactions separada
- Página Records
- Página Settings

## Testing
- [x] Testes vitest para procedures tRPC (11 testes passando)
- [x] Testes vitest para lógica de localStorage (storageUtils.test.ts)

## Bugs Encontrados e Corrigidos
- [x] Corrigir erro de query: tabelas não tinham coluna userId
- [x] Refatorar para usar localStorage em vez de banco de dados
- [x] Remover dependências de tRPC do Dashboard

## Polish & Delivery
- [x] Validar responsividade desktop-first
- [x] Testar interações e estados de loading
- [x] Revisar design premium e hierarquia visual
- [x] Criar checkpoint final


## Gerenciamento de Cartões de Crédito
- [x] Criar interface CRUD para cartões (adicionar, editar, deletar)
- [x] Campos: nome, banco, últimos dígitos, limite, dia fechamento, dia vencimento, cor, ativo/inativo
- [x] Integrar cartões com formulário de transações
- [x] Widget de gastos por cartão no dashboard
- [x] Página Cards com listagem e gerenciamento completo

## Gerenciamento de Contas Bancárias
- [x] Criar interface CRUD para contas (adicionar, editar, deletar)
- [x] Campos: nome, banco, tipo, saldo inicial, saldo atual, ativo/inativo
- [x] Integrar contas com formulário de transações
- [x] Widget de saldos por conta no dashboard
- [x] Página Accounts com listagem e gerenciamento completo

## Integração e Melhorias
- [x] Atualizar Dashboard com novos widgets
- [x] Testar funcionalidades CRUD completas
- [x] Validar integração com transações
- [x] Criar checkpoint final

## Sidebar Navigation (Verificado)
- [x] "Cartões" visível no sidebar com ícone CreditCard
- [x] "Contas" visível no sidebar com ícone Landmark
- [x] Página Cards com CRUD completo (add, edit, delete)
- [x] Página Accounts com CRUD completo (add, edit, delete)
- [x] Todos os campos solicitados implementados
- [x] Design premium dark mantido
- [x] Navegação funcional entre páginas


## Integração Dashboard com Cartões e Contas
- [x] Adicionar botões de acesso rápido aos widgets do dashboard
- [x] Implementar atualização automática de widgets ao CRUD (hook useDataRefresh)
- [x] Criar visualizações de transações por cartão (CardSpendingWidget)
- [x] Criar visualizações de transações por conta (AccountBalanceWidget)
- [x] Adicionar filtros por cartão/conta nas transações (Dashboard com 5 filtros)
- [x] Testar integração completa (11 testes passando)
- [x] Criar checkpoint final


## Bugs de Produção (Netlify) - CORRIGIDOS
- [x] Corrigir TypeError: Invalid URL em produção
- [x] Remover/corrigir dependências de tRPC quebradas
- [x] Corrigir variáveis de ambiente inválidas
- [x] Remover redirects de OAuth que não funcionam
- [x] Garantir funcionamento com localStorage apenas
- [x] Testar todas as rotas em produção
- [x] Criar versão production-ready para Netlify
