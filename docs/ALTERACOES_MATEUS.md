> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# 📌 ALTERAÇÕES MATEUS

## 🎯 Objetivo do Documento

Registrar as principais alterações realizadas no projeto **SelfMoney / FinancialApp** durante esta sessão de trabalho.

Este documento serve como histórico técnico e funcional das melhorias aplicadas em:

- Deploy e funcionamento na KingHost
- PWA e experiência mobile
- Dark mode
- Face ID / Passkey
- Sincronização e atualização de dados
- Pull-to-refresh
- Correções visuais e responsividade
- Ajustes específicos para iOS/PWA

---

## 📋 Resumo Geral

| Área | Status | Observação |
|------|--------|------------|
| Aplicação local | ✅ Funcionando | Vite em `http://127.0.0.1:5173` |
| KingHost | ✅ Funcionando | Aplicação publicada em `/financialApp` |
| PWA | ✅ Implementada | Manifest, service worker e instalação |
| Tema claro/escuro | ✅ Implementado | Com alternância e ajustes visuais |
| Face ID / Passkey | ✅ Implementado | Login e bloqueio do app |
| Atualização entre dispositivos | ✅ Melhorada | Polling inteligente |
| Pull-to-refresh | ✅ Implementado | Atualização manual por gesto |
| iOS/PWA zoom em campos | ✅ Ajustado | Campos em 16px + reset de viewport |

---

## 🚀 Deploy e KingHost

### ✅ Problema Inicial

A aplicação estava acessível localmente, mas na KingHost retornava:

```text
404 Not Found
nginx
```

### ✅ Correções Aplicadas

- Validado caminho físico da aplicação:

```text
/home/anacron/apps_nodejs/financialApp/
```

- Ajustado build para uso no path:

```text
/financialApp
```

- Validado funcionamento do Node.js via PM2.
- Confirmado que o frontend precisava ser servido a partir de `public/`.
- Build específico da KingHost passou a ser usado:

```bash
npm run build:kinghost
```

### ✅ Resultado

Aplicação publicada e acessível:

```text
https://anacron.com.br/financialApp/
```

---

## 🗄️ Banco de Dados

### ✅ Validações Realizadas

Foram validadas credenciais MySQL da KingHost:

```text
Servidor: mysql49-farm1.kinghost.net
Banco identificado: anacron03
```

### ✅ Resultado

O backend local e produção foram validados com conexão ao banco.

Endpoint local de saúde usado:

```text
/health/db
```

Retorno esperado:

```json
{
  "ok": true,
  "db": "up"
}
```

---

## 📱 PWA / Mobile-first

### ✅ Implementações

- Configuração PWA com manifest.
- Ícones PWA.
- Service worker.
- Cache seguro para assets estáticos.
- API configurada para não cachear dados financeiros sensíveis.
- Melhorias mobile-first nas principais telas.
- Bottom navigation / navegação mobile.
- Ajustes para instalação no iOS/Android.

### ✅ Cuidados Aplicados

- Não cachear dados financeiros.
- Não cachear tokens, saldos, extratos ou relatórios.
- Chamadas `/api` com estratégia segura.

---

## 🔐 Face ID / Passkey

### ✅ Implementações

- Login com Face ID / Passkey.
- Cadastro de passkey por dispositivo.
- Bloqueio do app com Face ID.
- Configuração de tempo de bloqueio.
- Opção no perfil:

```text
Bloquear app com Face ID
```

### ✅ Observação

O app não acessa biometria diretamente. A autenticação usa WebAuthn/Passkey, e o iOS decide se usa Face ID, Touch ID ou senha do aparelho.

---

## 🌗 Tema Claro / Escuro

### ✅ Implementações

- Tema claro/escuro no app.
- Persistência da preferência no dispositivo.
- Botão de alternância no header.
- Botão de alternância também na tela de login.

### ✅ Tela de Login

Foi refinado o dark mode da tela de login:

- Fundo escuro mais consistente.
- Painel menos “chapado”.
- Inputs com melhor contraste.
- Botão Google adaptado ao dark mode.
- Links mais legíveis.
- Imagem com overlay ajustado.

### ✅ Cards Ajustados para Dark Mode

- Card `Insights Financeiros`.
- Card `Segurança de acesso`.

---

## 🎨 Paleta de Cores de Contas/Metas

### ❌ Problema

As opções de cores em contas/metas pareciam todas roxas, gerando confusão visual.

### ✅ Correção

Criada paleta compartilhada com cores distintas:

```text
Roxo, Azul, Ciano, Verde, Laranja, Vermelho, Rosa, Cinza
```

### ✅ Arquivos Criados/Alterados

```text
src/constants/entityColors.ts
src/components/ui/ColorPicker.tsx
src/features/accounts/AccountListScreen.tsx
src/features/onboarding/OnboardingWizard.tsx
src/features/goals/GoalListScreen.tsx
```

---

## 🔄 Atualização Mais Rápida de Dados

### ❌ Problema

Contas, saldos e transações demoravam para aparecer/remover em todas as telas, especialmente no PWA.

### ✅ Melhorias Aplicadas

- Redução de cache das queries financeiras.
- `staleTime` ajustado para dados financeiros.
- Refetch ao voltar para o app.
- Refetch ao reconectar.
- Uso de `_ts` em leituras para evitar resposta antiga.
- Sincronização central de queries financeiras.

### ✅ Arquivo Criado

```text
src/hooks/api/financialSync.ts
```

### ✅ Queries Sincronizadas

```text
accounts
dashboard
transactions
budgets
goals
```

---

## 🌐 Atualização Entre Dispositivos

### 🔎 Teste SSE na KingHost

Foi testada uma rota SSE temporária na KingHost.

### Resultado do Teste

A conexão ficou aberta por cerca de 80 segundos, mas os eventos foram entregues juntos no final.

### Conclusão

SSE não é confiável na KingHost por causa de buffering no proxy/Nginx.

### ✅ Solução Implementada

Foi implementado **polling inteligente**.

---

## ⏱️ Polling Inteligente

### ✅ Como Funciona

O app consulta periodicamente um endpoint leve:

```text
/api/sync/version
```

Se a versão mudou, o app sincroniza os dados financeiros.

### ✅ Comportamento

| Situação | Comportamento |
|----------|---------------|
| App aberto | Verifica a cada 10 segundos |
| App em segundo plano | Pausa |
| App volta ao foco | Verifica quase imediatamente |
| Outro dispositivo altera dados | Atualiza em até cerca de 10 segundos |
| Mesmo dispositivo altera dados | Atualiza imediatamente após ação |

### ✅ Arquivos Criados/Alterados

```text
backend/routes/sync.js
FinancialApp.js
src/services/sync.ts
src/hooks/api/useFinancialPollingSync.ts
src/App.tsx
```

---

## 👇 Pull-to-refresh

### ✅ Implementação

Foi implementado gesto de puxar a tela para baixo para atualizar dados.

### ✅ Textos do Feedback

```text
Puxe para atualizar
Solte para atualizar
Atualizando...
```

### ✅ Comportamento

- Funciona nas telas autenticadas.
- Não recarrega a página.
- Atualiza dados financeiros via React Query.
- Não afeta a tela de login.
- Estado `Atualizando...` permanece visível por pelo menos `600ms`.

### ✅ Arquivos Criados/Alterados

```text
src/components/layout/PullToRefresh.tsx
src/components/layout/AppLayout.tsx
```

---

## 📲 Correção de Zoom no iOS/PWA

### ❌ Problema

Ao tocar em campos no iPhone/PWA, o Safari podia aplicar zoom e não voltar corretamente ao normal após fechar o teclado.

### ✅ Camada 1: Campos em 16px

Campos digitáveis foram ajustados para `16px`, reduzindo a chance do iOS aplicar zoom automático.

### ✅ Camada 2: Reset de Viewport

Foi criado um reset conservador para iOS/PWA:

- escuta `focusout`;
- aguarda o teclado fechar;
- estabiliza viewport e scroll;
- não recarrega a página;
- não bloqueia zoom manual.

### ✅ Arquivos Criados/Alterados

```text
src/hooks/useIOSViewportReset.ts
src/App.tsx
src/components/ui/Input.tsx
src/components/ui/Select.tsx
```

Também foram ajustados campos manuais em telas de:

```text
Login
Cadastro
Recuperação de senha
Transações
Metas
Perfil
```

---

## 🏷️ Categorias de Transações

### ✅ Novas Categorias

Foram adicionadas novas categorias padrão ao sistema:

| Categoria | Tipo | Uso |
|----------|------|-----|
| Pagamento de Contas | Despesa | Gastos com boletos, contas e pagamentos recorrentes |
| PIX | Receita e Despesa | Entradas e saídas realizadas via PIX |

### ✅ Regra de Negócio Preservada

A categoria `PIX` fica disponível tanto em receitas quanto em despesas, mas os valores não são somados juntos.

A separação financeira continua sendo feita pelo tipo da transação:

```text
income  = receita
expense = despesa
transfer = transferência
```

### ✅ Arquivos Alterados

```text
backend/routes/categories.js
database/schema.sql
```

---

## 🧪 Validações Executadas

Durante as alterações, foram executadas validações como:

```bash
npm.cmd run type-check
npm.cmd run lint
npm.cmd run build
npm.cmd run build:kinghost
node --check FinancialApp.js
node --check backend/routes/sync.js
```

### ✅ Resultado Geral

As validações passaram antes das publicações realizadas.

---

## 📦 Publicações Realizadas na KingHost

### ✅ Publicações Somente Frontend

Foram publicadas alterações visuais e PWA via:

```text
public/
```

### ✅ Publicações com Backend

Para o polling inteligente, também foram publicados:

```text
FinancialApp.js
backend/routes/sync.js
```

E o PM2 foi reiniciado.

---

## 🧭 Situação Atual

```text
✅ Aplicação funcionando localmente
✅ Aplicação funcionando na KingHost
✅ PWA disponível
✅ Dark mode ajustado
✅ Login com Passkey/Face ID disponível
✅ Pull-to-refresh disponível
✅ Polling inteligente ativo
✅ Correções de viewport iOS/PWA publicadas
```

---

## 🔮 Próximos Passos Recomendados

- Testar o zoom/viewport no iPhone em múltiplos formulários.
- Testar pull-to-refresh em PWA iOS e Android.
- Monitorar se o polling de 10 segundos está adequado.
- Futuramente criar uma tabela própria de versionamento de sync para reduzir custo no banco.
- Avaliar WebSocket apenas se a hospedagem permitir conexão sem buffering.

---

## ✅ Conclusão

O projeto evoluiu de uma aplicação web hospedada com problemas de acesso para uma experiência mais próxima de app mobile/PWA:

- mais responsiva;
- mais segura;
- com tema claro/escuro;
- com Face ID / Passkey;
- com sincronização entre dispositivos;
- com pull-to-refresh;
- com ajustes específicos para iOS.

Este documento consolida as principais alterações realizadas para referência futura.
