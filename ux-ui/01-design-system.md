> **Especificação de produto — revisada em 09/11/2026.** Este documento descreve referências de interface, navegação ou modelo de dados; não comprova que todos os recursos estejam implementados ou habilitados na VPS. Para arquitetura e operação atuais, consulte o [índice](../docs/INDICE_DOCUMENTACAO.md) e o [estado validado](../docs/ESTADO_ATUAL.md).

# DESIGN SYSTEM — Financial App

---

## 1. TOKENS DE COR

### Paleta Principal
| Token                  | Hex       | Uso                                          |
|------------------------|-----------|----------------------------------------------|
| `color.primary.500`    | `#6366F1` | CTAs principais, links, seleção ativa        |
| `color.primary.400`    | `#818CF8` | Hover, estados secundários                   |
| `color.primary.600`    | `#4F46E5` | Pressed / active                             |
| `color.primary.100`    | `#E0E7FF` | Background de chips, badges                  |
| `color.success.500`    | `#22C55E` | Receitas, metas atingidas, confirmações      |
| `color.success.100`    | `#DCFCE7` | Background de badges de receita              |
| `color.warning.500`    | `#F59E0B` | Alertas, orçamentos próximos do limite       |
| `color.warning.100`    | `#FEF3C7` | Background de badges de alerta               |
| `color.error.500`      | `#EF4444` | Despesas, limites excedidos, erros           |
| `color.error.100`      | `#FEE2E2` | Background de badges de despesa              |
| `color.info.500`       | `#3B82F6` | Informações, transferências, tooltips        |
| `color.info.100`       | `#DBEAFE` | Background de badges de info                 |

### Neutros
| Token                  | Light Mode | Dark Mode  |
|------------------------|------------|------------|
| `color.bg.primary`     | `#F8FAFC`  | `#0F172A`  |
| `color.bg.surface`     | `#FFFFFF`  | `#1E293B`  |
| `color.bg.elevated`    | `#FFFFFF`  | `#263148`  |
| `color.bg.subtle`      | `#F1F5F9`  | `#1A2744`  |
| `color.text.primary`   | `#1E293B`  | `#F1F5F9`  |
| `color.text.secondary` | `#64748B`  | `#94A3B8`  |
| `color.text.disabled`  | `#CBD5E1`  | `#475569`  |
| `color.border.default` | `#E2E8F0`  | `#334155`  |
| `color.border.subtle`  | `#F1F5F9`  | `#1E293B`  |

---

## 2. TIPOGRAFIA

### Família de Fontes
- **Mobile**: `Inter` (principal), `SF Pro Display` (iOS fallback), `Roboto` (Android fallback)
- **Web**: `Inter`, `system-ui`, `sans-serif`

### Escala Tipográfica
| Token            | Tamanho | Peso | Line-height | Uso                              |
|------------------|---------|------|-------------|----------------------------------|
| `text.display`   | 32px    | 700  | 1.2         | Saldos grandes, títulos hero     |
| `text.h1`        | 24px    | 700  | 1.3         | Títulos de tela                  |
| `text.h2`        | 20px    | 600  | 1.4         | Títulos de seção                 |
| `text.h3`        | 18px    | 600  | 1.4         | Subtítulos, cards                |
| `text.body.lg`   | 16px    | 400  | 1.5         | Corpo principal                  |
| `text.body.md`   | 14px    | 400  | 1.5         | Labels, descrições               |
| `text.body.sm`   | 13px    | 400  | 1.4         | Textos auxiliares                |
| `text.caption`   | 12px    | 400  | 1.3         | Legendas, timestamps             |
| `text.overline`  | 11px    | 600  | 1.2         | Labels em maiúsculas, categorias |

### Valores Monetários (regras especiais)
- Sempre usar `font-variant-numeric: tabular-nums` para alinhamento
- Parte inteira: `text.h2` ou `text.display`
- Decimais: 70% do tamanho da parte inteira, `text.secondary`
- Positivo: `color.success.500` | Negativo: `color.error.500` | Neutro: `color.text.primary`

---

## 3. ESPAÇAMENTO

Escala base de 4px:
| Token     | Valor | Uso típico                        |
|-----------|-------|-----------------------------------|
| `space.1` | 4px   | Gap entre ícone e label           |
| `space.2` | 8px   | Padding interno de chips/badges   |
| `space.3` | 12px  | Gap entre elementos de lista      |
| `space.4` | 16px  | Padding horizontal de tela        |
| `space.5` | 20px  | Gap entre cards                   |
| `space.6` | 24px  | Padding vertical de seções        |
| `space.8` | 32px  | Separação entre seções            |
| `space.10`| 40px  | Padding de modais/sheets          |
| `space.12`| 48px  | Altura de itens de lista          |
| `space.16`| 64px  | Espaçamento entre telas           |

---

## 4. BORDAS E ELEVAÇÃO

### Border Radius
| Token         | Valor | Uso                              |
|---------------|-------|----------------------------------|
| `radius.sm`   | 6px   | Chips, badges, inputs            |
| `radius.md`   | 10px  | Cards pequenos, botões           |
| `radius.lg`   | 16px  | Cards principais, sheets         |
| `radius.xl`   | 20px  | Bottom sheets, modais            |
| `radius.full` | 999px | Avatares, FAB, progress circular |

### Sombras (Light Mode)
| Token          | Valor CSS                                          | Uso              |
|----------------|----------------------------------------------------|------------------|
| `shadow.sm`    | `0 1px 3px rgba(0,0,0,0.08)`                      | Cards sutis      |
| `shadow.md`    | `0 4px 12px rgba(0,0,0,0.10)`                     | Cards principais |
| `shadow.lg`    | `0 8px 24px rgba(99,102,241,0.15)`                | FAB, modais      |
| `shadow.focus` | `0 0 0 3px rgba(99,102,241,0.25)`                 | Estados de foco  |

---

## 5. COMPONENTES REUTILIZÁVEIS

### 5.1 FinanceCard
Exibe resumo de uma métrica financeira.

```
┌─────────────────────────────┐
│ [ícone]  Label          [>] │
│                             │
│  R$ 12.450,00               │
│  ↑ 8,3% vs mês anterior     │
└─────────────────────────────┘
```

**Props**: `label`, `value`, `trend`, `trendValue`, `icon`, `color`, `onPress`
**Estados**: default, loading (skeleton), positive, negative

---

### 5.2 TransactionItem
Item de linha em listas de transações.

```
┌─────────────────────────────────────────┐
│ [cat.icon]  Descrição        R$ -150,00 │
│             Conta • 14/02    Categoria  │
└─────────────────────────────────────────┘
```

**Props**: `transaction`, `onPress`, `onSwipeLeft`, `onSwipeRight`
**Swipe direita**: editar (indigo) | **Swipe esquerda**: deletar (vermelho)
**Variantes**: expense (vermelho), income (verde), transfer (azul)

---

### 5.3 ProgressBar
Barra de progresso linear para orçamentos e metas.

```
Label                    R$ 750 / R$ 1.000
████████████░░░░░░░░░░░  75%
```

**Props**: `current`, `total`, `label`, `color`, `showPercentage`, `alertThreshold`
**Cores automáticas**: 
- `< alertThreshold%` → `color.success.500`
- `≥ alertThreshold%` → `color.warning.500`
- `≥ 100%` → `color.error.500`

---

### 5.4 AccountCard
Card horizontal para scroll de contas.

```
┌───────────────────────┐
│ [banco logo]  Nubank  │
│ Conta Corrente        │
│                       │
│ R$ 3.240,00           │
│ ●●●● 4521             │
└───────────────────────┘
```

**Props**: `account`, `onPress`, `compact`
**Width**: 160px (mobile compact), 200px (mobile full), auto (web)

---

### 5.5 AmountDisplay
Exibe valores monetários com formatação consistente.

```
R$ 1.234,56    (positivo — verde)
- R$ 567,89    (negativo — vermelho)
R$ 0,00        (zero — secundário)
```

**Props**: `amount`, `currency`, `size`, `showSign`, `colorCoded`
**Formatação**: Intl.NumberFormat com locale pt-BR

---

### 5.6 CategoryBadge
Chip com ícone e nome de categoria.

```
[🍔] Alimentação
```

**Props**: `category`, `size` (sm/md/lg), `variant` (filled/outlined/ghost)

---

### 5.7 EmptyState
Tela vazia com ilustração e CTA.

```
        [ilustração SVG]

    Nenhuma transação ainda
  Adicione sua primeira movimentação
        [+ Adicionar]
```

**Props**: `illustration`, `title`, `description`, `actionLabel`, `onAction`
**Variantes**: transactions, budgets, goals, notifications, search

---

### 5.8 FilterChip
Chip selecionável para filtros.

```
  Todos  ×Despesas  Receitas  Transfers
```

**Props**: `label`, `selected`, `onToggle`, `count`

---

### 5.9 SkeletonLoader
Placeholder animado para estados de carregamento.

**Variantes**: `card`, `list-item`, `chart`, `text`, `avatar`
**Animação**: shimmer (gradiente horizontal animado)

---

### 5.10 FAB (Floating Action Button)
Botão flutuante principal do mobile.

```
         ╔═══╗
         ║ + ║  ← 56px, shadow.lg, primary.500
         ╚═══╝
```

**Posição**: `bottom: 80px` (acima do bottom tab), `right: 16px`
**Expandido**: abre speed dial com opções (Receita / Despesa / Transferência / Recorrente)

---

## 6. ICONOGRAFIA

Sistema de ícones: **Lucide Icons** (web + React Native via `lucide-react-native`)

### Ícones por domínio
| Domínio       | Ícones principais                                          |
|---------------|------------------------------------------------------------|
| Navegação     | `home`, `list`, `pie-chart`, `target`, `user`             |
| Transações    | `arrow-up-right`, `arrow-down-left`, `arrow-left-right`   |
| Contas        | `landmark`, `piggy-bank`, `trending-up`, `wallet`         |
| Categorias    | `utensils`, `car`, `heart-pulse`, `book-open`, `shirt`    |
| Ações         | `plus`, `edit`, `trash-2`, `copy`, `filter`, `search`     |
| Feedback      | `check-circle`, `alert-triangle`, `x-circle`, `info`      |
| Finanças      | `dollar-sign`, `credit-card`, `receipt`, `bell`           |

**Tamanhos**: 16px (caption), 20px (body), 24px (nav), 28px (header), 32px (hero)

---

## 7. ANIMAÇÕES E TRANSIÇÕES

| Transição            | Duração | Easing          | Uso                          |
|----------------------|---------|-----------------|------------------------------|
| Navegação entre telas| 300ms   | `easeInOut`     | Push/pop de rotas            |
| Modal / Bottom sheet | 350ms   | `spring(0.7)`   | Entrada de modais            |
| Fade in              | 200ms   | `easeOut`       | Skeletons → conteúdo         |
| Micro-interação      | 150ms   | `easeOut`       | Tap feedback, toggles        |
| Progress bar         | 600ms   | `easeOut`       | Preenchimento animado        |
| Contador de valor    | 800ms   | `easeOut`       | Animação de números no dashboard |
| Swipe action         | 200ms   | `linear`        | Swipe em itens de lista      |

**Princípios**: Sem animações > 400ms em fluxos principais. Respeitar `prefers-reduced-motion`.

---

## 8. STATES DO SISTEMA

### Hierarquia de estados para componentes interativos
```
Default → Hover → Pressed → Focused → Disabled
```

| Estado    | Modificação visual                              |
|-----------|-------------------------------------------------|
| Hover     | `opacity: 0.85` ou `background +10% lightness` |
| Pressed   | `scale: 0.97` + `opacity: 0.9`                 |
| Focused   | `shadow.focus` (anel indigo 3px)               |
| Disabled  | `opacity: 0.4`, `cursor: not-allowed`          |
| Loading   | Spinner ou skeleton substituindo conteúdo      |
| Error     | Border `color.error.500` + mensagem abaixo     |
| Success   | Border `color.success.500` + check icon        |

---

## 9. DARK MODE

- Suporte completo ao dark mode via tokens semânticos
- Detecção automática via `prefers-color-scheme` + override manual em configurações
- Transição suave: `transition: background-color 200ms, color 200ms`
- Gráficos: opacidade reduzida para grades (`opacity: 0.15`), cores mais saturadas para dados

---

## 10. ACESSIBILIDADE

| Critério               | Implementação                                            |
|------------------------|----------------------------------------------------------|
| Contraste mínimo       | AA (4.5:1 texto normal, 3:1 texto grande)                |
| Áreas de toque         | Mínimo 44×44px em todos os elementos interativos         |
| Labels ARIA            | Todos os ícones com `aria-label` ou `accessibilityLabel` |
| Ordem de foco          | Lógica top→bottom, left→right                           |
| Screen readers         | Valores monetários pronunciados corretamente             |
| Redução de movimento   | `prefers-reduced-motion: reduce` → sem animações         |
| Zoom                   | Layout funcional até 200% de zoom                        |
| Cores não exclusivas   | Ícones + textos complementam diferenças de cor           |
