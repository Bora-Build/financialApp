> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# 🎨 Diagrama Visual da Solução

## Antes (Erro)

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Frontend React (http://localhost:5173)          │  │
│  │                                                   │  │
│  │  Usuário adiciona transação                       │  │
│  │         ↓                                         │  │
│  │  Tenta chamar IA para sugerir categoria          │  │
│  │         ↓                                         │  │
│  │  Faz requisição para http://localhost:3000       │  │
│  │         ↓                                         │  │
│  │  ❌ ERR_CONNECTION_REFUSED                        │  │
│  │  (Backend não está rodando!)                      │  │
│  │         ↓                                         │  │
│  │  Erro no console, sem sugestão                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

❌ Resultado: Aplicação quebrada
```

---

## Depois (Solução 1: API Direta)

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Frontend React (http://localhost:5173)          │  │
│  │                                                   │  │
│  │  Usuário adiciona transação                       │  │
│  │         ↓                                         │  │
│  │  Tenta chamar IA para sugerir categoria          │  │
│  │         ↓                                         ���  │
│  │  Verifica: VITE_USE_BACKEND = false              │  │
│  │         ↓                                         │  │
│  │  Chama API Groq diretamente                      │  │
│  │  (https://api.groq.com/...)                      │  │
│  │         ↓                                         │  │
│  │  ✅ Resposta recebida                            │  │
│  │         ↓                                         │  │
│  │  Mostra sugestão de categoria                    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↓
                    INTERNET
                         ↓
            ┌─────────────────────────┐
            │   Groq API              │
            │ (api.groq.com)          │
            │                         │
            │ Processa requisição     │
            │ Retorna sugestão        │
            └─────────────────────────┘

✅ Resultado: Funciona perfeitamente!
```

---

## Depois (Solução 2: Backend Proxy)

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Frontend React (http://localhost:5173)          │  │
│  │                                                   │  │
│  │  Usuário adiciona transação                       │  │
│  │         ↓                                         │  │
│  │  Tenta chamar IA para sugerir categoria          │  │
│  │         ↓                                         │  │
│  │  Verifica: VITE_USE_BACKEND = true               │  │
│  │         ↓                                         │  │
│  │  Chama Backend local                             │  │
│  │  (http://localhost:3000/api/ai/generate)         │  │
│  │         ↓                                         │  │
│  │  ✅ Resposta recebida                            │  │
│  │         ���                                         │  │
│  │  Mostra sugestão de categoria                    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↓
                    LOCALHOST
                         ↓
            ┌─────────────────────────┐
            │   Backend Node.js       │
            │ (http://localhost:3000) │
            │                         │
            │ Recebe requisição       │
            │         ↓               │
            │ Faz proxy para Groq     │
            │         ↓               │
            │ Retorna resposta        │
            └────────────┬────────────┘
                         ↓
                    INTERNET
                         ↓
            ┌─────────────────────────┐
            │   Groq API              │
            │ (api.groq.com)          │
            │                         │
            │ Processa requisição     │
            │ Retorna sugestão        │
            └─────────────────────────┘

✅ Resultado: Funciona com segurança!
```

---

## Comparação Visual

### Opção 1: API Direta (Desenvolvimento)
```
Frontend ──→ Groq API
  ✅ Rápido
  ✅ Simples
  ⚠️  Chave exposta
```

### Opção 2: Backend Proxy (Produção)
```
Frontend ──→ Backend ──→ Groq API
  ✅ Seguro
  ✅ Escalável
  ⚠️  Mais complexo
```

---

## Fluxo de Decisão

```
                    ┌─────────────────┐
                    │  Iniciar App    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Ler .env.local  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────────────┐
                    │ VITE_USE_BACKEND = ?    │
                    └────────┬────────────────┘
                             │
                ┌────────────┴────────────────┐
                │                             │
           ┌────▼─────┐              ┌────────▼────┐
           │   false  │              │    true     │
           └────┬─────┘              └────────┬────┘
                │                             │
        ┌───────▼────────┐          ┌─────────▼──────────┐
        │ Chamar Groq    │          │ Chamar Backend     │
        │ API Diretamente│          │ (localhost:3000)   │
        └───────┬────────┘          └─────────┬──────────┘
                │                             │
        ┌───────▼────────┐          ┌─────────▼──────────┐
        │ ✅ Funciona    │          │ Backend faz proxy  │
        │ Rápido         │          │ para Groq API      │
        │ Simples        │          └─────────┬──────────┘
        └────────────────┘                    │
                                      ┌───────▼────────┐
                                      │ ✅ Funciona    │
                                      │ Seguro         │
                                      │ Escalável      │
                                      └────────────────┘
```

---

## Mudanças no Código

### Antes
```typescript
// Sempre tentava backend
const response = await fetch('http://localhost:3000/api/ai/generate')
// ❌ Erro se backend não estiver rodando
```

### Depois
```typescript
// Verifica configuração
if (USE_BACKEND) {
  // Usar backend
  const response = await fetch('http://localhost:3000/api/ai/generate')
} else {
  // Usar API diretamente
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions')
}
// ✅ Funciona em ambos os casos
```

---

## Timeline de Execução

### Opção 1: API Direta
```
T=0ms   → Usuário clica em "Adicionar Transação"
T=100ms → Frontend prepara requisição
T=150ms → Envia para Groq API
T=500ms → Groq processa
T=800ms → Resposta retorna
T=850ms → Sugestão exibida
```

### Opção 2: Backend Proxy
```
T=0ms   → Usuário clica em "Adicionar Transação"
T=100ms → Frontend prepara requisição
T=150ms → Envia para Backend local
T=200ms → Backend recebe
T=250ms → Backend envia para Groq API
T=500ms → Groq processa
T=800ms → Resposta retorna ao Backend
T=850ms → Backend retorna ao Frontend
T=900ms → Sugestão exibida
```

**Diferença:** ~50ms (imperceptível para usuário)

---

## Arquivos Modificados

```
financial-app/
├── src/
│   └── services/ai/
│       └── groq.ts ✏️ MODIFICADO
│           ├── Adicionado suporte API direta
│           ├── Adicionado flag USE_BACKEND
│           └── Melhorado tratamento de erros
│
├── .env.local ✏️ MODIFICADO
│   ├── Adicionado VITE_USE_BACKEND=false
│   └── Adicionado VITE_BACKEND_URL
│
├── SOLUCAO_CONNECTION_REFUSED.md ✨ NOVO
├── PROBLEMA_RESOLVIDO.md ✨ NOVO
├── GUIA_RAPIDO.md ✨ NOVO
├── DIAGRAMA_VISUAL.md ✨ NOVO (este arquivo)
├── start.bat ✨ NOVO
└── start.sh ✨ NOVO
```

---

## Resumo da Solução

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Funcionamento** | ❌ Quebrado | ✅ Funciona |
| **Flexibilidade** | ❌ Apenas backend | ✅ 3 opções |
| **Documentação** | ❌ Nenhuma | ✅ Completa |
| **Setup** | ❌ Complexo | ✅ Simples |
| **Desenvolvimento** | ❌ Difícil | ✅ Fácil |

---

**Visualização criada em:** Janeiro 2025  
**Status:** ✅ COMPLETO
