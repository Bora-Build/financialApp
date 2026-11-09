> **Especificação de produto — revisada em 09/11/2026.** Este documento descreve referências de interface, navegação ou modelo de dados; não comprova que todos os recursos estejam implementados ou habilitados na VPS. Para arquitetura e operação atuais, consulte o [índice](../docs/INDICE_DOCUMENTACAO.md) e o [estado validado](../docs/ESTADO_ATUAL.md).

# ESPECIFICAÇÕES DE TELAS — MOBILE

Viewport de referência: 390×844px (iPhone 14). Safe areas aplicadas.
Padding horizontal padrão: 16px. Bottom safe area: 34px (iOS) / 24px (Android).

---

## AUTENTICAÇÃO

---

### SPLASH SCREEN
**Duração**: 800ms → verifica sessão Supabase

```
┌─────────────────────────┐
│                         │
│                         │
│                         │
│      [Logo SVG]         │
│    FinanceApp           │
│                         │
│                         │
│  ────────────────────   │ ← progress bar animada (indigo)
└─────────────────────────┘
```

**Lógica pós-splash**:
- sessão válida + onboarding_done = true → Dashboard
- sessão válida + onboarding_done = false → Onboarding Setup
- sem sessão → Onboarding slides (1ª vez) ou Login

---

### ONBOARDING (4 slides)
**Navegação**: swipe horizontal ou botões. Pular disponível do slide 1 ao 3.

```
┌─────────────────────────┐
│              [Pular]    │
│                         │
│   [Ilustração SVG]      │  ← altura: 260px
│                         │
│  Controle Total         │  ← text.h1, center
│  das suas Finanças      │
│                         │
│  Acompanhe receitas,    │  ← text.body.lg, text.secondary
│  despesas e investi-    │
│  mentos em um só lugar  │
│                         │
│  ● ○ ○ ○               │  ← indicadores de página
│                         │
│  [──────────────────]   │  ← botão "Próximo" / "Começar"
└─────────────────────────┘
```

| Slide | Título               | Subtítulo                                    | Ilustração       |
|-------|----------------------|----------------------------------------------|------------------|
| 1     | Controle Total       | Acompanhe receitas, despesas, investimentos  | `onboard-1.svg`  |
| 2     | Planeje seu Futuro   | Crie orçamentos e mantenha o controle        | `onboard-2.svg`  |
| 3     | Alcance suas Metas   | Defina objetivos e acompanhe o progresso     | `onboard-3.svg`  |
| 4     | Inteligência Financeira | Insights automáticos sobre seus gastos   | `onboard-4.svg`  |

---

### LOGIN
```
┌─────────────────────────┐
│  ←                      │
│                         │
│  Bem-vindo de volta     │  ← text.h1
│  Entre na sua conta     │  ← text.body.lg, secondary
│                         │
│  ┌───────────────────┐  │
│  │ [✉] Email         │  │  ← input
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ [🔒] Senha    [👁]│  │  ← input + toggle visibilidade
│  └───────────────────┘  │
│                         │
│  Esqueci minha senha →  │  ← link, alinhado à direita
│                         │
│  [────── Entrar ──────] │  ← botão primário
│                         │
│  ──────── ou ────────── │
│                         │
│  [G] Entrar com Google  │  ← botão outline
│                         │
│  [☺] Usar biometria     │  ← só aparece se configurada
│                         │
│  Não tem conta?         │
│  Criar conta →          │
└─────────────────────────┘
```

**Validações**:
- Email: formato válido
- Senha: mínimo 6 caracteres
- Erro Supabase: exibir abaixo do campo correspondente

---

### CADASTRO
```
┌─────────────────────────┐
│  ← Criar conta          │
│                         │
│  ┌───────────────────┐  │
│  │ Nome completo     │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Email             │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Senha         [👁]│  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Confirmar senha   │  │
│  └───────────────────┘  │
│                         │
│  [✓] Aceito os Termos   │  ← checkbox + link
│                         │
│  [─── Criar conta ────] │
│                         │
│  Já tenho conta →       │
└─────────────────────────┘
```

---

### RECUPERAÇÃO DE SENHA
```
┌─────────────────────────┐
│  ← Recuperar senha      │
│                         │
│  [Ilustração email]     │
│                         │
│  Insira seu email e     │
│  enviaremos um link     │
│  para redefinir a senha │
│                         │
│  ┌───────────────────┐  │
│  │ Email             │  │
│  └───────────────────┘  │
│                         │
│  [─── Enviar link ────] │
│                         │
│  [Estado pós-envio:]    │
│  ✓ Email enviado!       │
│  Verifique sua caixa    │
└─────────────────────────┘
```

---

## ONBOARDING DE CONFIGURAÇÃO

---

### WELCOME
```
┌─────────────────────────┐
│                         │
│  [Avatar placeholder]   │  ← circle 80px, tap para upload foto
│  [+ Adicionar foto]     │
│                         │
│  Olá, Lucas!            │  ← nome do auth.users
│  Vamos configurar       │
│  sua conta              │
│                         │
│  Moeda: [BRL ▾]         │  ← select
│  Fuso:  [Brasília ▾]    │  ← select
│  Idioma:[Português ▾]   │  ← select
│                         │
│  [──── Continuar ─────] │
└─────────────────────────┘
```

---

### PRIMEIRA CONTA
```
┌─────────────────────────┐
│  Passo 2 de 5           │
│  ████░░░░░░ 40%         │
│                         │
│  Adicione sua conta     │
│  principal              │
│                         │
│  Nome da conta *        │
│  ┌───────────────────┐  │
│  │ Ex: Nubank        │  │
│  └───────────────────┘  │
│                         │
│  Tipo de conta          │
│  [Corrente] [Poupança]  │
│  [Invest.] [Carteira]   │  ← chips selecionáveis
│                         │
│  Banco                  │
│  ┌───────────────────┐  │
│  │ Buscar banco...   │  │
│  └───────────────────┘  │
│                         │
│  Saldo inicial          │
│  ┌───────────────────┐  │
│  │ R$ 0,00           │  │  ← teclado numérico ao focar
│  └───────────────────┘  │
│                         │
│  [──── Continuar ─────] │
│  Pular por agora        │
└─────────────────────────┘
```

---

## DASHBOARD

---

### DASHBOARD (tela principal)
```
┌─────────────────────────┐  ← safe area top
│ Bom dia, Lucas! 🌤     [🔔]3 │  ← saudação dinâmica + badge notif
│                         │
│  ╔═══════════════════╗  │
│  ║  Saldo Total      ║  │  ← card hero (bg primary, text white)
│  ║  R$ 12.450,00     ║  │  ← text.display
│  ║  ↑ R$ 1.200 este mês ║ │  ← trend
│  ║  [Fev 2026  ▾]    ║  │  ← seletor de período
│  ╚═══════════════════╝  │
│                         │
│  ┌──────────┐ ┌───────┐ │
│  │ Receitas │ │Despesas│ │  ← 2 cards lado a lado
│  │ ↑ R$5.000│ │↓R$3.800│ │
│  └──────────┘ └───────┘ │
│                         │
│  Evolução               │  ← section header
│  [Gráfico barras 6m]    │  ← altura 160px, pinch to zoom
│  Jan Fev Mar Abr Mai Jun│
│                         │
│  Minhas Contas          │  ← section header + "ver todas"
│  ← [AccountCard] [AccountCard] → │  ← scroll horizontal
│                         │
│  Últimas Transações     │  ← section header + "ver todas"
│  [TransactionItem]      │
│  [TransactionItem]      │
│  [TransactionItem]      │
│  [TransactionItem]      │
│  [TransactionItem]      │
│                         │
│  Alertas                │  ← só se houver alertas ativos
│  ⚠ Alimentação: 85%     │  ← chip de alerta clicável
│  🎯 Viagem: 3 meses     │
│                         │
└─────────────────────────┘
│  [🏠] [💰] [⊕] [📊] [👤] │  ← bottom tab
└─────────────────────────┘
```

**Dados carregados**:
- `vw_account_summary` → saldo total (soma das contas com `include_in_sum=true`)
- `vw_monthly_cash_flow` → receitas/despesas do mês + gráfico
- `fn_monthly_summary()` → resumo rápido
- `transactions` (LIMIT 5) → últimas transações
- `vw_budget_progress` (alert_level = 'alert' ou 'exceeded') → alertas

---

### LISTA DE NOTIFICAÇÕES
```
┌─────────────────────────┐
│  ← Notificações  [✓ todas]│
│                         │
│  Hoje                   │  ← section header data
│  ┌─────────────────────┐│
│  │[🎯] Meta atingida!  ││  ← unread: bg subtle + dot
│  │ Você atingiu "Viagem"││
│  │ há 2 minutos        ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │[⚠] Alerta orçamento ││  ← read: sem destaque
│  │ Alimentação: 85%    ││
│  │ há 3 horas          ││
│  └─────────────────────┘│
│                         │
│  Ontem                  │
│  [...]                  │
└─────────────────────────┘
```

---

## TRANSAÇÕES

---

### LISTA DE TRANSAÇÕES
```
┌─────────────────────────┐
│  Transações     [🔍][⚙] │  ← busca + filtros
│                         │
│  [Todos][Despesas][Receitas][Transf.] │  ← FilterChips
│                         │
│  [Jan][Fev][Mar]...     │  ← scroll horizontal de meses
│                         │
│  Hoje, 14 fev           │  ← section header
│  ╔═══════════════════╗  │
│  ║[🍔] Restaurante   ║  │
│  ║ Nubank  •  Alim.  ║  ← R$ -89,90 ║
│  ╚═══════════════════╝  │
│  ╔═══════════════════╗  │
│  ║[💼] Salário       ║  │
│  ║ Itaú  •  Renda    ║  ← R$ +5.000,00 ║
│  ╚═══════════════════╝  │
│                         │
│  Ontem, 13 fev          │
│  [...]                  │
│                         │
│  [Carregar mais...]     │  ← infinite scroll trigger
└─────────────────────────┘
│  [🏠] [💰] [⊕] [📊] [👤] │
└─────────────────────────┘
```

---

### FILTROS (Bottom Sheet)
```
╔═════════════════════════╗  ← sheet handle
║  Filtrar Transações     ║
║                         ║
║  Período                ║
║  [Personalizado ▾]      ║  ← date range picker
║  De: 01/01/26  Até: hoje║
║                         ║
║  Tipo                   ║
║  [✓Despesa][✓Receita]   ║
║  [✓Transferência]       ║
║                         ║
║  Categoria              ║
║  [Todas ▾]              ║
║                         ║
║  Conta                  ║
║  [Todas ▾]              ║
║                         ║
║  Status                 ║
║  [✓Concluído][Pendente] ║
║  [Agendado]             ║
║                         ║
║  Valor                  ║
║  De: R$ ____  Até: R$ __║
║                         ║
║  [Limpar]  [Aplicar]    ║
╚═════════════════════════╝
```

---

### ADICIONAR TRANSAÇÃO (Modal full-height)
```
╔═════════════════════════╗
║  [✕]  Nova Transação    ║
║                         ║
║  [Despesa][Receita][Tr.]║  ← type selector (pills)
║                         ║
║  R$ |0,00               ║  ← input de valor grande (text.display)
║                         ║  ← teclado numérico customizado
║  ─────────────────────  ║
║                         ║
║  Descrição              ║
║  ┌─────────────────────┐║
║  │ Ex: Almoço com amigos│║
║  └─────────────────────┘║
║                         ║
║  Data        Conta      ║
║  [14/02/26]  [Nubank ▾] ║
║                         ║
║  Categoria              ║
║  [🍔 Alimentação ▾]     ║
║                         ║
║  [+ Parcelado]          ║  ← expansível: mostra campos parcelas
║  [+ Recorrente]         ║  ← expansível: mostra campos recorrência
║  [+ Cartão de crédito]  ║
║  [+ Tags e notas]       ║
║  [+ Anexar comprovante] ║
║                         ║
║  [──── Salvar ─────]    ║
╚═════════════════════════╝
```

**Campo de valor**: teclado numérico custom com botões 0-9, vírgula, backspace. Animação de entrada do valor.

---

### DETALHE DA TRANSAÇÃO
```
┌─────────────────────────┐
│  ← Detalhes     [✏][🗑] │
│                         │
│  [cat.icon grande 48px] │  ← centralizado, cor da categoria
│  Restaurante            │  ← text.h2, center
│  Alimentação            │  ← badge categoria
│                         │
│  R$ 89,90               │  ← text.display, vermelho
│  14 de fevereiro, 2026  │
│                         │
│  ─────────────────────  │
│  Conta      Nubank CC   │
│  Status     Concluído ✓ │
│  Tags       jantar work │
│  Notas      —           │
│  Criado em  14/02 14:32 │
│                         │
│  [📎 comprovante.jpg]   │  ← se houver anexo
│                         │
│  [─── Duplicar ───────] │  ← botão secundário
└─────────────────────────┘
```

---

### LISTA DE RECORRENTES
```
┌─────────────────────────┐
│  ← Recorrentes    [+]   │
│                         │
│  Ativas                 │
│  ┌─────────────────────┐│
│  │[🏠] Aluguel         ││
│  │ Mensal • dia 5       ││
│  │ Próxima: 05/03/26    ││← R$ -1.800,00 ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │[💼] Salário         ││
│  │ Mensal • dia 25      ││
│  │ Próxima: 25/03/26    ││← R$ +5.000,00 ││
│  └─────────────────────┘│
│                         │
│  Pausadas               │
│  [...]                  │
└─────────────────────────┘
```

---

## ORÇAMENTOS

---

### LISTA DE ORÇAMENTOS
```
┌─────────────────────────┐
│  Orçamentos       [+]   │
│  Fevereiro 2026  [◀][▶] │  ← navegação de mês
│                         │
│  Resumo                 │
│  ┌─────────────────────┐│
│  │ Total orçado  R$3.000││
│  │ Gasto         R$2.100││
│  │ Disponível    R$  900││
│  │ ████████████░░ 70%  ││
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│  ← status: ok
│  │[🍔] Alimentação     ││
│  │ R$ 750 / R$ 1.000   ││
│  │ ████████████░  75%  ││
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│  ← status: alert (borda amber)
│  │[🚗] Transporte      ││
│  │ R$ 420 / R$ 500     ││
│  │ ██████████████ 84% ⚠││
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│  ← status: exceeded (borda red)
│  │[🎉] Lazer           ││
│  │ R$ 320 / R$ 300     ││
│  │ ████████████████107%██││
│  └─────────────────────┘│
└─────────────────────────┘
│  [🏠] [💰] [⊕] [📊] [👤] │
└─────────────────────────┘
```

---

### DETALHE DO ORÇAMENTO
```
┌─────────────────────────┐
│  ← Alimentação  [✏][🗑] │
│                         │
│  ╔═══════════════════╗  │
│  ║  R$ 750,00        ║  │  ← gasto
│  ║  de R$ 1.000,00   ║  │  ← total
│  ║  ████████████░ 75%║  │  ← barra grande
│  ║  Disponível: R$250║  │
│  ║  Alerta em: 80%   ║  │
│  ╚═══════════════════╝  │
│                         │
│  Histórico (6 meses)    │
│  [Gráfico barras]       │  ← comparativo
│                         │
│  Transações do mês      │
│  [TransactionItem]      │
│  [TransactionItem]      │
│  [TransactionItem]      │
│  [ver todas...]         │
└─────────────────────────┘
```

---

## METAS

---

### LISTA DE METAS
```
┌─────────────────────────┐
│  Metas Financeiras  [+] │
│                         │
│  Resumo                 │
│  Total guardado: R$8.500│
│  3 metas ativas         │
│                         │
│  ┌─────────────────────┐│  ← card meta
│  │[✈] Viagem Europa    ││
│  │ ●●●●●●●●●●○○ 68%   ││  ← progress circular no canto
│  │ R$ 6.800 / R$10.000 ││
│  │ Prazo: dez/2026     ││
│  │ Faltam 6 meses      ││
│  │ [+ Contribuir]      ││
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│
│  │[🏠] Entrada Apê     ││
│  │ ●●●●○○○○○○○○ 18%   ││
│  │ R$ 9.000 / R$50.000 ││
│  │ Sem prazo definido  ││
│  │ [+ Contribuir]      ││
│  └─────────────────────┘│
└─────────────────────────┘
│  [🏠] [💰] [⊕] [📊] [👤] │
└─────────────────────────┘
```

---

### DETALHE DA META
```
┌─────────────────────────┐
│  ← Viagem Europa  [✏][🗑]│
│                         │
│      [Progresso         │
│       circular 120px    │
│         68%  ]          │
│                         │
│  R$ 6.800,00            │  ← text.display, primary
│  de R$ 10.000,00        │
│  Faltam R$ 3.200,00     │
│                         │
│  ┌────────┐ ┌──────────┐│
│  │Prazo   │ │Restam    ││
│  │dez/2026│ │6 meses   ││
│  └────────┘ └──────────┘│
│  ┌────────┐ ┌──────────┐│
│  │Contrib.│ │Estimativa││
│  │R$533/mês│ │dez/2026  ││
│  └────────┘ └──────────┘│
│                         │
│  Conta vinculada        │
│  [🏦 Poupança Itaú]     │
│                         │
│  [── Contribuir ──────] │  ← botão primário
│  [── Simular ─────────] │  ← botão outline
└─────────────────────────┘
```

---

### CONTRIBUIR NA META (Bottom Sheet)
```
╔═════════════════════════╗
║  Contribuir para        ║
║  Viagem Europa          ║
║                         ║
║  Valor atual: R$ 6.800  ║
║  Falta: R$ 3.200        ║
║                         ║
║  Quanto deseja guardar? ║
║  R$ |___________        ║  ← input numérico
║                         ║
║  Sugestão: R$ 533,33    ║  ← baseado no prazo
║  [Usar sugestão]        ║
║                         ║
║  Data                   ║
║  [Hoje, 14/02/2026 ▾]  ║
║                         ║
║  [──── Confirmar ─────] ║
╚═════════════════════════╝
```

---

## PERFIL

---

### PERFIL PRINCIPAL
```
┌─────────────────────────┐
│  Perfil                 │
│                         │
│  [Avatar 72px]          │
│  Lucas Silva            │  ← text.h2
│  lucas@email.com        │  ← text.secondary
│  [Editar perfil →]      │
│                         │
│  ─── Financeiro ─────── │
│  [🏦] Minhas Contas  [>]│
│  [💳] Cartões        [>]│
│  [🏷] Categorias     [>]│
│                         │
│  ─── Configurações ──── │
│  [🔔] Notificações   [>]│
│  [🔒] Segurança      [>]│
│  [🌙] Tema escuro   [toggle]│
│                         │
│  ─── Dados ──────────── │
│  [📤] Exportar dados [>]│
│  [❓] Ajuda          [>]│
│  [📄] Termos         [>]│
│                         │
│  [Sair da conta]        │  ← vermelho, alinhado centro
│  v1.0.0                 │  ← caption, secondary
└─────────────────────────┘
│  [🏠] [💰] [⊕] [📊] [👤] │
└─────────────────────────┘
```

---

### GERENCIAR CONTAS
```
┌─────────────────────────┐
│  ← Contas          [+]  │
│                         │
│  Saldo total: R$15.240  │
│                         │
│  ┌─────────────────────┐│
│  │[color] Nubank CC    ││
│  │ Conta Corrente      ││
│  │ R$ 3.240,00     [>] ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │[color] Poupança Itaú││
│  │ Poupança            ││
│  │ R$ 12.000,00    [>] ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │[color] Nubank Invest││
│  │ Investimento        ││
│  │ R$ 0,00  (excluída) ││  ← include_in_sum = false
│  └─────────────────────┘│
└─────────────────────────┘
```

---

### CONFIGURAÇÕES DE SEGURANÇA
```
┌─────────────────────────┐
│  ← Segurança            │
│                         │
│  [🔒] Alterar senha  [>]│
│                         │
│  Biometria              │
│  Use Face ID / digital  │
│  para entrar            [toggle ON]│
│                         │
│  PIN de acesso          │
│  Rápido sem biometria   [toggle OFF]│
│                         │
│  Ocultar valores        │
│  Esconde saldos em      │
│  screenshots            [toggle ON]│
│                         │
│  Sessões ativas         │
│  [>] Ver dispositivos   │
└─────────────────────────┘
```
