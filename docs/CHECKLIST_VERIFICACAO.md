> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# ✅ CHECKLIST DE VERIFICAÇÃO

## 📋 Antes de Começar

- [ ] Node.js 18+ instalado
  ```bash
  node --version  # Deve ser v18.0.0 ou superior
  ```

- [ ] npm 9+ instalado
  ```bash
  npm --version   # Deve ser 9.0.0 ou superior
  ```

- [ ] Projeto clonado/baixado
  ```bash
  cd financial-app
  ```

---

## 🔧 Configuração Inicial

- [ ] Dependências instaladas
  ```bash
  npm install
  ```

- [ ] `.env.local` existe na raiz
  ```bash
  ls .env.local  # Deve existir
  ```

- [ ] `.env.local` tem as chaves necessárias
  ```
  VITE_SUPABASE_URL=...
  VITE_SUPABASE_ANON_KEY=...
  VITE_GROQ_API_KEY=...
  VITE_USE_BACKEND=false
  ```

- [ ] Backend `.env` configurado (se usar backend)
  ```bash
  cd backend
  cp .env.example .env
  # Editar .env e adicionar GROQ_API_KEY
  ```

---

## 🚀 Iniciando o Projeto

### Opção 1: Frontend Apenas

- [ ] Executar comando
  ```bash
  npm run dev
  ```

- [ ] Verificar output
  ```
  ✓ built in X.XXs
  ➜  Local:   http://localhost:5173/
  ```

- [ ] Abrir navegador
  ```
  http://localhost:5173
  ```

- [ ] Verificar se carrega sem erros

### Opção 2: Frontend + Backend

- [ ] Terminal 1 - Backend
  ```bash
  cd backend
  npm install
  npm run dev
  ```

- [ ] Verificar output do backend
  ```
  ✅ Groq API Key configurada
  🚀 Servidor rodando em http://localhost:3000
  ```

- [ ] Terminal 2 - Frontend
  ```bash
  npm run dev
  ```

- [ ] Verificar output do frontend
  ```
  ✓ built in X.XXs
  ➜  Local:   http://localhost:5173/
  ```

---

## 🧪 Testando a Funcionalidade

### Teste 1: Página Carrega
- [ ] Abrir http://localhost:5173
- [ ] Página carrega sem erros
- [ ] Não há erros vermelhos no console (F12)

### Teste 2: Autenticação
- [ ] Fazer login com credenciais válidas
- [ ] Dashboard carrega
- [ ] Usuário autenticado

### Teste 3: Adicionar Transação
- [ ] Clicar em "+" ou "Adicionar Transação"
- [ ] Modal abre
- [ ] Preencher dados:
  - [ ] Tipo: Despesa
  - [ ] Valor: 50.00
  - [ ] Descrição: "Almoço no restaurante"
  - [ ] Categoria: (deixar em branco para testar IA)

### Teste 4: Sugestão de Categoria (IA)
- [ ] Após preencher descrição, aguardar 2-3 segundos
- [ ] Deve aparecer sugestão de categoria em azul
- [ ] Sugestão deve ser relevante (ex: "Alimentaç��o")
- [ ] Verificar console (F12) para logs:
  ```
  🤖 Chamando Groq API diretamente
  ✅ Resposta recebida do Groq
  ```

### Teste 5: Salvar Transação
- [ ] Clicar em "Salvar" ou "Confirmar"
- [ ] Transação aparece na lista
- [ ] Saldo da conta atualiza
- [ ] Sem erros no console

### Teste 6: Dashboard & Insights
- [ ] Ir para Dashboard
- [ ] Adicionar 3-4 transações diferentes
- [ ] Rolar para baixo
- [ ] Verificar seção "🤖 Insights de IA"
- [ ] Deve mostrar insights gerados
- [ ] Verificar console para logs de IA

### Teste 7: Notificações
- [ ] Clicar no ícone de sino (🔔) no header
- [ ] Painel de notificações abre
- [ ] Verificar abas: "Notificações" e "Configurações"
- [ ] Clicar em "Configurações"
- [ ] Ajustar preferências
- [ ] Clicar em "Salvar"
- [ ] Verificar se salva sem erros

---

## 🐛 Troubleshooting

### Erro: `ERR_CONNECTION_REFUSED`
- [ ] Verificar se `VITE_USE_BACKEND=false` em `.env.local`
- [ ] Se `true`, verificar se backend está rodando
- [ ] Recarregar página (F5)

### Erro: `Chave API não configurada`
- [ ] Verificar `.env.local`
- [ ] Adicionar `VITE_GROQ_API_KEY=...`
- [ ] Reiniciar dev server

### Erro: `401 Unauthorized`
- [ ] Verificar se chave Groq está correta
- [ ] Gerar nova chave em https://console.groq.com/keys
- [ ] Atualizar `.env.local`

### Sugestão de categoria não aparece
- [ ] Verificar console (F12) para erros
- [ ] Descriç��o deve ter 3+ caracteres
- [ ] Aguardar 2-3 segundos
- [ ] Tentar descrição mais clara

### Insights não aparecem
- [ ] Adicionar 3+ transações
- [ ] Aguardar cache expirar (1 hora)
- [ ] Recarregar página (F5)
- [ ] Limpar cache do navegador

### Notificações não aparecem
- [ ] Verificar se estão habilitadas em Configurações
- [ ] Verificar horário silencioso
- [ ] Adicionar transação que dispare notificação
- [ ] Verificar console para erros

---

## 📊 Verificação de Performance

- [ ] Página carrega em < 3 segundos
- [ ] Sugestão de categoria em < 2 segundos
- [ ] Insights gerados em < 5 segundos
- [ ] Sem lag ao adicionar transações
- [ ] Sem memory leaks (DevTools → Memory)

---

## 🔐 Verificação de Segurança

- [ ] Chaves de API não estão em commits
- [ ] `.env.local` está em `.gitignore`
- [ ] Não há logs sensíveis no console
- [ ] Supabase RLS está ativo
- [ ] Apenas usuário autenticado acessa dados

---

## 📱 Verificação de Responsividade

- [ ] Desktop (1920x1080) - OK
- [ ] Tablet (768x1024) - OK
- [ ] Mobile (375x667) - OK
- [ ] Sem overflow horizontal
- [ ] Botões clicáveis em mobile

---

## 🎯 Verificação Final

- [ ] Todas as funcionalidades testadas
- [ ] Sem erros no console
- [ ] Performance aceitável
- [ ] Responsividade OK
- [ ] Pronto para usar

---

## 📝 Notas

```
Data de teste: _______________
Testador: _______________
Ambiente: [ ] Dev [ ] Prod
Navegador: _______________
Versão Node: _______________

Observações:
_________________________________
_________________________________
_________________________________
```

---

## ✨ Próximos Passos

- [ ] Ler documentação completa (`SOLUCAO_CONNECTION_REFUSED.md`)
- [ ] Explorar todas as funcionalidades
- [ ] Customizar conforme necessário
- [ ] Fazer deploy em produção

---

**Checklist criado em:** Janeiro 2025  
**Status:** ✅ PRONTO PARA USO
