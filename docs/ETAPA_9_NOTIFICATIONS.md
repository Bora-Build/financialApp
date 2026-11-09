> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# 📖 ETAPA 9 - DOCUMENTAÇÃO TÉCNICA DETALHADA

**Notificações Avançadas & Preferências de Usuário**

---

## 📑 Índice

1. [Arquitetura do Sistema](#arquitetura)
2. [Componentes UI](#componentes-ui)
3. [Serviços Backend](#serviços-backend)
4. [Hooks React Query](#hooks-react-query)
5. [Database Schema](#database-schema)
6. [PostgreSQL Triggers](#postgresql-triggers)
7. [Integração](#integração)
8. [Patterns & Best Practices](#patterns--best-practices)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitetura

### Camadas da Aplicação

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (React)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐    │
│  │   Header    │  │ NotificationBell│ │App Layout  │    │
│  └──────┬──────┘  └────────┬───────┘  └─────┬──────┘    │
└───────┼─────────────────────┼──────────────┼──────┘
        │                      │              │
        └──────────┬───────────┴──────────────┘
                   │
                   ▼
      ┌────────────────────────────┐
      │  NotificationsPanel        │
      │  (State Management)        │
      │  - isOpen: boolean         │
      │  - activeTab: 'notifications'│'settings'
      └────────┬───────────────────┘
               │
       ┌───────┴──────────┐
       │                  │
       ▼                  ▼
┌──────────────────┐  ┌──────────────────┐
│ Notifications    │  │ Settings         │
│ List             │  │ Configuration    │
│ - Search         │  │ - Channel config │
│ - Filter         │  │ - Sound settings │
│ - Items          │  │ - Type toggles   │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         └──────────┬──────────┘
                    │
                    ▼ (via Hooks)
      ┌────────────────────────────┐
      │    React Query State        │
      │  - useNotifications         │
      │  - useNotificationPrefs     │
      │  - useMutations             │
      └────────┬───────────────────┘
               │
               ▼ (via Services)
      ┌────────────────────────────┐
      │    API Services Layer       │
      │  - notifications.ts        │
      │  - notificationPrefs.ts    │
      └────────┬───────────────────┘
               │
               ▼ (via Supabase Client)
      ┌────────────────────────────┐
      │   Supabase PostgREST API   │
      │   - RPC calls              │
      │   - REST endpoints         │
      └────────┬───────────────────┘
               │
               ▼ (Database triggers)
      ┌────────────────────────────┐
      │  PostgreSQL Database       │
      │  - notifications table     │
      │  - preferences table       │
      │  - Triggers & Functions    │
      └────────────────────────────┘
```

### Fluxo de Evento: Configurar Preferências

```
User clicks "Save" 
  ↓
NotificationSettings.onSave()
  ↓
useUpdateNotificationPreferences.mutate(newPrefs)
  ↓
React Query mutation initiated
  ↓
updateNotificationPreferences(payload) [API service]
  ↓
supabase.rpc('update_notification_preferences', { payload })
  ↓
PostgreSQL fn_update_notification_preferences()
  ↓
UPDATE notification_preferences SET ...
  ↓
Database MODIFIED
  ↓
Trigger: AFTER UPDATE notification_preferences
  ↓
Supabase realtime subscription (if implemented)
  ↓
onSuccess callback (React Query)
  ↓
queryClient.invalidateQueries()
  ↓
useNotificationPreferences hook re-fetches
  ↓
Component re-renders with NEW data
  ↓
Toast success message
```

---

## 🎨 Componentes UI

### 1. NotificationBell.tsx

**Localização:** `src/components/ui/NotificationBell.tsx`  
**Tipo:** Presentational Component  
**Props:**

```tsx
interface NotificationBellProps {
  unreadCount?: number
  onNotificationClick?: () => void
  className?: string
}
```

**Features:**
- Badge com contagem de não-lidas
- Overflow "99+" para números grandes
- Ícone com animação de pulsação
- Acessibilidade ARIA labels

**Exemplo de Uso:**
```tsx
import { NotificationBell } from '@/components/ui/NotificationBell'

function Header() {
  const { data: notifications } = useNotifications()
  const unreadCount = notifications?.filter(n => !n.read_at).length || 0
  
  return (
    <NotificationBell 
      unreadCount={unreadCount}
      onNotificationClick={() => setOpen(true)}
    />
  )
}
```

**Styling:**
```tsx
// Badge positioning
<div className="relative inline-block">
  {unreadCount > 0 && (
    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center 
      justify-center rounded-full bg-red-500 text-xs font-bold text-white">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )}
</div>
```

---

### 2. NotificationItem.tsx

**Localização:** `src/components/ui/NotificationItem.tsx`  
**Tipo:** Presentational Component  
**Props:**

```tsx
interface NotificationItemProps {
  notification: Notification
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
}

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  data?: Record<string, any>
  read_at?: string
  created_at: string
  updated_at: string
}

type NotificationType = 
  | 'budget_alert'      // 💰
  | 'goal_reached'      // 🎉
  | 'bill_due'          // 📅
  | 'large_expense'     // ⚠️
  | 'low_balance'       // 📉
  | 'recurring_created' // 🔄
  | 'installment_due'   // 💳
  | 'general'           // ℹ️
```

**Features:**
- Cor dinâmica por tipo
- Timestamp relativo (ex: "há 5 min")
- Quick actions (marcar como lida, deletar)
- Ícone visual por tipo

**Type Colors:**
```tsx
const typeColors: Record<NotificationType, string> = {
  budget_alert: 'border-yellow-200 bg-yellow-50',
  goal_reached: 'border-green-200 bg-green-50',
  bill_due: 'border-blue-200 bg-blue-50',
  large_expense: 'border-red-200 bg-red-50',
  low_balance: 'border-orange-200 bg-orange-50',
  recurring_created: 'border-purple-200 bg-purple-50',
  installment_due: 'border-pink-200 bg-pink-50',
  general: 'border-gray-200 bg-gray-50',
}
```

**Exemplo Render:**
```tsx
<div className={`rounded-lg border-l-4 p-4 ${typeColors[type]}`}>
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-600">{message}</p>
      <span className="text-xs text-gray-500">{timeAgo}</span>
    </div>
    <div className="flex gap-2">
      {!read_at && (
        <button onClick={() => onMarkAsRead(id)}>
          ✓ Lido
        </button>
      )}
      <button onClick={() => onDelete(id)}>
        🗑️
      </button>
    </div>
  </div>
</div>
```

---

### 3. NotificationList.tsx

**Localização:** `src/components/ui/NotificationList.tsx`  
**Tipo:** Container Component  
**Props:**

```tsx
interface NotificationListProps {
  notifications?: Notification[]
  loading?: boolean
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
  onTypeFilter?: (type: NotificationType | null) => void
}
```

**Features:**
- Busca por texto (title + message)
- Filtros por tipo
- Pull-to-refresh (mobile)
- Scroll infinito placeholder
- Empty state
- Loading skeleton

**Search Implementation:**
```tsx
const filtered = notifications.filter(n => {
  const matchesSearch = !searchTerm || 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.message.toLowerCase().includes(searchTerm.toLowerCase())
  
  const matchesType = !selectedType || n.type === selectedType
  
  return matchesSearch && matchesType
})
```

**Filter Pills:**
```tsx
interface FilterPill {
  label: string
  type: NotificationType | null
  count: number
  emoji: string
}

const filterPills: FilterPill[] = [
  { label: 'Todos', type: null, emoji: '📱' },
  { label: 'Orçamento', type: 'budget_alert', emoji: '💰' },
  { label: 'Metas', type: 'goal_reached', emoji: '🎉' },
  // ... more
]
```

---

### 4. NotificationSettings.tsx

**Localização:** `src/components/ui/NotificationSettings.tsx`  
**Tipo:** Container Component (Smart)  
**Props:**

```tsx
interface NotificationSettingsProps {
  onSave?: (preferences: NotificationPreferences) => void
  loading?: boolean
}

interface NotificationPreferences {
  enabled: boolean
  pushEnabled: boolean
  emailEnabled: boolean
  inAppEnabled: boolean
  soundEnabled: boolean
  silentHours: { start: string; end: string }
  maxPerDay: number
  types: Record<NotificationType, boolean>
}
```

**Sections:**

1. **Master Toggle**
   - Ativa/desativa todas as notificações

2. **Channels Configuration**
   - Push notifications
   - Email
   - In-app notifications

3. **Sound Settings**
   - Toggle som
   - Preview de som

4. **Silent Hours**
   - Start time (padrão 22:00)
   - End time (padrão 07:00)
   - Notificações ainda listadas, apenas áudio/push silenciados

5. **Frequency Limit**
   - Máximo de notificações por dia (1-100)
   - Padrão 20

6. **Type-specific Toggles**
   - 8 toggles individuais por tipo
   - Cada um pode ser ativado/desativado

**Form State Management:**
```tsx
const [preferences, setPreferences] = useState<NotificationPreferences>({
  enabled: true,
  pushEnabled: true,
  emailEnabled: false,
  inAppEnabled: true,
  soundEnabled: true,
  silentHours: { start: '22:00', end: '07:00' },
  maxPerDay: 20,
  types: {
    budget_alert: true,
    goal_reached: true,
    bill_due: true,
    large_expense: true,
    low_balance: true,
    recurring_created: true,
    installment_due: true,
    general: true,
  },
})
```

**Save Handler:**
```tsx
const handleSave = async () => {
  try {
    await onSave?.(preferences)
    success({ message: 'Preferências salvas com sucesso!' })
  } catch (error) {
    error({ message: 'Erro ao salvar preferências' })
  }
}
```

---

### 5. NotificationsPanel.tsx

**Localização:** `src/components/ui/NotificationsPanel.tsx`  
**Tipo:** Container Component  
**Props:**

```tsx
interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
}
```

**Features:**
- Modal com tema dark
- Duas abas: Notificações e Configurações
- Tab switching sem recarregar dados
- Close button + overlay click

**Tab Implementation:**
```tsx
type TabType = 'notifications' | 'settings'

const [activeTab, setActiveTab] = useState<TabType>('notifications')

return (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="space-y-4">
      {/* Tab Buttons */}
      <div className="flex gap-2 border-b">
        <button 
          onClick={() => setActiveTab('notifications')}
          className={activeTab === 'notifications' ? 'active' : ''}
        >
          🔔 Notificações
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={activeTab === 'settings' ? 'active' : ''}
        >
          ⚙️ Configurações
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'notifications' && <NotificationList />}
      {activeTab === 'settings' && <NotificationSettings />}
    </div>
  </Modal>
)
```

---

## 🔧 Serviços Backend

### 1. notificationPreferences.ts

**Localização:** `src/services/api/notificationPreferences.ts`

```typescript
import { supabase } from './supabase'
import type { NotificationPreference } from '@/types/database'

/**
 * Obter preferências de notificações do usuário
 */
export async function fetchNotificationPreferences(): Promise<NotificationPreference> {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .single()

  if (error) {
    // Se não existe, criar com valores padrão
    if (error.code === 'PGRST116') {
      return createNotificationPreferences({
        enabled: true,
        push_enabled: true,
        email_enabled: false,
        in_app_enabled: true,
        sound_enabled: true,
        silent_hours_start: '22:00',
        silent_hours_end: '07:00',
        max_per_day: 20,
        budget_alert_enabled: true,
        goal_reached_enabled: true,
        bill_due_enabled: true,
        large_expense_enabled: true,
        low_balance_enabled: true,
        recurring_created_enabled: true,
        installment_due_enabled: true,
        general_enabled: true,
      } as any)
    }
    throw error
  }

  return data
}

/**
 * Criar preferências de notificações para novo usuário
 */
export async function createNotificationPreferences(
  preferences: Omit<NotificationPreference, 'id' | 'created_at' | 'updated_at'>
): Promise<NotificationPreference> {
  const { data, error } = await supabase
    .from('notification_preferences')
    .insert([preferences])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Atualizar todas as preferências do usuário
 */
export async function updateNotificationPreferences(
  updates: Partial<NotificationPreference>
): Promise<NotificationPreference> {
  const { data, error } = await supabase
    .from('notification_preferences')
    .update(updates)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Atualizar um campo específico de preferência
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateNotificationPreference(key: keyof NotificationPreference, value: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return updateNotificationPreferences({ [key]: value } as any)
}
```

**Error Handling:**
- `PGRST116`: Preferências não existem (cria com defaults)
- Network errors: Propagados para o Hook
- Validation errors: Retornados do PostgreSQL

---

## 🪝 Hooks React Query

### 1. useNotificationPreferences.ts

**Localização:** `src/hooks/useNotificationPreferences.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchNotificationPreferences, 
  createNotificationPreferences, 
  updateNotificationPreferences, 
  updateNotificationPreference 
} from '@/services/api/notificationPreferences'
import { useAuthStore } from '@/stores/authStore'
import type { NotificationPreference } from '@/types/database'

// Query Key Factory
export const notificationPrefsKeys = {
  all: ['notificationPrefs'] as const,
  detail: () => [...notificationPrefsKeys.all, 'detail'] as const,
}

/**
 * Hook para obter preferências de notificações
 * 
 * @returns Query resultado com preferências
 * 
 * @example
 * const { data: prefs, isLoading, error } = useNotificationPreferences()
 */
export function useNotificationPreferences() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: notificationPrefsKeys.detail(),
    queryFn: fetchNotificationPreferences,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 30, // 30 min (cache time)
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  })
}

/**
 * Hook para criar preferências de notificações
 */
export function useCreateNotificationPreferences() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (preferences: Omit<NotificationPreference, 'id' | 'created_at' | 'updated_at'>) =>
      createNotificationPreferences(preferences),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationPrefsKeys.all })
    },
  })
}

/**
 * Hook para atualizar todas as preferências
 */
export function useUpdateNotificationPreferences() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<Omit<NotificationPreference, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) =>
      updateNotificationPreferences(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationPrefsKeys.all })
    },
  })
}

/**
 * Hook para atualizar preferência individual
 */
export function useUpdateNotificationPreference() {
  const qc = useQueryClient()

  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ key, value }: { key: keyof NotificationPreference; value: any }) =>
      updateNotificationPreference(key, value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationPrefsKeys.all })
    },
  })
}
```

**Query Key Strategy:**
```tsx
// Todos as queries de preferências
['notificationPrefs']

// Query específica de preferências
['notificationPrefs', 'detail']

// Quando invalidate, invalida tudo
queryClient.invalidateQueries({ 
  queryKey: notificationPrefsKeys.all 
})
```

**Retry Strategy:**
```
Attempt 1: 2 segundos
Attempt 2: 4 segundos
Attempt 3: 8 segundos
Max: 30 segundos
```

**Cache Strategy:**
```
staleTime: 5 min      → Query considerado "fresh" por 5 min
gcTime: 30 min        → Cache mantido por 30 min mesmo se stale
```

---

## 🗄️ Database Schema

### Tabela notification_preferences

```sql
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Master toggle
  enabled boolean DEFAULT true,
  
  -- Channel preferences
  push_enabled boolean DEFAULT true,
  email_enabled boolean DEFAULT false,
  in_app_enabled boolean DEFAULT true,
  
  -- Sound preferences
  sound_enabled boolean DEFAULT true,
  
  -- Silent hours (no audio/push, but list notifications)
  silent_hours_start time DEFAULT '22:00'::time,
  silent_hours_end time DEFAULT '07:00'::time,
  
  -- Rate limiting
  max_per_day integer DEFAULT 20 CHECK (max_per_day >= 1 AND max_per_day <= 100),
  
  -- Type-specific toggles
  budget_alert_enabled boolean DEFAULT true,
  goal_reached_enabled boolean DEFAULT true,
  bill_due_enabled boolean DEFAULT true,
  large_expense_enabled boolean DEFAULT true,
  low_balance_enabled boolean DEFAULT true,
  recurring_created_enabled boolean DEFAULT true,
  installment_due_enabled boolean DEFAULT true,
  general_enabled boolean DEFAULT true,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT max_per_day_valid CHECK (max_per_day >= 1 AND max_per_day <= 100)
);

-- Indexes
CREATE INDEX idx_notification_preferences_user_id 
  ON notification_preferences(user_id);

-- Update timestamp on modify
CREATE OR REPLACE FUNCTION update_notification_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_notification_preferences_timestamp
BEFORE UPDATE ON notification_preferences
FOR EACH ROW
EXECUTE FUNCTION update_notification_preferences_timestamp();
```

### Row Level Security

```sql
-- Enable RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own preferences
CREATE POLICY "Users can view own notification_preferences"
ON notification_preferences
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can update their own preferences
CREATE POLICY "Users can update own notification_preferences"
ON notification_preferences
FOR UPDATE
USING (auth.uid() = user_id);
```

---

## ⚙️ PostgreSQL Triggers

### 1. fn_check_low_balance()

```sql
CREATE OR REPLACE FUNCTION fn_check_low_balance()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_prefs notification_preferences%ROWTYPE;
BEGIN
  IF NEW.balance < 100 THEN
    v_user_id := NEW.user_id;
    
    -- Get user preferences
    SELECT * INTO v_prefs 
    FROM notification_preferences 
    WHERE user_id = v_user_id;
    
    -- Check if user has enabled low_balance notifications
    IF v_prefs.enabled AND v_prefs.low_balance_enabled THEN
      INSERT INTO notifications (user_id, title, message, type, data)
      VALUES (
        v_user_id,
        'Saldo Baixo Detectado',
        'Sua conta está com saldo inferior a R$100',
        'low_balance'::notification_type,
        jsonb_build_object(
          'account_id', NEW.id,
          'balance', NEW.balance,
          'currency', 'BRL'
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on accounts UPDATE/INSERT
CREATE TRIGGER tr_check_low_balance_accounts
AFTER INSERT OR UPDATE ON accounts
FOR EACH ROW
EXECUTE FUNCTION fn_check_low_balance();
```

### 2. fn_check_large_expense()

```sql
CREATE OR REPLACE FUNCTION fn_check_large_expense()
RETURNS TRIGGER AS $$
DECLARE
  v_monthly_avg numeric;
  v_prefs notification_preferences%ROWTYPE;
BEGIN
  -- Calculate monthly average for this account
  SELECT AVG(amount) INTO v_monthly_avg
  FROM transactions
  WHERE account_id = NEW.account_id
  AND type = 'expense'
  AND created_at >= NOW() - INTERVAL '30 days';
  
  v_monthly_avg := COALESCE(v_monthly_avg, 0);
  
  -- Check if expense > 150% of average
  IF NEW.amount > (v_monthly_avg * 1.5) THEN
    -- Get user preferences
    SELECT * INTO v_prefs
    FROM notification_preferences
    WHERE user_id = (SELECT user_id FROM accounts WHERE id = NEW.account_id);
    
    IF v_prefs.enabled AND v_prefs.large_expense_enabled THEN
      INSERT INTO notifications (user_id, title, message, type, data)
      VALUES (
        (SELECT user_id FROM accounts WHERE id = NEW.account_id),
        'Gasto Elevado',
        'Você fez um gasto de R$' || NEW.amount || ', acima do normal',
        'large_expense'::notification_type,
        jsonb_build_object(
          'transaction_id', NEW.id,
          'amount', NEW.amount,
          'monthly_avg', v_monthly_avg,
          'percentage_over', ROUND(((NEW.amount / v_monthly_avg - 1) * 100)::numeric, 2)
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_check_large_expense
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION fn_check_large_expense();
```

### 3. fn_check_bill_due()

```sql
CREATE OR REPLACE FUNCTION fn_check_bill_due()
RETURNS TRIGGER AS $$
DECLARE
  v_days_until_due integer;
  v_prefs notification_preferences%ROWTYPE;
BEGIN
  -- Calculate days until due date
  v_days_until_due := (NEW.next_due_date::date - CURRENT_DATE);
  
  -- Alert if due in next 3 days
  IF v_days_until_due BETWEEN 0 AND 3 THEN
    SELECT * INTO v_prefs
    FROM notification_preferences
    WHERE user_id = (SELECT user_id FROM accounts WHERE id = NEW.account_id);
    
    IF v_prefs.enabled AND v_prefs.bill_due_enabled THEN
      INSERT INTO notifications (user_id, title, message, type, data)
      VALUES (
        (SELECT user_id FROM accounts WHERE id = NEW.account_id),
        'Conta a Vencer',
        'A transação ' || NEW.description || ' vence em ' || v_days_until_due || ' dia(s)',
        'bill_due'::notification_type,
        jsonb_build_object(
          'recurring_transaction_id', NEW.id,
          'due_date', NEW.next_due_date,
          'days_until_due', v_days_until_due,
          'amount', NEW.amount
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_check_bill_due
AFTER INSERT OR UPDATE ON recurring_transactions
FOR EACH ROW
EXECUTE FUNCTION fn_check_bill_due();
```

### 4. fn_notify_recurring_created()

```sql
CREATE OR REPLACE FUNCTION fn_notify_recurring_created()
RETURNS TRIGGER AS $$
DECLARE
  v_prefs notification_preferences%ROWTYPE;
BEGIN
  SELECT * INTO v_prefs
  FROM notification_preferences
  WHERE user_id = (SELECT user_id FROM accounts WHERE id = NEW.account_id);
  
  IF v_prefs.enabled AND v_prefs.recurring_created_enabled THEN
    INSERT INTO notifications (user_id, title, message, type, data)
    VALUES (
      (SELECT user_id FROM accounts WHERE id = NEW.account_id),
      'Transação Recorrente Criada',
      'Nova transação recorrente: ' || NEW.description,
      'recurring_created'::notification_type,
      jsonb_build_object(
        'recurring_transaction_id', NEW.id,
        'description', NEW.description,
        'frequency', NEW.frequency,
        'amount', NEW.amount
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_notify_recurring_created
AFTER INSERT ON recurring_transactions
FOR EACH ROW
EXECUTE FUNCTION fn_notify_recurring_created();
```

### 5. fn_check_installment_due()

```sql
CREATE OR REPLACE FUNCTION fn_check_installment_due()
RETURNS TRIGGER AS $$
DECLARE
  v_days_until_due integer;
  v_prefs notification_preferences%ROWTYPE;
  v_user_id uuid;
BEGIN
  -- Calculate days until installment due
  v_days_until_due := (NEW.due_date::date - CURRENT_DATE);
  
  -- Get user_id from credit card
  SELECT user_id INTO v_user_id
  FROM credit_cards
  WHERE id = NEW.credit_card_id;
  
  -- Alert if due in next 3 days or overdue
  IF v_days_until_due <= 3 AND NEW.status IN ('pending', 'overdue') THEN
    SELECT * INTO v_prefs
    FROM notification_preferences
    WHERE user_id = v_user_id;
    
    IF v_prefs.enabled AND v_prefs.installment_due_enabled THEN
      INSERT INTO notifications (user_id, title, message, type, data)
      VALUES (
        v_user_id,
        'Parcela Vencendo',
        'Parcela #' || NEW.number || ' vencida em ' || 
        CASE WHEN v_days_until_due < 0 THEN 'há ' || ABS(v_days_until_due) || ' dias'
             ELSE 'em ' || v_days_until_due || ' dias' END,
        'installment_due'::notification_type,
        jsonb_build_object(
          'installment_id', NEW.id,
          'number', NEW.number,
          'total_installments', NEW.total_installments,
          'due_date', NEW.due_date,
          'amount', NEW.amount,
          'credit_card_id', NEW.credit_card_id
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_check_installment_due
AFTER INSERT OR UPDATE ON installments
FOR EACH ROW
EXECUTE FUNCTION fn_check_installment_due();
```

---

## 🔌 Integração

### Header Integration

**Arquivo:** `src/components/layout/Header.tsx`

```tsx
import { NotificationBell } from '@/components/ui/NotificationBell'
import { useCategoriesAndNotifications } from '@/hooks/api/useCategoriesAndNotifications'

export function Header({ onNotificationClick }: HeaderProps) {
  const { data: notifications, isLoading } = useCategoriesAndNotifications()
  const unreadCount = notifications?.filter(n => !n.read_at).length || 0

  return (
    <div className="flex items-center justify-between">
      <h1>Financial App</h1>
      <NotificationBell 
        unreadCount={unreadCount}
        onNotificationClick={onNotificationClick}
      />
    </div>
  )
}
```

### AppLayout Integration

**Arquivo:** `src/components/layout/AppLayout.tsx`

```tsx
import { useState } from 'react'
import { Header } from './Header'
import { NotificationsPanel } from '@/components/ui/NotificationsPanel'

export function AppLayout({ children }: AppLayoutProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onNotificationClick={() => setNotificationsOpen(true)}
      />
      
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  )
}
```

---

## 🎯 Patterns & Best Practices

### 1. Query Key Factory Pattern

```tsx
// Better: Organized, reusable, type-safe
const notificationPrefsKeys = {
  all: ['notificationPrefs'] as const,
  detail: () => [...notificationPrefsKeys.all, 'detail'] as const,
}

// Usage
useQuery({
  queryKey: notificationPrefsKeys.detail(),
  // ...
})

// Invalidate
queryClient.invalidateQueries({ 
  queryKey: notificationPrefsKeys.all 
})
```

### 2. Stale Time vs GC Time

```tsx
useQuery({
  // Data is fresh for 5 minutes
  staleTime: 1000 * 60 * 5,
  
  // Cache is kept for 30 minutes
  gcTime: 1000 * 60 * 30,
  
  // Retry on failure
  retry: 2,
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
})
```

### 3. Optimistic Updates

```tsx
const mutation = useMutation({
  mutationFn: updateNotificationPreferences,
  onMutate: async (newData) => {
    // Cancel any outgoing requests
    await queryClient.cancelQueries({ 
      queryKey: notificationPrefsKeys.all 
    })

    // Save old data
    const oldData = queryClient.getQueryData(notificationPrefsKeys.detail())

    // Set optimistic data
    queryClient.setQueryData(notificationPrefsKeys.detail(), newData)

    return { oldData }
  },
  onError: (err, newData, context) => {
    // Revert on error
    queryClient.setQueryData(
      notificationPrefsKeys.detail(),
      context?.oldData
    )
  },
  onSettled: () => {
    // Refetch after success or error
    queryClient.invalidateQueries({ 
      queryKey: notificationPrefsKeys.all 
    })
  },
})
```

### 4. Error Boundary Pattern

```tsx
<ErrorBoundary fallback={<ErrorPage />}>
  <NotificationsPanel>
    <ErrorBoundary fallback={<ErrorList />}>
      <NotificationList />
    </ErrorBoundary>
  </NotificationsPanel>
</ErrorBoundary>
```

---

## 🐛 Troubleshooting

### Problema: Notificações não aparecem

**Causas possíveis:**
1. Preferências desabilitadas em Settings
2. Horário silencioso ativo
3. User_id mismatch no banco

**Solução:**
```tsx
// Verificar preferências
const { data: prefs } = useNotificationPreferences()
console.log(prefs.enabled, prefs.low_balance_enabled)

// Verificar RLS
-- No PostgreSQL
SELECT * FROM notification_preferences WHERE user_id = 'YOUR_USER_ID';
```

### Problema: Mutação de preferências falha

**Causas possíveis:**
1. Constraint violation (max_per_day fora do range)
2. RLS policy bloqueando UPDATE
3. Network error

**Solução:**
```tsx
try {
  await updateNotificationPreferences({
    max_per_day: 50, // Deve estar entre 1-100
  })
} catch (error) {
  console.error('Update failed:', error.message)
}
```

### Problema: Performance lenta

**Causas possíveis:**
1. Query sem cache (gcTime muito baixo)
2. Muitas re-fetches
3. Large notification list

**Solução:**
```tsx
// Aumentar cache
useQuery({
  gcTime: 1000 * 60 * 60, // 1 hora
  staleTime: 1000 * 60 * 10, // 10 minutos
})

// Paginar lista
const [page, setPage] = useState(0)
const notifications = allNotifications.slice(page * 20, (page + 1) * 20)
```

---

## 📚 Referências

### Documentação Externa
- [React Query Docs](https://tanstack.com/query/latest)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Arquivos Relacionados
- [ETAPA_9_COMPLETED.md](./ETAPA_9_COMPLETED.md) - Sumário executivo
- [src/components/ui/](./src/components/ui/) - Todos os componentes
- [src/services/api/](./src/services/api/) - Serviços de API
- [database/schema.sql](./database/schema.sql) - Schema completo

---

**Última atualização:** Janeiro 2025  
**Versão da Documentação:** 1.0.0  
**Status:** ✅ COMPLETO E ATUALIZADO
