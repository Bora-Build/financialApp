> **Especificação de produto — revisada em 09/11/2026.** Este documento descreve referências de interface, navegação ou modelo de dados; não comprova que todos os recursos estejam implementados ou habilitados na VPS. Para arquitetura e operação atuais, consulte o [índice](../docs/INDICE_DOCUMENTACAO.md) e o [estado validado](../docs/ESTADO_ATUAL.md).

# FLUXO DE NAVEGAÇÃO — Financial App

---

## 1. MAPA GERAL DE NAVEGAÇÃO

```
APP
├── [Unauthenticated Stack]
│   ├── SplashScreen
│   ├── Onboarding (4 slides — só na 1ª vez)
│   ├── Login
│   ├── Register
│   └── ForgotPassword
│
├── [Onboarding Stack] — só se onboarding_done = false
│   ├── Welcome
│   ├── PersonalData
│   ├── FirstAccount
│   ├── MonthlyIncome
│   ├── Categories
│   └── Tutorial (tour de 5 passos)
│
└── [Main App — Bottom Tab Navigator]
    ├── Tab 1: Dashboard
    │   └── NotificationList
    │
    ├── Tab 2: Transactions
    │   ├── TransactionList
    │   ├── TransactionDetail
    │   ├── AddTransaction (Modal)
    │   │   ├── ExpenseForm
    │   │   ├── IncomeForm
    │   │   ├── TransferForm
    │   │   └── RecurringForm
    │   ├── TransactionFilters (Sheet)
    │   ├── TransactionSearch
    │   └── RecurringList
    │
    ├── Tab 3: Budgets
    │   ├── BudgetList
    │   ├── BudgetDetail
    │   │   └── BudgetTransactions
    │   └── AddBudget (Modal)
    │
    ├── Tab 4: Goals
    │   ├── GoalList
    │   ├── GoalDetail
    │   │   ├── GoalContribute (Sheet)
    │   │   └── GoalSimulator
    │   └── AddGoal (Modal)
    │
    └── Tab 5: Profile
        ├── ProfileMain
        ├── EditProfile
        ├── AccountsList
        │   ├── AccountDetail
        │   └── AddAccount (Modal)
        ├── CreditCardsList
        │   ├── CreditCardDetail
        │   └── AddCreditCard (Modal)
        ├── CategoriesList
        │   └── AddCategory (Modal)
        ├── NotificationSettings
        ├── SecuritySettings
        ├── DataExport
        └── About
```

---

## 2. FLUXOS PRINCIPAIS (User Journeys)

### Fluxo 1: Primeiro Acesso
```
SplashScreen (800ms)
    → [sem sessão] → Onboarding slide 1
    → Onboarding slide 2
    → Onboarding slide 3
    → Onboarding slide 4
    → Login / Register
        → [Register] → Register Form
            → [sucesso] → Onboarding Setup: Welcome
            → PersonalData → FirstAccount → MonthlyIncome
            → Categories → Tutorial → Dashboard
        → [Login] → [onboarding_done = false] → Onboarding Setup: Welcome → ...
        → [Login] → [onboarding_done = true] → Dashboard
    → [com sessão válida] → Dashboard
```

---

### Fluxo 2: Adicionar Transação (via FAB)
```
Dashboard (qualquer tela)
    → FAB press
    → Speed Dial abre (animação 200ms)
        ┌── [Despesa] ──→ AddTransaction Modal (type=expense)
        ├── [Receita]  ──→ AddTransaction Modal (type=income)
        ├── [Transf.]  ──→ AddTransaction Modal (type=transfer)
        └── [Recorrente]→ AddTransaction Modal (recurring=true)
            ↓ (preenche formulário)
        → [confirmar] → Feedback de sucesso (toast 2s)
            → Fecha modal → Tela anterior atualizada
```

**Formulário de transação — campos por tipo:**

| Campo              | Despesa | Receita | Transferência | Recorrente |
|--------------------|---------|---------|---------------|------------|
| Valor              | ✓       | ✓       | ✓             | ✓          |
| Descrição          | ✓       | ✓       | ✓             | ✓          |
| Data               | ✓       | ✓       | ✓             | start_date |
| Conta de origem    | ✓       | ✓       | ✓             | ✓          |
| Conta de destino   |         |         | ✓             |            |
| Categoria          | ✓       | ✓       |               | ✓          |
| Cartão de crédito  | ✓       |         |               | ✓          |
| Parcelamento       | ✓       |         |               |            |
| Tags               | ✓       | ✓       | ✓             | ✓          |
| Notas              | ✓       | ✓       | ✓             | ✓          |
| Anexo/foto         | ✓       | ✓       |               |            |
| Frequência         |         |         |               | ✓          |
| Data fim           |         |         |               | ✓          |
| Status             | ✓       | ✓       |               |            |

---

### Fluxo 3: Editar / Deletar Transação
```
TransactionList
    → [swipe direita] → Editar (abre modal pré-preenchido)
        → [salvar] → Toast "Atualizado" → Lista atualizada
    → [swipe esquerda] → Confirmação delete (sheet)
        → [confirmar] → Soft delete → Lista atualizada
        → [cancelar] → Fecha sheet
    → [tap no item] → TransactionDetail
        → [botão editar] → Mesmo fluxo de edição
        → [botão deletar] → Mesmo fluxo de delete
```

---

### Fluxo 4: Criar e Acompanhar Orçamento
```
Budgets Tab
    → [lista vazia ou botão +] → AddBudget Modal
        → Seleciona categoria (ou "Geral")
        → Define valor e período
        → Define % de alerta
        → [salvar] → Toast → Lista atualizada
    → [tap em orçamento] → BudgetDetail
        → Visualiza progresso + gráfico histórico
        → Lista transações da categoria no período
        → Botão editar / deletar
```

---

### Fluxo 5: Meta Financeira
```
Goals Tab
    → [+] → AddGoal Modal
        → Nome, valor alvo, prazo, conta vinculada
        → Prioridade (1-5 estrelas)
        → [salvar] → Toast → Lista atualizada
    → [tap em meta] → GoalDetail
        → Progresso circular + stats
        → [Contribuir] → GoalContribute Sheet
            → Valor a adicionar
            → [confirmar] → Atualiza current_amount
                → [meta atingida?] → Animação celebração + notificação
        → [Simular] → GoalSimulator
            → Entrada: valor mensal disponível
            → Output: data estimada de conclusão
```

---

### Fluxo 6: Notificações
```
Dashboard Header [sino] → Badge com count não lidas
    → NotificationList
        → [tap] → Navega para action_url (rota interna)
        → [swipe] → Marcar como lida / dispensar
        → [marcar todas] → Bulk update status
```

---

## 3. GESTOS E INTERAÇÕES MOBILE

| Gesto                   | Elemento            | Ação                                  |
|-------------------------|---------------------|---------------------------------------|
| Tap                     | TransactionItem     | Abre TransactionDetail                |
| Swipe direita           | TransactionItem     | Revela botão Editar (indigo)          |
| Swipe esquerda          | TransactionItem     | Revela botão Deletar (vermelho)       |
| Long press              | TransactionItem     | Selecionar para ações em lote         |
| Pull to refresh         | Qualquer lista      | Recarrega dados                       |
| Swipe up                | Bottom sheet        | Expande ao máximo                     |
| Swipe down              | Bottom sheet        | Fecha                                 |
| Pinch/spread            | Gráficos            | Zoom temporal (1 mês → 1 ano)         |
| Tap no FAB              | FAB                 | Abre speed dial                       |
| Tap fora do speed dial  | Overlay             | Fecha speed dial                      |
| Swipe horizontal        | AccountCards        | Scroll entre contas                   |
| Swipe horizontal        | Onboarding slides   | Navega entre slides                   |

---

## 4. BOTTOM TAB — ESPECIFICAÇÃO

```
┌────────────────────────────────────────────────────────────┐
│  [🏠]        [💰]        [⊕]        [📊]        [👤]      │
│ Dashboard Transações  Adicionar  Orçamentos  Perfil        │
└────────────────────────────────────────────────────────────┘
```

> Nota: O centro pode ser um botão "Adicionar" dedicado (não uma tab), elevado acima da barra, que abre diretamente o speed dial.

**Indicador ativo**: barra de 3px na cor `primary.500` + ícone preenchido + label visível
**Indicador inativo**: ícone outline + label visível, cor `text.secondary`
**Badge**: número vermelho para notificações não lidas (tab Dashboard)

---

## 5. TRANSIÇÕES ENTRE TELAS

| De                  | Para                   | Animação              |
|---------------------|------------------------|-----------------------|
| Tab → Tab           | Fade                   | 150ms easeOut         |
| List → Detail       | Slide left             | 300ms easeInOut       |
| Detail → List       | Slide right            | 300ms easeInOut       |
| Qualquer → Modal    | Slide up               | 350ms spring(0.7)     |
| Modal → Qualquer    | Slide down             | 250ms easeIn          |
| Qualquer → Sheet    | Slide up parcial       | 300ms spring(0.8)     |
| Sheet → Qualquer    | Slide down             | 250ms easeIn          |
| Login → Dashboard   | Fade + scale           | 400ms easeOut         |
| Onboarding slides   | Slide horizontal       | 350ms easeInOut       |

---

## 6. ESTADOS GLOBAIS DE NAVEGAÇÃO

### Deep Links suportados
```
financialapp://dashboard
financialapp://transactions
financialapp://transactions/{id}
financialapp://transactions/new?type=expense
financialapp://budgets/{id}
financialapp://goals/{id}
financialapp://profile/accounts
financialapp://notifications
```

### Comportamento do botão Back (Android / Web)
- Modal aberto → fecha modal
- Bottom sheet → fecha sheet
- Tab secundária → volta para raiz da tab
- Tab raiz → minimiza app (não fecha)

### Persistência de Estado
- Filtros de transações: mantidos enquanto a tab estiver ativa
- Posição de scroll: restaurada ao voltar para lista
- Formulários parcialmente preenchidos: mantidos se navegar acidentalmente (confirm dialog ao sair)
