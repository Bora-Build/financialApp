> **Especificação de produto — revisada em 09/11/2026.** Este documento descreve referências de interface, navegação ou modelo de dados; não comprova que todos os recursos estejam implementados ou habilitados na VPS. Para arquitetura e operação atuais, consulte o [índice](../docs/INDICE_DOCUMENTACAO.md) e o [estado validado](../docs/ESTADO_ATUAL.md).

# ESPECIFICAÇÕES DE TELAS — WEB

Breakpoints de referência:
- `sm`: 640px | `md`: 768px | `lg`: 1024px | `xl`: 1280px | `2xl`: 1536px
- Layout base projetado para 1280px (desktop padrão)

---

## LAYOUT GERAL

### Shell da Aplicação (todas as telas autenticadas)

```
┌──────────────────────────────────────────────────────────────┐  ← 100vh
│  SIDEBAR (240px fixo)  │  MAIN AREA (flex 1)                  │
│  ──────────────────────┼──────────────────────────────────── │
│  [Logo]                │  HEADER (64px)                       │
│                        │  [Breadcrumb]  [Busca] [🔔] [Avatar] │
│  Navegação             │  ──────────────────────────────────  │
│  ─────────────────     │                                      │
│  [🏠] Dashboard        │  CONTENT AREA                        │
│  [💰] Transações       │  (padding 24px, overflow-y: auto)    │
│  [📊] Orçamentos       │                                      │
│  [🎯] Metas            │                                      │
│  [📈] Relatórios       │  ← seção exclusiva web               │
│                        │                                      │
│  ─────────────────     │                                      │
│  Configurações         │                                      │
│  [👤] Perfil           │                                      │
│  [⚙] Preferências     │                                      │
│  [🚪] Sair             │                                      │
│                        │                                      │
│  ─────────────────     │                                      │
│  [Avatar + nome]       │                                      │
└──────────────────────────────────────────────────────────────┘
```

**Sidebar collapse** (≤1024px): reduz a 64px mostrando apenas ícones com tooltip. Abaixo de 768px: sidebar vira drawer off-canvas acionado por hamburguer.

---

## DASHBOARD WEB

```
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR  │  Dashboard                     Fev 2026  [◀][▶]  │
│           │  ──────────────────────────────────────────────  │
│           │                                                   │
│           │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐│
│           │  │ Saldo    │ │ Receitas │ │ Despesas │ │Invest ││
│           │  │ Total    │ │ este mês │ │ este mês │ │ total ││
│           │  │R$15.240  │ │ R$5.000  │ │ R$3.820  │ │R$8.000││
│           │  │ ↑ 8,3%  │ │ ↑ 5%    │ │ ↓ 2,1%  │ │↑ 12%  ││
│           │  └──────────┘ └──────────┘ └──────────┘ └──────┘│
│           │                                                   │
│           │  ┌─────────────────────────┐ ┌─────────────────┐ │
│           │  │  Fluxo de Caixa (12m)   │ │  Gastos por     │ │
│           │  │                         │ │  Categoria      │ │
│           │  │  [Gráfico linhas duplas] │ │  [Donut chart]  │ │
│           │  │  ▓ Receitas  ▒ Despesas │ │                 │ │
│           │  │  altura: 260px          │ │  altura: 260px  │ │
│           │  └─────────────────────────┘ └─────────────────┘ │
│           │                                                   │
│           │  ┌──────────────────────┐ ┌────────────────────┐ │
│           │  │  Contas              │ │  Orçamentos        │ │
│           │  │  ──────────────      │ │  ──────────────    │ │
│           │  │  [AccountCard]       │ │  [ProgressBar]     │ │
│           │  │  [AccountCard]       │ │  [ProgressBar]     │ │
│           │  │  [AccountCard]       │ │  [ProgressBar]     │ │
│           │  │  [+ Nova conta]      │ │  [ver todos]       │ │
│           │  └──────────────────────┘ └────────────────────┘ │
│           │                                                   │
│           │  Últimas Transações                [ver todas →]  │
│           │  ┌────────────────────────────────────────────┐  │
│           │  │ Data  Descrição     Categoria  Conta  Valor│  │
│           │  │ 14/02 Restaurante  Alimentação Nubank -R$89│  │
│           │  │ 14/02 Salário      Renda       Itaú  +R$5k │  │
│           │  │ 13/02 Uber         Transporte  Nubank -R$18│  │
│           │  │ 12/02 Streaming    Lazer       Nubank -R$45│  │
│           │  │ 11/02 Farmácia     Saúde       Nubank -R$67│  │
│           │  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Grid**: 4 colunas (KPI cards) | 2 colunas (gráficos) | 2 colunas (contas + orçamentos)
**Responsividade**:
- `xl`: 4 KPI cards em linha
- `lg`: 2+2 KPI cards
- `md`: 2+2 KPI cards, gráficos empilhados
- `sm`: 1 coluna completa

---

## TRANSAÇÕES WEB

```
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR  │  Transações                  [+ Nova transação]   │
│           │                                                   │
│           │  ┌─────────────────────────────────────────────┐ │
│           │  │ FILTROS RÁPIDOS                             │ │
│           │  │ [Todos][Despesas][Receitas][Transferências] │ │
│           │  │ Período: [01/02/26]─[28/02/26] [Aplicar]   │ │
│           │  │ Categoria: [Todas ▾]  Conta: [Todas ▾]     │ │
│           │  │                       [Limpar filtros]      │ │
│           │  └─────────────────────────────────────────────┘ │
│           │                                                   │
│           │  Resumo do período                                │
│           │  Receitas: R$5.000  Despesas: R$3.820  Saldo: +R$1.180│
│           │                                                   │
│           │  ┌─────────────────────────────────────────────┐ │
│           │  │ [✓]│ Data  │ Descrição    │ Cat. │ Conta│Valor│ │
│           │  │────┼───────┼──────────────┼──────┼──────┼─────│ │
│           │  │ ☐ │ 14/02 │ Restaurante  │ 🍔   │Nubank│-R$89│ │
│           │  │ ☐ │ 14/02 │ Salário      │ 💼   │Itaú  │+R$5k│ │
│           │  │ ☐ │ 13/02 │ Uber         │ 🚗   │Nubank│-R$18│ │
│           │  │ ...│       │              │      │      │     │ │
│           │  └─────────────────────────────────────────────┘ │
│           │  [◀ 1 2 3 ... 12 ▶]  Exibindo 1-25 de 284       │ │
│           │                                                   │
│           │  [Ações em lote — aparece ao selecionar:]         │
│           │  [3 selecionados]  [Deletar] [Exportar CSV]       │
└──────────────────────────────────────────────────────────────┘
```

**Tabela**:
- Ordenação por coluna (clique no header)
- Hover: linha destacada com fundo `bg.subtle`
- Click na linha: abre painel lateral de detalhes (slide-in 320px, não navega)
- Checkbox: seleção múltipla para ações em lote
- Paginação: 25 itens por página (configurável: 10/25/50/100)

**Painel lateral de detalhes** (ao clicar em uma transação):
```
                        ┌──────────────────────────┐
                        │ [✕]  Restaurante     [✏] │
                        │                          │
                        │  [🍔]  R$ -89,90         │
                        │  Alimentação             │
                        │                          │
                        │  ──────────────────────  │
                        │  Data      14/02/2026    │
                        │  Conta     Nubank CC     │
                        │  Status    Concluído     │
                        │  Tags      jantar        │
                        │  Notas     —             │
                        │                          │
                        │  [Duplicar] [Deletar]    │
                        └──────────────────────────┘
```

---

## ORÇAMENTOS WEB

```
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR  │  Orçamentos         Fev 2026 [◀][▶] [+ Criar]   │
│           │                                                   │
│           │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│           │  │ Total    │ │ Gasto    │ │ Disponível       │  │
│           │  │ orçado   │ │ total    │ │ restante         │  │
│           │  │ R$ 3.000 │ │ R$ 2.190 │ │ R$ 810 (27%)    │  │
│           │  └──────────┘ └──────────┘ └──────────────────┘  │
│           │                                                   │
│           │  ┌──────────────────────────────────────────────┐ │
│           │  │  Visão Geral (Gráfico horizontal de barras)  │ │
│           │  │                                              │ │
│           │  │  Alimentação ████████████████░░░░ 75%        │ │
│           │  │  Transporte  ██████████████████░ 84% ⚠       │ │
│           │  │  Lazer       ████████████████████ 107% ⛔    │ │
│           │  │  Saúde       █████░░░░░░░░░░░░░░░ 23%        │ │
│           │  │  Educação    █████████░░░░░░░░░░░ 45%        │ │
│           │  └──────────────────────────────────────────────┘ │
│           │                                                   │
│           │  ┌───────────────┐ ┌───────────────┐ ┌─────────┐  │
│           │  │ 🍔 Alimentação│ │ 🚗 Transporte │ │🎉 Lazer │  │
│           │  │ R$750 / R$1000│ │ R$420 / R$500 │ │R$320/300│  │
│           │  │ ████████  75%│ │ ██████████ 84%│ │████ 107%│  │
│           │  │ status: ok   │ │ status: alert │ │exceeded  │  │
│           │  │ [Ver detalhes]│ │ [Ver detalhes]│ │[Ver det.]│  │
│           │  └───────────────┘ └───────────────┘ └─────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Ao clicar em "Ver detalhes"**: abre modal com histórico 6 meses + tabela de transações do orçamento.

---

## METAS WEB

```
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR  │  Metas Financeiras                  [+ Nova meta] │
│           │                                                   │
│           │  Resumo                                           │
│           │  Guardado total: R$ 15.800  |  3 metas ativas    │
│           │                                                   │
│           │  ┌───────────────────────────────────────────┐   │
│           │  │ [✈] Viagem Europa     ████████████████░ 68%│  │
│           │  │ R$ 6.800 de R$ 10.000  |  Prazo: dez/2026  │  │
│           │  │ Faltam R$ 3.200  |  ~6 meses  | R$533/mês  │  │
│           │  │                    [Contribuir] [Detalhes]  │  │
│           │  └───────────────────────────────────────────┘   │
│           │                                                   │
│           │  ┌───────────────────────────────────────────┐   │
│           │  │ [🏠] Entrada Apartamento  ██░░░░░░░░░░ 18%│  │
│           │  │ R$ 9.000 de R$ 50.000  |  Sem prazo        │  │
│           │  │ Faltam R$ 41.000                           │  │
│           │  │                    [Contribuir] [Detalhes]  │  │
│           │  └───────────────────────────────────────────┘   │
│           │                                                   │
│           │  Metas concluídas                  [mostrar ▾]   │
│           │  [Fundo Emergência ✓ - mar/2025]                  │
└──────────────────────────────────────────────────────────────┘
```

---

## RELATÓRIOS WEB (exclusivo web)

```
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR  │  Relatórios                                       │
│           │                                                   │
│           │  [Fluxo de Caixa] [Por Categoria] [Por Conta]    │  ← abas
│           │  [Balanço Patrimonial] [Metas e Orçamentos]      │
│           │                                                   │
│           │  ═══ ABA: FLUXO DE CAIXA ═══════════════════════ │
│           │                                                   │
│           │  Período: [Jan 2025 ▾] a [Fev 2026 ▾]  [Aplicar]│
│           │                                                   │
│           │  ┌────────────────────────────────────────────┐  │
│           │  │  Gráfico de Áreas (Receita vs Despesa)     │  │
│           │  │  altura: 320px, interativo (hover + zoom)  │  │
│           │  └────────────────────────────────────────────┘  │
│           │                                                   │
│           │  ┌──────────────────────────────────────────────┐ │
│           │  │ Mês    │ Receitas │ Despesas │ Saldo │ % Poup │ │
│           │  │────────┼──────────┼──────────┼───────┼────────│ │
│           │  │ Fev/26 │ R$5.000  │ R$3.820  │+R$1.18│ 23,6% │ │
│           │  │ Jan/26 │ R$5.000  │ R$4.100  │+R$ 900│ 18,0% │ │
│           │  │ Dez/25 │ R$6.200  │ R$3.700  │+R$2.5k│ 40,3% │ │
│           │  │ ...    │          │          │       │        │ │
│           │  │ TOTAL  │ R$62.000 │ R$45.300 │+R$16.7│ 26,9% │ │
│           │  └──────────────────────────────────────────────┘ │
│           │                                                   │
│           │  [📊 Exportar CSV]  [📄 Exportar PDF]             │
└──────────────────────────────────────────────────────────────┘
```

---

### ABA: POR CATEGORIA

```
┌──────────────────────────────────────────────────────────────┐
│           │  ┌─────────────────────────────┐ ┌────────────┐  │
│           │  │  Donut Chart — Despesas     │ │ Ranking    │  │
│           │  │  por categoria              │ │ categorias │  │
│           │  │  (interativo, clique abre   │ │ 1 Aliment. │  │
│           │  │   drilldown da categoria)   │ │ 2 Moradia  │  │
│           │  │  altura: 300px              │ │ 3 Transp.  │  │
│           │  └─────────────────────────────┘ └────────────┘  │
│           │                                                   │
│           │  ┌──────────────────────────────────────────────┐ │
│           │  │Categoria│ Gasto  │ % Total │ Orçamento │ Rest.│ │
│           │  │Aliment. │R$1.200 │  31,4%  │ R$1.000  │ -200 │ │
│           │  │Moradia  │R$ 950  │  24,8%  │ R$1.200  │ +250 │ │
│           │  │Transp.  │R$ 680  │  17,8%  │ R$  500  │ -180 │ │
│           │  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## MODAIS WEB

### Modal: Nova Transação
```
┌─────────────────────────────────────────────────────────┐
│  Nova Transação                                      [✕] │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Tipo: [○ Despesa]  [○ Receita]  [○ Transferência]      │
│                                                         │
│  ┌─────────────────────────┐  ┌────────────────────────┐│
│  │ Valor *                 │  │ Data *                 ││
│  │ R$ 0,00                 │  │ 14/02/2026             ││
│  └─────────────────────────┘  └────────────────────────┘│
│                                                         │
│  ┌──────────────────────────────────────────────────────┐│
│  │ Descrição *                                          ││
│  │ Ex: Almoço no restaurante                           ││
│  └──────────────────────────────────────────────────────┘│
│                                                         │
│  ┌─────────────────────────┐  ┌────────────────────────┐│
│  │ Conta *          [▾]    │  │ Categoria        [▾]   ││
│  └─────────────────────────┘  └────────────────────────┘│
│                                                         │
│  [▸ Parcelamento]  [▸ Recorrência]  [▸ Detalhes extras] │  ← accordions
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                              [Cancelar]  [Salvar →]     │
└─────────────────────────────────────────────────────────┘
```

**Largura do modal**: 560px em desktop, 100vw em mobile. Backdrop com blur.

---

## RESPONSIVIDADE — TABELA DE COMPORTAMENTO

| Componente         | Desktop (≥1280px)        | Tablet (768-1279px)      | Mobile (<768px)        |
|--------------------|--------------------------|--------------------------|------------------------|
| Sidebar            | Fixa 240px               | Colapsada 64px (ícones)  | Drawer off-canvas      |
| KPI Cards          | 4 em linha               | 2+2                      | 1 coluna               |
| Gráficos dashboard | 2 colunas (60%/40%)      | 1 coluna                 | 1 coluna, altura menor |
| Tabela transações  | Todas as colunas         | Oculta "Conta"           | Lista simplificada     |
| Modais             | 560px centrado           | 80vw centrado            | Full screen            |
| Bottom sheet       | Não existe               | Não existe               | Slide up parcial       |
| Cards metas/orç.   | 3 por linha              | 2 por linha              | 1 por linha            |
| Painel detalhe     | Slide-in lateral 320px   | Modal 480px              | Tela completa          |
| Header             | 64px com busca expansiva | 64px, busca icone        | 56px, sem busca        |

---

## ESTADOS GLOBAIS WEB

### Loading
- KPI cards: skeleton 4 cards
- Gráficos: área cinza animada com shimmer
- Tabela: 5 linhas skeleton

### Empty States
```
         [Ilustração SVG vazia — 160px]

     Nenhuma transação encontrada
   Tente ajustar os filtros ou adicione
        sua primeira transação

   [+ Adicionar transação]
```

### Error State
```
         [Ícone de erro — 48px, vermelho]

   Falha ao carregar os dados
   Verifique sua conexão e tente novamente

   [↻ Tentar novamente]
```

### Toast Notifications
- Posição: `top-right`, 16px das bordas
- Duração: 3s (success/info), 5s (warning/error), manual dismiss para error crítico
- Stack: máximo 3 toasts simultâneos, mais antigos saem primeiro
- Variantes: `success` (verde), `error` (vermelho), `warning` (âmbar), `info` (azul)
