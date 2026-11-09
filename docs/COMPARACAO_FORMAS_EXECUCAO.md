> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# 📊 Comparação: Formas de Rodar o Projeto

## 🎯 Resumo Visual

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FORMAS DE RODAR O PROJETO                            │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 1️⃣  FORMA SIMPLES (npm run dev)                                         │
├────────────────────────────────────────���────────────────────────────────┤
│ Comando:     npm run dev                                                │
│ Portas:      Frontend: 5173                                             │
│ Processo:    1 terminal                                                 │
│ Logs:        Console                                                    │
│ Reinício:    Manual                                                     │
│ Monitoramento: Nenhum                                                   │
│ Ideal para:  Desenvolvimento rápido                                     │
│ Complexidade: ⭐ Muito Simples                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 2️⃣  FORMA MANUAL (2 Terminais)                                          │
├────────────────────────��────────────────────────────────────────────────┤
│ Comando 1:   cd backend && npm run dev                                  │
│ Comando 2:   npm run dev                                                │
│ Portas:      Frontend: 5173, Backend: 3000                              │
│ Processo:    2 terminais                                                │
│ Logs:        2 consoles                                                 │
│ Reinício:    Manual                                                     │
│ Monitoramento: Nenhum                                                   │
│ Ideal para:  Desenvolvimento com backend                                │
│ Complexidade: ⭐⭐ Simples                                               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 3️⃣  FORMA COM SCRIPT (start.bat / start.sh)                             │
├─────────────────────────────────────────────────────────────────────────┤
│ Comando:     start.bat (Windows) ou ./start.sh (Linux/Mac)              │
│ Portas:      Frontend: 5173, Backend: 3000                              │
│ Processo:    Menu interativo                                            │
│ Logs:        2 consoles                                                 │
│ Reinício:    Manual                                                     │
│ Monitoramento: Nenhum                                                   │
│ Ideal para:  Desenvolvimento com menu                                   │
│ Complexidade: ⭐⭐ Simples                                               │
└─────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────���────────────┐
│ 4️⃣  FORMA COM PM2 (Recomendado) ⭐⭐⭐                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ Comando:     setup-pm2.bat (Windows) ou ./setup-pm2.sh (Linux/Mac)      │
│ Portas:      Frontend: 5173, Backend: 3000                              │
│ Processo:    1 comando                                                  │
│ Logs:        Centralizados em ./logs/                                   │
│ Reinício:    Automático                                                 │
│ Monitoramento: Completo (CPU, memória, etc)                             │
│ Ideal para:  Produção e desenvolvimento profissional                    │
│ Complexidade: ⭐⭐⭐ Profissional                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Tabela Comparativa

| Critério | npm run dev | 2 Terminais | Script | PM2 |
|----------|-------------|-------------|--------|-----|
| **Setup** | 30 seg | 1 min | 1 min | 2 min |
| **Portas** | 5173 | 5173, 3000 | 5173, 3000 | 5173, 3000 |
| **Terminais** | 1 | 2 | 2 | 0 |
| **Logs** | Console | 2 Consoles | 2 Consoles | Arquivo |
| **Reinício** | Manual | Manual | Manual | Automático |
| **Monitoramento** | ❌ | ❌ | ❌ | ✅ |
| **Produção** | ❌ | ❌ | ❌ | ✅ |
| **Complexidade** | ⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Ideal para** | Dev rápido | Dev | Dev | Prod |

---

## 🎯 Qual Escolher?

### 🚀 Desenvolvimento Rápido
```bash
npm run dev
```
- ✅ Mais rápido
- ✅ Sem dependências
- ✅ Ideal para testes rápidos

### 💻 Desenvolvimento com Backend
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
npm run dev
```
- ✅ Testa frontend + backend
- ✅ Vê logs de ambos
- ✅ Ideal para desenvolvimento

### 🎮 Desenvolvimento com Menu
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```
- ✅ Menu interativo
- ✅ Escolhe opção
- ✅ Ideal para não técnicos

### 🚀 Produção (Recomendado)
```bash
# Windows
setup-pm2.bat

# Linux/Mac
./setup-pm2.sh
```
- ✅ Gerenciamento profissional
- ✅ Reinício automático
- ✅ Monitoramento completo
- ✅ Logs centralizados
- ✅ Ideal para produção

---

## 🔄 Fluxo de Decisão

```
                    ┌─────────────────────┐
                    │ Como rodar o projeto?│
                    └────────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼────────┐      ┌────────▼──────┐
            │ Desenvolvimento?│      │ Produção?     │
            └───────┬────────┘      └────────┬──────┘
                    │                        │
        ┌───────────┴──────────┐             │
        │                      │             │
    ┌───▼────┐          ┌──────▼────┐       │
    │ Rápido?│          │ Com Menu? │       │
    └───┬────┘          └──────┬────┘       │
        │                      │            │
    ┌───▼────┐          ┌──────▼────┐  ┌───▼────┐
    │npm run │          │ start.bat │  │ PM2    │
    │  dev   │          │ start.sh  │  │ Setup  │
    └────────┘          └───────────┘  └────────┘
```

---

## 📊 Recursos Consumidos

### npm run dev
```
CPU:     ~5-10%
Memória: ~200-300MB
Disco:   ~100MB (node_modules)
```

### 2 Terminais
```
CPU:     ~10-15%
Memória: ~400-500MB
Disco:   ~200MB (node_modules)
```

### PM2
```
CPU:     ~10-15%
Memória: ~400-500MB
Disco:   ~200MB (node_modules) + ~10MB (logs)
```

---

## 🚀 Migração Entre Formas

### De npm run dev → PM2
```bash
# 1. Parar npm run dev (Ctrl+C)
# 2. Instalar PM2
npm install -g pm2

# 3. Executar setup
setup-pm2.bat  # Windows
./setup-pm2.sh # Linux/Mac

# 4. Verificar
pm2 status
```

### De 2 Terminais → PM2
```bash
# 1. Parar ambos os terminais (Ctrl+C)
# 2. Executar setup
setup-pm2.bat  # Windows
./setup-pm2.sh # Linux/Mac

# 3. Verificar
pm2 status
```

### De PM2 → npm run dev
```bash
# 1. Parar PM2
pm2 stop all
pm2 delete all

# 2. Executar npm run dev
npm run dev
```

---

## 📈 Escalabilidade

### npm run dev
```
Escalabilidade: ❌ Não escalável
Limite: 1 instância
```

### 2 Terminais
```
Escalabilidade: ⚠️ Limitada
Limite: 2 instâncias (manual)
```

### PM2
```
Escalabilidade: ✅ Altamente escalável
Limite: Múltiplas instâncias
Exemplo:
  instances: 'max'  # Usa todos os cores
  exec_mode: 'cluster'  # Modo cluster
```

---

## 🔐 Segurança

### npm run dev
```
Segurança: ⚠️ Baixa
- Chave exposta no console
- Sem isolamento de processo
```

### 2 Terminais
```
Segurança: ⚠️ Baixa
- Chave exposta no console
- Sem isolamento de processo
```

### PM2
```
Segurança: ✅ Alta
- Logs em arquivo (não console)
- Isolamento de processo
- Controle de acesso
- Monitoramento
```

---

## 📚 Documentação

| Forma | Documentação |
|-------|--------------|
| npm run dev | Vite Docs |
| 2 Terminais | Vite + Express Docs |
| Script | start.bat / start.sh |
| PM2 | GUIA_PM2.md + PM2_INICIO_RAPIDO.md |

---

## ✅ Recomendação Final

### Para Desenvolvimento
```bash
npm run dev
```
Simples, rápido, sem dependências.

### Para Desenvolvimento com Backend
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
npm run dev
```
Testa ambos os lados.

### Para Produção
```bash
setup-pm2.bat  # Windows
./setup-pm2.sh # Linux/Mac
```
Profissional, seguro, escalável.

---

**Comparação criada em:** Janeiro 2025  
**Status:** ✅ COMPLETA
