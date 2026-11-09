> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# 🚀 Guia de Setup - ETAPA 5 IA

## 📋 Pré-requisitos

- Node.js 18+
- npm 9+
- Conta Google (para API Gemini)
- Visual Studio Code (recomendado)

## 🔑 1. Obter Chave da API Gemini

### Passo 1: Acessar AI Studio do Google
1. Vá para https://ai.google.dev/
2. Clique em **"Get API Key"**
3. Selecione ou crie um projeto Google Cloud

### Passo 2: Criar Chave da API
```
Google AI Studio → Get API Key → Create API Key
```

### Passo 3: Copiar a Chave
A chave será algo como:
```
AIzaSyD-...sua_chave_secreta...
```

## 🔐 2. Configurar Variáveis de Ambiente

### Abrir ou Criar `.env.local`

Na raiz do projeto (`financial-app/`):

```bash
# Gemini API Configuration
VITE_GEMINI_API_KEY=AIzaSyD-...sua_chave_aqui...

# AI Settings (opcionais, têm defaults)
VITE_AI_PROVIDER=gemini
VITE_AI_CONFIDENCE_THRESHOLD=70
VITE_AI_CACHE_TTL=3600

# Supabase (já configurado, mas repetindo)
VITE_SUPABASE_URL=https://mzxudichuxfhjsjgulwg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...seu_anon_key...
```

## ✅ 3. Verificar Configuração

### Verificar Build
```bash
npm run build
```

Deve compilar sem erros com output:
```
✓ built in 7.01s
```

### Verificar Type-Check
```bash
npm run type-check
```

Deve retornar sem mensagens de erro.

## 🎯 4. Testar Funcionamento

### Iniciar Dev Server
```bash
npm run dev
```

Acesso em: http://localhost:5173

### Testar Categorização

1. **Na tela de "Nova Transação":**
   - Clique em "+" no Dashboard ou em botão de adicionar
   - Preencha o tipo (Despesa, Receita, etc)
   - Digite valor
   - **Digite uma descrição** (ex: "Almoço na pizzaria")
   - Observe a **sugestão de categoria em azul**
   - Clique "Aceitar" para usar a sugestão

2. **Mensagens no Console (F12):**
   ```
   ✓ Transação adicionada!
   ```

### Testar Insights

1. **No Dashboard:**
   - Adicione 3-4 transações diferentes
   - Vá para "Dashboard" (home)
   - Role para baixo até "🤖 Insights de IA"
   - Deve ver:
     - Despesa Média Mensal
     - Insights principais
     - Anomalias detectadas

## 🧪 Cenários de Teste

### Teste 1: Merchant Conhecido
```
Descrição: "Carrefour"
Esperado: 🏪 Conhecida | alimentacao | 95% confiança
```

### Teste 2: Padrão Local
```
Descrição: "Restaurante Mineirão"
Esperado: 📊 Padrão | alimentacao | 75% confiança
```

### Teste 3: Gemini AI
```
Descrição: "Transferência para consultório médico"
Esperado: 🤖 AI | saude | 80% confiança
```

### Teste 4: Sem Confiança
```
Descrição: "Aleatório xyz 123"
Esperado: 📊 Padrão | outro | 20% confiança (fallback)
```

## 📊 Verificar Dados Enviados à API

### Prompt Gemini Típico
```
Transaction Description: "Almoço no restaurante"
Amount: R$ 45.90
Available Categories: alimentacao, transporte, saude, ...

Responder ONLY com JSON:
{
  "category": "alimentacao",
  "confidence": 88,
  "reasoning": "Descrição clara de estabelecimento de alimentação"
}
```

### O Que NÃO é Enviado
- ❌ Nada de dados pessoais
- ❌ IDs de transação
- ❌ Outras transações do usuário
- ❌ Dados de conta bancária

## 🐛 Troubleshooting

### Erro: "API key not configured"
```
Solução:
1. Verificar .env.local existe
2. Verificar VITE_GEMINI_API_KEY tem valor
3. Reiniciar dev server (npm run dev)
```

### Erro: "Invalid API Key"
```
Solução:
1. Gerar nova chave em https://ai.google.dev/
2. Verificar se não há espaços extras
3. Verificar formato: "AIzaSy..." ou "AIza..."
```

### Sugestão não aparece
```
1. Verificar se descrição tem 3+ caracteres
2. Verificar console (F12) para erros
3. Tentar descrição mais clara
4. Se API falhar, fallback para padrões locais
```

### Build falha
```
Executar:
npm install
npm run type-check
npm run build

Se ainda falhar:
rm -rf node_modules
npm install
npm run build
```

## 📈 Monitoramento

### Ver Logs de Categorização
```
Chrome DevTools → Console
Procurar por: "Error categorizing", "Gemini API error", etc
```

### Estatísticas de Uso
```
No código (useCategorizationReport):
categorizationService.getConfidenceReport()
// Retorna: { totalCategorized, averageConfidence, sourceBreakdown }
```

### Cache Status
```
Chrome → DevTools → Application → Local Storage
Procurar por chaves começando com "gemini_"
```

## 🔄 Atualizar Chave da API

### Se converter para chave paga:

1. Obter nova chave em Google Cloud Console
2. Atualizar `.env.local`:
   ```bash
   VITE_GEMINI_API_KEY=nova_chave_aqui
   ```
3. Reiniciar dev server
4. Limpar cache do navegador (DevTools → Clear Storage)

## 💡 Dicas de Performance

### Para Caching Efetivo
```bash
# Aumentar TTL se muitas transações similares
VITE_AI_CACHE_TTL=7200  # 2 horas

# Reduzir se quer sempre chamar Gemini
VITE_AI_CACHE_TTL=60    # 1 minuto
```

### Para Melhor Confiança
```bash
# Default threshold
VITE_AI_CONFIDENCE_THRESHOLD=70

# Mais permissivo (mais sugestões)
VITE_AI_CONFIDENCE_THRESHOLD=50

# Mais restritivo (apenas sugestões confiáveis)
VITE_AI_CONFIDENCE_THRESHOLD=80
```

## 🌐 Próximas Integrações

### Adicionar a Mais Telas
```typescript
// Em qualquer componente de transação:
import { useCategorization } from '@/hooks/useCategorization'

const { data: suggestion } = useCategorization(description, amount)
```

### Integrar com Email Notifications
```
1. Quando anomalia detectada → enviar email alert
2. Quando orçamento excedido → notificar usuário
3. Sugestões semanais de economia
```

### Análise Mensal
```
1. Gerar relatório cacheado por mês
2. Mostrar comparação com meses anteriores
3. Tendências de gastos
```

## 📞 Suporte

### Se API Gemini cair
```
Sistema continua funcionando com padrões locais
Usuário vê sugestões com confiança reduzida
Sem impacto na experiência
```

### Limites da API Gratuita
- 60 requisições por minuto
- Máximo 1500 por dia
- Depois das 00h (UTC) reseta

Se atingir limite:
```
1. Implementar queue com Redis
2. Ou usar API paga (ilimitado)
3. Ou implementar modelo local com IA.js
```

## ✨ Pronto!

Você está pronto para usar ETAPA 5 com IA! 🎉

```bash
npm run dev
# → Abrir http://localhost:5173
# → Adicionar transação com descrição
# → Aceitar sugestão de categoria
# → Ir ao Dashboard para ver insights
```

---

**Dúvidas?** Verificar console (F12) para logs detalhados.  
**Tudo funcionando?** Parabéns! 🚀
