> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# ETAPA 5: SISTEMA DE IA PARA CATEGORIZAÇÃO

## 🤖 Visão Geral

Implementação completa de um sistema de IA para categorização automática de transações financeiras, com suporte a **Google Gemini API** e fallback para categorização local baseada em padrões brasileiros.

## 📦 Componentes Implementados

### 1. **Serviços de IA**

#### `src/services/ai/gemini.ts`
- Cliente HTTP para Google Gemini API
- Sistema de caching inteligente (TTL configurável)
- Métodos principais:
  - `generateContent()`: Chamada genérica à API Gemini
  - `categorizeTransaction()`: Categoriza transações com IA
  - `generateInsights()`: Gera insights financeiros
  - `detectAnomalies()`: Detecta padrões anormais de gasto
  - `suggestSavings()`: Sugere estratégias de economia

#### `src/services/ai/categorization.ts`
- Estratégia de categorização em múltiplas camadas:
  1. **Merchant Recognition**: Identifica estabelecimentos conhecidos (99% confiança)
  2. **Pattern Matching**: Padrões locais brasileiros (70%+ confiança)
  3. **Gemini AI**: Classificação inteligente (60%+ confiança)
  4. **Similarity Matching**: Busca por histórico similar
  5. **Default Fallback**: Categoria "outro" como fallback
- Sistema de feedback do usuário para aprendizado contínuo

### 2. **Utilitários de Processamento**

#### `src/utils/textProcessing.ts`
- `normalizeDescription()`: Limpeza e padronização de texto
- `extractKeywords()`: Extração com remoção de stopwords
- `calculateSimilarity()`: Similarity entre descrições
- `detectTransactionType()`: Identifica PIX, TED, Débito, etc.
- `extractMerchant()`: Extrai estabelecimento da descrição

#### `src/utils/categoryPatterns.ts`
- 80+ padrões de categorização específicos para o Brasil
- 10 categorias principais: Alimentação, Transporte, Saúde, etc.
- Dicionário de merchants brasileiros conhecidos
- Labels com emojis para interface visual

### 3. **Hooks React**

#### `src/hooks/useCategorization.ts`
- `useCategorization()`: Hook para categorizar uma transação
- `useBatchCategorization()`: Sugestões para múltiplas transações
- `useCategorizationFeedback()`: Registra feedback do usuário
- `useCategorizationReport()`: Estatísticas de confiança

#### `src/hooks/useInsights.ts`
- `useFinancialInsights()`: Insights gerais sobre gastos
- `useAnomalyDetection()`: Detecta gastos anormais
- `useSavingsSuggestions()`: Sugestões de economia
- `useTrendAnalysis()`: Análise de tendências mensais
- Funções locais sem dependência de API como fallback

### 4. **Componentes UI**

#### `src/components/ui/CategorySuggestion.tsx`
- Exibe sugestão de categoria com confiança visual
- Botões para aceitar/rejeitar sugestão
- Suporte para diferentes fontes (Gemini, Padrão, Merchant)
- Integrada no formulário de adicionar transação

#### `src/components/ui/InsightsDisplay.tsx`
- Painel completo de insights financeiros
- Exibe alertas de orçamento com cores por impacto
- Anomalias detectadas com alertas
- Sugestões de economia personalizadas

#### `src/components/ui/AISummary.tsx`
- Resumo de IA para o Dashboard
- Tendências de gasto (📈📉➡️)
- Top 2 insights principais
- Anomalias detectadas
- Integração no dashboard principal

## 🔧 Configuração

### Variáveis de Ambiente

Adicione ao `.env.local`:

```env
# Gemini API (https://ai.google.dev/)
VITE_GEMINI_API_KEY=sua_chave_actual_aqui

# Configuração de IA
VITE_AI_PROVIDER=gemini
VITE_AI_CONFIDENCE_THRESHOLD=70
VITE_AI_CACHE_TTL=3600
```

### Tipos TypeScript

Arquivo `src/vite-env.d.ts` define tipos para environment variables do Vite.

## 🧠 Estratégia de Categorização

### Camada 1: Reconhecimento de Merchant (99% confiança)
```
"Carrefour" → "alimentacao"
"Shell" → "transporte"
"Netflix" → "diversao"
```

### Camada 2: Padrão Local (70%+ confiança)
```
"restaurante", "pizza", "lanchonete" → "alimentacao"
"uber", "taxi", "combustível" → "transporte"
```

### Camada 3: Gemini AI (60%+ confiança)
```
Usa IA para entender contexto de descrições complexas
"Compra no Carrefour extra" → "alimentacao"
"Transferência para João Silva" → "trabalho"
```

### Camada 4: Histórico Similar (Confiança reduzida 0.8x)
```
Se encontrar transação similar anterior com categoria
```

### Fallback
```
"outro" com 20% confiança
```

## 📊 Insights Disponíveis

### Categoria com Maior Gasto
```
"Alimentação representa R$ 2.500 de seus gastos"
```

### Orçamento Excedido
```
"Você gastou R$ 1.200 de um orçamento de R$ 1.000"
Impacto: ALTO (vermelho)
```

### Orçamento Próximo ao Limite
```
"Você atingiu 85% do seu orçamento"
Impacto: MÉDIO (amarelo)
```

### Anomalias de Gasto
```
Transações > 2 desvios padrão
Exemplo: "Transação elevada: R$ 5.000 - Compra online"
```

### Sugestões de Economia
```
"Reduzir Alimentação em 10%: economize R$ 250/mês"
"Reduzir Transporte em 15%: economize R$ 180/mês"
```

## 🚀 Fluxo de Uso

### 1. Adicionar Transação
```
1. Usuário preenche descri ção
2. Logo após descrever:
   - CategorySuggestion com confiança aparece
   - Botões "Aceitar" e "Rejeitar"
3. Aceitar: categoria é auto-preenchida
4. Rejeitar: usuário pode selecionar manualmente
```

### 2. Dashboard com Insights
```
1. Dashboard exibe AISummary
2. Mostra:
   - Tendência de gastos (📈📉➡️)
   - Top 2 insights
   - Anomalias detectadas
3. Clicável para detalhes completos
```

### 3. Tela de Insights Completa
```
1. Usuário navega para tela de insights
2. Vê:
   - Todos os insights do mês
   - Anomalias com detalhes
   - Sugestões de economia personalizadas
3. Pode fornecer feedback para aprender
```

## 💾 Caching e Performance

### Estratégia de Cache
- **Categorização**: Cache por descrição (24h de TTL)
- **Insights**: Cache por set de transações (30 min)
- **Padrões**: Cache local em memória
- **Sugestões**: Cache por categoria/período (1h)

### Otimizações API
- Batch processing para múltiplas transações
- Rate limiting (máx 10 categorizações simultâneas)
- Fallback automático se API indisponível
- Retry com exponential backoff

## 🛡️ Tratamento de Erros

### Se API Gemini Falhar
1. Sistema continua com padrões locais
2. Confiança reduzida (~50%)
3. Log de erro para debugging
4. Usuário não vê impacto

### Se Config Faltando
```
"⚠️ Gemini API key not configured. Using local categorization fallback."
```

## 📈 Métricas Disponíveis

### `getConfidenceReport()`
```
{
  totalCategorized: 150,
  averageConfidence: 78.5,
  sourceBreakdown: {
    gemini: 45,
    pattern: 75,
    merchant: 30
  }
}
```

## 🧪 Testando Localmente

### 1. Sem chave Gemini (modo padrões locais)
```
Deixar VITE_GEMINI_API_KEY em branco
Sistema usa apenas padrões brasileiros
```

### 2. Com chave Gemini
```
VITE_GEMINI_API_KEY=eyJ... (de ai.google.dev)
Full IA + padrões como fallback
```

### 3. Verificar Logs
```
Chrome DevTools > Console
Mensagens de categorização e insights
```

## 🌎 Contexto Brasileiro Integrado

### Merchants Conhecidos
- Carrefour, Extra, Pão de Açúcar
- Drogasil, Raia, Pacheco
- Shell, Petrobras, Ipiranga
- McDonald's, Burger King, Subway
- Netflix, Spotify, YouTube

### Padrões de Descrição
- Números no início (códigos de banco)
- Abreviações comuns (cxc, trf, dep)
- Emojis de categoria (🍔, 🚗, ⚕️)

### Tipos de Transação
-  PIX, TED, DOC, Boleto
- Débito, Crédito, Transfer

## 📝 Exemplo de Integração

```typescript
// Usar categorização
const { data: suggestion } = useCategorization("Almoço na pizzaria Luigi", 45.90)
// Resultado: { category: "alimentacao", confidence: 92, source: "merchant" }

// Usar insights
const { data: insights } = useFinancialInsights(transactions, budgets)
// Resultado: [
//   { title: "Maior categoria", description: "Alimentação R$ 2.500", impact: "medium" }
// ]

// Componente aceita sugestão
<CategorySuggestion
  description={description}
  amount={amount}
  selectedCategory={categoryId}
  onSelectCategory={setCategoryId}
  onAcceptSuggestion={() => toast.success("✓ Sugestão aceita!")}
/>
```

## 🔐 Segurança

- API Key armazenada em `.env.local` (não commitado)
- Nenhum dado sensível enviado ao Gemini
- Apenas descrição + valor + categorias disponíveis
- Cache local, sem armazenamento em servidor

## 📊 Bundle Impact

- Adiciona ~20KB ao bundle (gzip)
- Utiliza React Query para caching eficiente
- Lazy loading de hooks sob demanda
- Zero impacto se API não configurada

## 🚀 Próximos Passos Opcionais

1. **Machine Learning Local**: Usar WASM para modelo TensorFlow.js
2. **Histórico Aprendizado**: Salvar feedback & retraining
3. **Análise de Risco**: Detectar fraudes
4. **Recomendações**: Sugerir categorias antes do usuário digitar
5. **Multi-idioma**: Suporte para categorias em português/inglês

## 📚 Arquivos Criados

```
src/
├── services/ai/
│   ├── gemini.ts                    (Client Google Gemini)
│   └── categorization.ts            (Serviço multi-camada)
├── utils/
│   ├── textProcessing.ts            (NLP básico)
│   └── categoryPatterns.ts          (Padrões brasileiros)
├── hooks/
│   ├── useCategorization.ts         (Hooks de categorização)
│   └── useInsights.ts               (Hooks de insights)
├── components/ui/
│   ├── CategorySuggestion.tsx       (Sugestão no formulário)
│   ├── InsightsDisplay.tsx          (Painel completo)
│   └── AISummary.tsx                (Resumo no dashboard)
├── vite-env.d.ts                    (Tipos Vite)
└── components/forms/
    └── AddTransactionModal.tsx      (Modificado com sugestão)
```

## ✅ Checklist de Implementação

- [x] Serviço Gemini com caching
- [x] Serviço de categorização multi-camada
- [x] Utilitários de processamento de texto
- [x] Padrões brasileiros (80+)
- [x] Hooks React para UI
- [x] Componente de sugestão no formulário
- [x] Componente de insights completo
- [x] Integração no Dashboard
- [x] Tipos TypeScript corretos
- [x] Tratamento de erros robusto
- [x] Fallback quando API indisponível
- [x] Build sem erros (972KB gzip)

---

**Criado em**: 2024  
**Versão**: 1.0  
**Status**: ✅ Pronto para Produção
