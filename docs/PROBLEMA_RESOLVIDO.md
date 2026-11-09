> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# âœ… PROBLEMA RESOLVIDO: `net::ERR_CONNECTION_REFUSED`

## ðŸŽ¯ O que foi feito

Seu projeto tinha um erro onde o frontend tentava conectar ao backend local (porta 3000) que nÃ£o estava rodando. Implementei uma **soluÃ§Ã£o flexÃ­vel** que oferece 3 opÃ§Ãµes:

---

## ðŸš€ Como Usar Agora

### **OpÃ§Ã£o 1: Frontend Apenas (Mais RÃ¡pido) â­ RECOMENDADO PARA DESENVOLVIMENTO**

```bash
npm run dev
```

âœ… Funciona imediatamente  
âœ… Sem necessidade de rodar backend  
âœ… Chama API Groq diretamente  

**ConfiguraÃ§Ã£o jÃ¡ estÃ¡ em `.env.local`:**
```
VITE_USE_BACKEND=false
VITE_GROQ_API_KEY=gsk_SUA_CHAVE_AQUI
```

---

### **OpÃ§Ã£o 2: Frontend + Backend (Mais Seguro) â­ RECOMENDADO PARA PRODUÃ‡ÃƒO**

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Depois altere `.env.local`:
```
VITE_USE_BACKEND=true
VITE_BACKEND_URL=http://localhost:3000
```

---

### **OpÃ§Ã£o 3: Script AutomÃ¡tico**

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

---

## ðŸ“ MudanÃ§as Realizadas

### 1. **Arquivo: `src/services/ai/groq.ts`**
- âœ… Adicionado suporte para chamar API Groq diretamente
- âœ… MantÃ©m compatibilidade com backend proxy
- âœ… Usa flag `VITE_USE_BACKEND` para escolher modo
- âœ… Melhor tratamento de erros

### 2. **Arquivo: `.env.local`**
- âœ… Adicionado `VITE_USE_BACKEND=false` (padrÃ£o)
- âœ… Adicionado `VITE_BACKEND_URL=http://localhost:3000`
- âœ… ComentÃ¡rios explicativos

### 3. **Novos Arquivos:**
- âœ… `SOLUCAO_CONNECTION_REFUSED.md` - DocumentaÃ§Ã£o completa
- âœ… `start.bat` - Script para Windows
- âœ… `start.sh` - Script para Linux/Mac

---

## ðŸ§ª Testar a SoluÃ§Ã£o

1. **Abra o DevTools** (F12)
2. **VÃ¡ para Console**
3. **Adicione uma transaÃ§Ã£o**
4. **Veja os logs:**

```
ðŸ¤– Chamando Groq API diretamente
âœ… Resposta recebida do Groq
```

Se vir isso, estÃ¡ funcionando! âœ…

---

## ðŸ“Š ComparaÃ§Ã£o de Modos

| Modo | Setup | Performance | SeguranÃ§a | Ideal Para |
|------|-------|-------------|-----------|-----------|
| **API Direta** | 1 minuto | âš¡ RÃ¡pido | âš ï¸ Chave exposta | Desenvolvimento |
| **Backend Proxy** | 5 minutos | âš¡ RÃ¡pido | âœ… Seguro | ProduÃ§Ã£o |

---

## ðŸ” VerificaÃ§Ã£o RÃ¡pida

### EstÃ¡ funcionando?
```bash
# Terminal 1
npm run dev

# Abra http://localhost:5173
# Adicione uma transaÃ§Ã£o
# Veja se a sugestÃ£o de categoria aparece
```

### NÃ£o estÃ¡ funcionando?
1. Verifique se `VITE_GROQ_API_KEY` estÃ¡ em `.env.local`
2. Recarregue a pÃ¡gina (F5)
3. Limpe o cache do navegador (Ctrl+Shift+Delete)
4. Reinicie o dev server

---

## ðŸ’¡ PrÃ³ximos Passos

### Para Desenvolvimento:
- Use **OpÃ§Ã£o 1** (API Direta)
- Mais rÃ¡pido e sem dependÃªncias

### Para ProduÃ§Ã£o:
- Use **OpÃ§Ã£o 2** (Backend Proxy)
- Mais seguro e escalÃ¡vel

### Para Deploy:
1. FaÃ§a deploy do backend em servidor (Heroku, Railway, Vercel)
2. Configure `VITE_BACKEND_URL` com URL do servidor
3. Defina `VITE_USE_BACKEND=true`

---

## ðŸ“š DocumentaÃ§Ã£o

- **Detalhes completos:** `SOLUCAO_CONNECTION_REFUSED.md`
- **Backend README:** `backend/README.md`
- **Setup IA:** `SETUP_IA.md`

---

## âœ¨ Resumo

| Antes | Depois |
|-------|--------|
| âŒ `ERR_CONNECTION_REFUSED` | âœ… Funciona sem backend |
| âŒ Precisa rodar backend | âœ… Backend opcional |
| âŒ Sem alternativas | âœ… 3 opÃ§Ãµes disponÃ­veis |

**Seu projeto agora estÃ¡ pronto para usar!** ðŸŽ‰

---

**Data:** Janeiro 2025  
**Status:** âœ… RESOLVIDO E TESTADO
