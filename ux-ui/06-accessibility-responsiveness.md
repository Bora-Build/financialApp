> **Especificação de produto — revisada em 09/11/2026.** Este documento descreve referências de interface, navegação ou modelo de dados; não comprova que todos os recursos estejam implementados ou habilitados na VPS. Para arquitetura e operação atuais, consulte o [índice](../docs/INDICE_DOCUMENTACAO.md) e o [estado validado](../docs/ESTADO_ATUAL.md).

# RESPONSIVIDADE, ACESSIBILIDADE E ESTADOS

---

## 1. BREAKPOINTS

```
Mobile first — escala ascendente

xs:  < 390px   → Dispositivos pequenos (SE, Galaxy A)
sm:  ≥ 390px   → Mobile padrão (iPhone 14, Pixel 7)
md:  ≥ 768px   → Tablet portrait / Mobile landscape
lg:  ≥ 1024px  → Tablet landscape / Laptop pequeno
xl:  ≥ 1280px  → Desktop padrão
2xl: ≥ 1536px  → Desktop grande / Ultrawide
```

### Comportamento por breakpoint — elementos críticos

| Elemento              | xs/sm (Mobile)       | md (Tablet)           | lg+ (Desktop)              |
|-----------------------|----------------------|-----------------------|----------------------------|
| Navegação             | Bottom Tab (5 abas)  | Bottom Tab + Sidebar  | Sidebar fixa 240px         |
| KPI Cards (dashboard) | 2x2 grid             | 4 em linha            | 4 em linha com mais dados  |
| Gráfico dashboard     | 1 coluna, 180px alto | 1 coluna, 260px alto  | 2 colunas, 260px alto      |
| Lista de transações   | Cards verticais      | Tabela simplificada   | Tabela completa com sidebar |
| Modais/Sheets         | Full screen ou sheet | Modal 80vw max 600px  | Modal 560px centralizado   |
| FAB                   | Visível, canto dir.  | Visível, canto dir.   | Botão no header            |
| Filtros               | Bottom sheet         | Bottom sheet / inline | Sidebar de filtros inline  |
| Formulários           | 1 coluna             | 1-2 colunas           | 2 colunas                  |
| Notificações          | Tela dedicada        | Tela dedicada         | Painel dropdown            |

---

## 2. RESPONSIVIDADE — REGRAS GERAIS

### Tipografia fluida
```css
/* Escala base */
html { font-size: clamp(14px, 1.5vw, 16px); }

/* Valores monetários grandes */
.amount-display { font-size: clamp(24px, 5vw, 48px); }
```

### Grid system
```
Mobile:  1 coluna, padding 16px
Tablet:  2 colunas, padding 24px, gap 16px
Desktop: 3-4 colunas, padding 32px, gap 20px
Max content width: 1440px (centrado)
```

### Imagens e ilustrações
- SVGs escaláveis em todos os breakpoints
- Ilustrações de onboarding: `height: clamp(200px, 35vh, 300px)`
- Avatares: 40px (mobile) / 48px (desktop)

### Touch targets
- Mínimo 44×44px em mobile para qualquer elemento interativo
- Padding extra em links de texto: `padding: 8px 0`
- Área de swipe em itens de lista: altura mínima 56px

---

## 3. ACESSIBILIDADE (WCAG 2.1 AA)

### 3.1 Contraste de Cores

| Par de cores                          | Proporção | Passa AA |
|---------------------------------------|-----------|----------|
| Text primary (#1E293B) / BG (#F8FAFC) | 12.5:1    | ✓ AAA    |
| Primary (#6366F1) / BG white          | 4.6:1     | ✓ AA     |
| Success text (#166534) / Success BG (#DCFCE7) | 5.8:1 | ✓ AA  |
| Error text (#991B1B) / Error BG (#FEE2E2) | 6.2:1 | ✓ AA    |
| Text secondary (#64748B) / BG white   | 4.6:1     | ✓ AA     |
| White / Primary (#6366F1)             | 4.6:1     | ✓ AA     |

**Dark mode** — todos os pares verificados com os tokens correspondentes.

---

### 3.2 Navegação por Teclado (Web)

```
Tab order lógico: top → bottom, left → right

Atalhos de teclado:
  Alt + N     → Nova transação
  Alt + D     → Dashboard
  Alt + T     → Transações
  Alt + B     → Orçamentos
  Alt + G     → Metas
  Esc         → Fechar modal/sheet
  Enter/Space → Ativar elemento focado
  ↑/↓         → Navegar em listas e selects
  ←/→         → Navegar entre tabs e slides
```

**Focus ring**: `box-shadow: 0 0 0 3px rgba(99,102,241,0.35)` em todos os elementos interativos. Nunca usar `outline: none` sem substituto.

---

### 3.3 Screen Readers

**Labels obrigatórios**:

```html
<!-- Ícones sem texto -->
<button aria-label="Adicionar nova transação">
  <PlusIcon />
</button>

<!-- Valores monetários -->
<span aria-label="Saldo total: quinze mil duzentos e quarenta reais">
  R$ 15.240,00
</span>

<!-- Progress bars -->
<div
  role="progressbar"
  aria-valuenow="75"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Orçamento de Alimentação: 75% utilizado"
/>

<!-- Tendências -->
<span aria-label="Aumento de 8,3% em relação ao mês anterior">
  ↑ 8,3%
</span>

<!-- Indicadores de cor -->
<!-- NÃO: "O orçamento está no vermelho" -->
<!-- SIM: "Orçamento excedido: R$ 320 de R$ 300" -->
```

**Regiões ARIA**:
```html
<main aria-label="Conteúdo principal">
<nav aria-label="Navegação principal">
<aside aria-label="Detalhes da transação">
<section aria-label="Resumo financeiro">
<section aria-labelledby="recent-transactions-heading">
```

**Live regions** para atualizações em tempo real:
```html
<div aria-live="polite" aria-atomic="true">
  <!-- Toasts de confirmação, atualizações de saldo -->
</div>
<div aria-live="assertive">
  <!-- Erros críticos -->
</div>
```

---

### 3.4 Mobile Accessibility (React Native)

```jsx
// Todos os Touchable/Pressable com accessibilityLabel
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Adicionar nova transação"
  accessibilityHint="Abre o formulário de nova transação"
>

// Valores monetários
<Text
  accessibilityLabel={`${isNegative ? 'despesa de' : 'receita de'} ${formattedAmount}`}
>
  {formattedAmount}
</Text>

// Swipe actions
<GestureDetector
  accessibilityActions={[
    { name: 'edit', label: 'Editar transação' },
    { name: 'delete', label: 'Deletar transação' }
  ]}
  onAccessibilityAction={handleAction}
>
```

---

### 3.5 Preferências do Sistema

| Preferência                  | Comportamento                                          |
|------------------------------|--------------------------------------------------------|
| `prefers-reduced-motion`     | Desativa todas as animações e transições               |
| `prefers-color-scheme: dark` | Aplica dark mode automaticamente (override no perfil)  |
| `prefers-contrast: more`     | Aumenta opacidade de borders e usa pesos de fonte maiores |
| Font size (sistema)          | Layout usa rem/sp, respeita tamanho configurado        |
| Bold text (iOS)              | `fontWeight: 600` vira `fontWeight: 800` automaticamente |

---

## 4. PERFORMANCE UX

### Estratégia de carregamento

```
Hierarquia de prioridade de render:

1. CRÍTICO (< 100ms)    → Skeleton das KPI cards
2. IMPORTANTE (< 500ms) → Dados do dashboard
3. COMPLEMENTAR (< 1s)  → Gráficos, listas longas
4. LAZY (scroll)        → Transações antigas, histórico
```

### React Native — otimizações
- `FlatList` com `getItemLayout` para listas de transações
- `windowSize={10}`, `maxToRenderPerBatch={10}` para performance
- `keyExtractor` baseado em `id` (UUID)
- Imagens de avatar com `FastImage` e cache

### Web — otimizações
- Gráficos com `React.lazy()` + Suspense (bundle splitting)
- Tabela de transações com virtualização (react-window ou tanstack-virtual)
- Prefetch de rotas adjacentes no hover dos links de navegação
- Service Worker para cache de assets estáticos

---

## 5. TRATAMENTO DE ERROS

### Hierarquia de erros

```
NÍVEL 1 — Campo inválido
  → Mensagem vermelha abaixo do campo
  → Não bloqueia o resto do formulário
  → Exemplo: "O valor deve ser maior que zero"

NÍVEL 2 — Falha de operação
  → Toast de erro (5s, dismiss manual disponível)
  → Botão "Tentar novamente"
  → Exemplo: "Não foi possível salvar a transação"

NÍVEL 3 — Falha de carregamento
  → Empty state com botão de retry
  → Mantém dados em cache (stale-while-revalidate)
  → Exemplo: Dashboard offline

NÍVEL 4 — Sessão expirada
  → Redirect para login
  → Mensagem: "Sua sessão expirou. Entre novamente."

NÍVEL 5 — Erro crítico de app
  → Error boundary com tela de fallback
  → Opção de recarregar ou reportar
```

### Mensagens de erro — guidelines
- Usar linguagem simples, sem jargão técnico
- Indicar o que aconteceu + o que o usuário pode fazer
- Nunca mostrar stack traces ou códigos de erro internos ao usuário final
- Logar internamente via Sentry ou similar

| Erro Supabase              | Mensagem ao usuário                        |
|----------------------------|--------------------------------------------|
| Invalid login credentials  | "Email ou senha incorretos"                |
| Email already in use       | "Este email já está cadastrado"            |
| Network error              | "Sem conexão. Verifique sua internet"      |
| RLS policy violation       | "Você não tem permissão para esta ação"    |
| Unique constraint          | "Já existe um registro com este nome"      |
| Check constraint           | "Valor inválido. Verifique os dados"       |

---

## 6. GUIA DE IMPLEMENTAÇÃO — COMPONENTES DE ESTADO

### Skeleton Screen (padrão para todos os loadings)

```
Regra: substituir o conteúdo real pelo skeleton durante o fetch inicial.
Nunca mostrar spinner centralizado para dados de lista ou cards.
Spinner é aceitável apenas para ações pontuais (salvar, deletar).

Animação shimmer: background linear-gradient animado da esquerda para direita
Duração: 1.5s, loop infinito
Cor light: #E2E8F0 → #F8FAFC → #E2E8F0
Cor dark:  #334155 → #475569 → #334155
```

### Empty States — por contexto

| Contexto               | Ilustração    | Título                        | Subtítulo                              | CTA                    |
|------------------------|---------------|-------------------------------|----------------------------------------|------------------------|
| Sem transações         | `empty-list`  | Nenhuma transação             | Adicione sua primeira movimentação     | + Adicionar transação  |
| Sem resultados (busca) | `search-empty`| Nada encontrado               | Tente outros termos ou filtros         | Limpar filtros         |
| Sem orçamentos         | `empty-budget`| Sem orçamentos ativos         | Controle seus gastos por categoria     | + Criar orçamento      |
| Sem metas              | `empty-goals` | Nenhuma meta definida         | Comece a planejar seu futuro           | + Criar meta           |
| Sem notificações       | `empty-notif` | Tudo em dia!                  | Você não tem notificações pendentes    | —                      |
| Sem contas             | `empty-account`| Nenhuma conta cadastrada     | Adicione sua conta para começar        | + Adicionar conta      |
| Sem cartões            | `empty-card`  | Nenhum cartão cadastrado      | Adicione seu cartão de crédito         | + Adicionar cartão     |

### Confirmações Destrutivas

Qualquer ação de delete deve ter confirmação explícita:

```
Mobile: Bottom Sheet
╔═══════════════════════════╗
║  Deletar transação?       ║
║                           ║
║  Esta ação não pode ser   ║
║  desfeita.                ║
║                           ║
║  [Cancelar]  [Deletar]    ║  ← Deletar em vermelho
╚═══════════════════════════╝

Web: Dialog Modal
┌─────────────────────────────────┐
│  Deletar transação?         [✕] │
│                                 │
│  Esta ação não pode ser desfeita│
│                                 │
│           [Cancelar] [Deletar]  │
└─────────────────────────────────┘
```

---

## 7. INTERNACIONALIZAÇÃO (i18n) — preparação

- Todos os textos em arquivo de tradução (`pt-BR` como padrão)
- Valores monetários via `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- Datas via `Intl.DateTimeFormat('pt-BR')`
- Suporte futuro: `en-US`, `es-ES`
- RTL: estrutura preparada mas não prioridade inicial
- Fuso horário: armazenado em `profiles.timezone`, aplicado em todas as datas de exibição
