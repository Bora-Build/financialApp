> **Especificação de produto — revisada em 09/11/2026.** Este documento descreve referências de interface, navegação ou modelo de dados; não comprova que todos os recursos estejam implementados ou habilitados na VPS. Para arquitetura e operação atuais, consulte o [índice](../docs/INDICE_DOCUMENTACAO.md) e o [estado validado](../docs/ESTADO_ATUAL.md).

# MAPEAMENTO TELAS → BANCO DE DADOS

---

## 1. MAPEAMENTO COMPLETO

### AUTENTICAÇÃO / ONBOARDING

| Tela                | Operação | Tabela / Função Supabase        | Campos relevantes                            |
|---------------------|----------|---------------------------------|----------------------------------------------|
| Login               | SELECT   | `auth.users` (Supabase Auth)    | `email`, `password`                          |
| Cadastro            | INSERT   | `auth.users` → trigger cria `profiles` | `email`, `password`, `full_name`    |
| Esqueci senha       | —        | Supabase Auth (`resetPasswordForEmail`) | —                             |
| Welcome (setup)     | UPDATE   | `profiles`                      | `full_name`, `currency`, `timezone`, `locale`|
| Primeira conta      | INSERT   | `accounts`                      | `name`, `type`, `bank_name`, `initial_balance`, `balance` |
| Renda mensal        | UPDATE   | `profiles`                      | `monthly_income`                             |
| Onboarding done     | UPDATE   | `profiles`                      | `onboarding_done = true`                     |

---

### DASHBOARD

| Elemento                | Fonte de dados                            | Campos / Query                                                    |
|-------------------------|-------------------------------------------|-------------------------------------------------------------------|
| Saldo total             | `vw_account_summary`                      | `SUM(balance) WHERE include_in_sum = true AND user_id = uid`      |
| Receitas do mês         | `vw_monthly_cash_flow`                    | `total_income WHERE month = current_month`                        |
| Despesas do mês         | `vw_monthly_cash_flow`                    | `total_expense WHERE month = current_month`                       |
| Gráfico de evolução     | `vw_monthly_cash_flow`                    | Últimos 6 meses: `month`, `total_income`, `total_expense`         |
| Cards de contas         | `vw_account_summary`                      | `id`, `name`, `type`, `balance`, `color`, `bank_name`             |
| Últimas transações      | `vw_recent_transactions`                  | LIMIT 5, `user_id = uid`                                          |
| Alertas de orçamento    | `vw_budget_progress`                      | `alert_level IN ('alert', 'exceeded')`                            |
| Badge notificações      | `notifications`                           | `COUNT WHERE status = 'unread' AND user_id = uid`                 |
| Resumo financeiro       | `fn_monthly_summary(uid, year, month)`    | Todos os campos retornados                                        |

---

### TRANSAÇÕES

| Tela / Elemento         | Operação   | Tabela / View                  | Campos relevantes                                              |
|-------------------------|------------|--------------------------------|----------------------------------------------------------------|
| Lista de transações     | SELECT     | `vw_recent_transactions`       | Paginação + filtros dinâmicos                                  |
| Filtro por período      | SELECT     | `transactions`                 | `transaction_date BETWEEN start AND end`                       |
| Filtro por categoria    | SELECT     | `transactions`                 | `category_id = ?`                                              |
| Filtro por conta        | SELECT     | `transactions`                 | `account_id = ?`                                              |
| Filtro por tipo         | SELECT     | `transactions`                 | `type IN (?)`                                                  |
| Filtro por status       | SELECT     | `transactions`                 | `status IN (?)`                                               |
| Busca por texto         | SELECT     | `transactions`                 | `description ILIKE '%termo%'`                                  |
| Adicionar despesa       | INSERT     | `transactions`                 | `type='expense'`, `account_id`, `category_id`, `amount`, `description`, `transaction_date`, `status` |
| Adicionar receita       | INSERT     | `transactions`                 | `type='income'`, `account_id`, `category_id`, `amount`, `description`, `transaction_date` |
| Adicionar transferência | INSERT     | `transactions`                 | `type='transfer'`, `account_id`, `destination_account_id`, `amount` |
| Parcelamento            | INSERT (N) | `transactions` (múltiplos rows)| `installment_group_id` (UUID único), `installment_number`, `installment_total`, `credit_card_id` |
| Transação recorrente    | INSERT     | `recurring_transactions`       | `frequency`, `start_date`, `end_date`, `next_date`, `auto_create` |
| Editar transação        | UPDATE     | `transactions`                 | Todos os campos editáveis; trigger recalcula saldo             |
| Deletar transação       | UPDATE     | `transactions`                 | `deleted_at = NOW()` (soft delete)                             |
| Detalhe de transação    | SELECT     | `transactions` + JOINs         | Full record + `accounts.name`, `categories.name`, `credit_cards.name` |
| Lista de recorrentes    | SELECT     | `recurring_transactions`       | `is_active = true AND deleted_at IS NULL`                      |
| Pausar recorrente       | UPDATE     | `recurring_transactions`       | `is_active = false`                                            |
| Deletar recorrente      | UPDATE     | `recurring_transactions`       | `deleted_at = NOW()`                                           |

**Efeitos colaterais automáticos (triggers)**:
- INSERT/UPDATE/DELETE em `transactions` → `fn_update_account_balance()` → atualiza `accounts.balance`
- INSERT/UPDATE/DELETE em `transactions` → `fn_update_credit_card_limit()` → atualiza `credit_cards.available_limit`
- INSERT/UPDATE/DELETE em `transactions` → `fn_update_budget_spent()` → atualiza `budgets.spent`

---

### ORÇAMENTOS

| Tela / Elemento          | Operação | Tabela / View             | Campos relevantes                                          |
|--------------------------|----------|---------------------------|------------------------------------------------------------|
| Lista de orçamentos      | SELECT   | `vw_budget_progress`      | `user_id = uid AND is_active = true`                       |
| Resumo total             | SELECT   | `vw_budget_progress`      | `SUM(budget_amount)`, `SUM(spent)`, `SUM(remaining)`       |
| Criar orçamento          | INSERT   | `budgets`                 | `category_id`, `name`, `amount`, `period`, `start_date`, `alert_threshold` |
| Editar orçamento         | UPDATE   | `budgets`                 | Campos editáveis                                           |
| Deletar orçamento        | UPDATE   | `budgets`                 | `deleted_at = NOW()`                                       |
| Detalhe do orçamento     | SELECT   | `vw_budget_progress`      | Registro único por `id`                                    |
| Transações do orçamento  | SELECT   | `vw_recent_transactions`  | `category_id = budget.category_id AND transaction_date BETWEEN start/end` |
| Histórico comparativo    | SELECT   | `vw_category_spending`    | `category_id = ? GROUP BY month` (últimos 6 meses)         |
| Alerta automático        | TRIGGER  | `fn_check_budget_alert()` | Disparado no UPDATE de `budgets.spent`                     |

---

### METAS

| Tela / Elemento          | Operação | Tabela / View         | Campos relevantes                                               |
|--------------------------|----------|-----------------------|-----------------------------------------------------------------|
| Lista de metas           | SELECT   | `vw_goal_progress`    | `user_id = uid AND status = 'active'`                           |
| Criar meta               | INSERT   | `goals`               | `name`, `target_amount`, `deadline`, `monthly_contribution`, `account_id`, `color`, `icon`, `priority` |
| Editar meta              | UPDATE   | `goals`               | Campos editáveis                                                |
| Contribuir na meta       | UPDATE   | `goals`               | `current_amount = current_amount + valor`                       |
| Deletar meta             | UPDATE   | `goals`               | `deleted_at = NOW()`                                            |
| Detalhe da meta          | SELECT   | `vw_goal_progress`    | Registro único: `percent_complete`, `months_to_complete`, etc.  |
| Simulador                | Cálculo  | Frontend (sem DB)     | `(target - current) / monthly` → meses estimados               |
| Meta concluída           | TRIGGER  | `fn_check_goal_completion()` | Disparado no UPDATE de `goals.current_amount`            |
| Notificação de conclusão | INSERT   | `notifications`       | Inserida pelo trigger automaticamente                           |

---

### PERFIL E CONFIGURAÇÕES

| Tela / Elemento          | Operação | Tabela                | Campos relevantes                                    |
|--------------------------|----------|-----------------------|------------------------------------------------------|
| Dados pessoais           | SELECT   | `profiles`            | `full_name`, `avatar_url`, `phone`, `currency`, `locale`, `timezone`, `monthly_income` |
| Editar perfil            | UPDATE   | `profiles`            | Mesmos campos acima                                  |
| Upload avatar            | —        | Supabase Storage      | Bucket `avatars`, path `uid/avatar.jpg`              |
| Lista de contas          | SELECT   | `accounts`            | `user_id = uid AND deleted_at IS NULL`               |
| Criar conta              | INSERT   | `accounts`            | `name`, `type`, `bank_name`, `balance`, `color`, `icon` |
| Editar conta             | UPDATE   | `accounts`            | Campos editáveis                                     |
| Deletar conta            | UPDATE   | `accounts`            | `deleted_at = NOW()` (só se sem transações ativas)   |
| Lista cartões            | SELECT   | `vw_credit_card_summary` | `user_id = uid`                                  |
| Criar cartão             | INSERT   | `credit_cards`        | `name`, `brand`, `credit_limit`, `available_limit`, `closing_day`, `due_day` |
| Editar cartão            | UPDATE   | `credit_cards`        | Campos editáveis                                     |
| Lista categorias         | SELECT   | `categories`          | `user_id = uid OR user_id IS NULL AND deleted_at IS NULL` |
| Criar categoria          | INSERT   | `categories`          | `name`, `type`, `color`, `icon`, `parent_id`         |
| Editar categoria         | UPDATE   | `categories`          | Campos editáveis (is_system = false obrigatório)     |
| Deletar categoria        | UPDATE   | `categories`          | `deleted_at = NOW()` (RLS bloqueia is_system)        |
| Notificações             | SELECT   | `notifications`       | `user_id = uid ORDER BY created_at DESC`             |
| Marcar lida              | UPDATE   | `notifications`       | `status = 'read', read_at = NOW()`                   |
| Marcar todas lidas       | UPDATE   | `notifications`       | Bulk update `status = 'read' WHERE user_id = uid`    |
| Exportar dados           | SELECT   | Múltiplas tabelas     | CSV via Edge Function ou query direta                |

---

## 2. QUERIES MAIS USADAS (referência de implementação)

### Dashboard — saldo total
```sql
SELECT COALESCE(SUM(balance), 0) AS total_balance
FROM accounts
WHERE user_id = auth.uid()
  AND include_in_sum = TRUE
  AND is_active = TRUE
  AND deleted_at IS NULL;
```

### Transações — lista paginada com filtros
```sql
SELECT * FROM vw_recent_transactions
WHERE user_id = auth.uid()
  AND ($type IS NULL OR type = $type)
  AND ($category_id IS NULL OR category_id = $category_id)
  AND ($account_id IS NULL OR account_id = $account_id)
  AND ($status IS NULL OR status = $status)
  AND transaction_date BETWEEN $start_date AND $end_date
ORDER BY transaction_date DESC, created_at DESC
LIMIT $page_size OFFSET ($page - 1) * $page_size;
```

### Orçamentos — progresso do mês atual
```sql
SELECT * FROM vw_budget_progress
WHERE user_id = auth.uid()
  AND is_active = TRUE
  AND start_date <= CURRENT_DATE
  AND (end_date IS NULL OR end_date >= CURRENT_DATE);
```

### Metas — progresso ativas
```sql
SELECT * FROM vw_goal_progress
WHERE user_id = auth.uid()
  AND status = 'active'
ORDER BY priority ASC, created_at ASC;
```

### Gastos por categoria (mês atual)
```sql
SELECT * FROM vw_category_spending
WHERE user_id = auth.uid()
  AND month = DATE_TRUNC('month', CURRENT_DATE)::DATE
ORDER BY total_amount DESC;
```

### Resumo mensal (função)
```sql
SELECT * FROM fn_monthly_summary(
  auth.uid(),
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
  EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER
);
```

---

## 3. REALTIME SUBSCRIPTIONS (Supabase Realtime)

| Canal                  | Tabela          | Evento             | Tela afetada              |
|------------------------|-----------------|--------------------|---------------------------|
| `transactions:user_id` | `transactions`  | INSERT/UPDATE      | Dashboard, Transaction List |
| `notifications:user_id`| `notifications` | INSERT             | Badge de notificações      |
| `accounts:user_id`     | `accounts`      | UPDATE (balance)   | Dashboard (saldo)          |
| `budgets:user_id`      | `budgets`       | UPDATE (spent)     | Budget List                |
| `goals:user_id`        | `goals`         | UPDATE             | Goal List                  |

---

## 4. SUPABASE STORAGE (arquivos)

| Bucket     | Path                   | Conteúdo                | Acesso             |
|------------|------------------------|-------------------------|--------------------|
| `avatars`  | `{user_id}/avatar.jpg` | Foto de perfil          | Privado (RLS)      |
| `receipts` | `{user_id}/{tx_id}/*`  | Comprovantes de transações | Privado (RLS)  |

**Política de storage**: usuário acessa apenas arquivos dentro de sua pasta `{user_id}/`.

---

## 5. SUPABASE EDGE FUNCTIONS

| Function                    | Trigger              | Propósito                                       |
|-----------------------------|----------------------|-------------------------------------------------|
| `generate-recurring`        | Cron diário 06:00    | Chama `fn_generate_recurring_transactions()`    |
| `send-push-notification`    | DB Webhook (notifications INSERT) | Envia push notification via FCM/APNs |
| `export-user-data`          | HTTP POST (manual)   | Gera CSV/PDF com todos os dados do usuário      |
| `delete-expired-notifications` | Cron semanal      | Deleta notificações expiradas (`expires_at < NOW()`) |
