> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# 📚 Índice PM2 - Todos os Arquivos

## 🎯 Comece Aqui

### 1. **PM2_BEM_VINDO.md** ⭐ LEIA PRIMEIRO
   - Bem-vindo visual
   - Resumo do que foi criado
   - Como começar em 2 minutos
   - **Tempo:** 2 minutos

### 2. **PM2_INICIO_RAPIDO.md** ⭐ PARA COMEÇAR AGORA
   - Início em 2 minutos
   - Comandos essenciais
   - Verificação rápida
   - **Tempo:** 2 minutos

---

## 📖 Documentação Detalhada

### 3. **GUIA_PM2.md** 📋 REFERÊNCIA COMPLETA
   - O que é PM2
   - Arquitetura
   - Instalação
   - Todos os comandos
   - Configuração detalhada
   - Casos de uso
   - Monitoramento
   - **Tempo:** 15 minutos

### 4. **COMPARACAO_FORMAS_EXECUCAO.md** 📊 COMPARAÇÃO
   - npm run dev
   - 2 Terminais
   - Script
   - PM2 (Recomendado)
   - Tabela comparativa
   - Fluxo de decisão
   - Escalabilidade
   - **Tempo:** 5 minutos

### 5. **PM2_TROUBLESHOOTING.md** 🐛 TROUBLESHOOTING
   - Problemas comuns
   - Soluções passo a passo
   - Verificação de saúde
   - Último recurso
   - **Tempo:** 10 minutos

### 6. **PM2_SUMARIO.md** 📚 SUMÁRIO
   - Tudo que foi criado
   - Arquitetura
   - Comandos principais
   - Benefícios
   - Próximos passos
   - **Tempo:** 5 minutos

---

## 🔧 Arquivos de Configuração

### 7. **ecosystem.config.js** ⚙️ CONFIGURAÇÃO PRINCIPAL
   - Configuração do PM2
   - Frontend (Vite) - Porta 5173
   - Backend (Express) - Porta 3000
   - Logs centralizados
   - Monitoramento automático
   - Deploy configuration

### 8. **ecosystem.windows.config.js** 🪟 WINDOWS OTIMIZADO
   - Versão otimizada para Windows
   - Mesma funcionalidade
   - Melhor compatibilidade

---

## 🚀 Scripts de Setup

### 9. **setup-pm2.bat** 🪟 WINDOWS
   - Setup automático para Windows
   - Instala PM2
   - Cria diretório de logs
   - Instala dependências
   - Inicia processos
   - Salva configuração

### 10. **setup-pm2.sh** 🐧 LINUX/MAC
   - Setup automático para Linux/Mac
   - Instala PM2
   - Cria diretório de logs
   - Instala dependências
   - Inicia processos
   - Salva configuração

---

## 📊 Fluxo de Leitura Recomendado

### Para Iniciantes (10 minutos)
```
1. PM2_BEM_VINDO.md (2 min)
   ↓
2. PM2_INICIO_RAPIDO.md (2 min)
   ↓
3. Executar setup-pm2.bat ou ./setup-pm2.sh (2 min)
   ↓
4. Verificar com: pm2 status (1 min)
   ↓
5. Ver logs com: pm2 logs (1 min)
```

### Para Desenvolvedores (25 minutos)
```
1. PM2_BEM_VINDO.md (2 min)
   ↓
2. GUIA_PM2.md (15 min)
   ↓
3. COMPARACAO_FORMAS_EXECUCAO.md (5 min)
   ↓
4. Executar setup (2 min)
   ↓
5. Explorar comandos (1 min)
```

### Para DevOps/Produção (20 minutos)
```
1. PM2_SUMARIO.md (5 min)
   ↓
2. GUIA_PM2.md (10 min)
   ↓
3. Configurar ecosystem.config.js (3 min)
   ↓
4. Deploy (2 min)
```

---

## 🎯 Respostas Rápidas

### "Como faço para começar?"
→ Leia: **PM2_INICIO_RAPIDO.md**

### "Como funciona o PM2?"
→ Leia: **GUIA_PM2.md**

### "Qual é a melhor forma de rodar?"
→ Leia: **COMPARACAO_FORMAS_EXECUCAO.md**

### "Algo não está funcionando"
→ Leia: **PM2_TROUBLESHOOTING.md**

### "Quero entender tudo"
→ Leia: **PM2_SUMARIO.md**

---

## 📁 Estrutura de Arquivos

```
financial-app/
├── 📄 PM2_BEM_VINDO.md ⭐ COMECE AQUI
├── 📄 PM2_INICIO_RAPIDO.md ⭐ PARA COMEÇAR
├── 📄 GUIA_PM2.md 📋 REFERÊNCIA
├── 📄 COMPARACAO_FORMAS_EXECUCAO.md 📊 COMPARAÇÃO
├── 📄 PM2_TROUBLESHOOTING.md 🐛 TROUBLESHOOTING
├── 📄 PM2_SUMARIO.md 📚 SUMÁRIO
├── 📄 INDICE_PM2.md 📚 ESTE ARQUIVO
├── ⚙️ ecosystem.config.js
├── 🪟 ecosystem.windows.config.js
├── 🚀 setup-pm2.bat
├── 🐧 setup-pm2.sh
├── 📁 logs/
│   ├── frontend-out.log
│   ├── frontend-error.log
│   ├── backend-out.log
│   └── backend-error.log
├── 📁 src/ (Frontend)
└── 📁 backend/ (Backend)
```

---

## ✨ Resumo

| Arquivo | Tipo | Propósito | Tempo |
|---------|------|-----------|-------|
| PM2_BEM_VINDO.md | Documentação | Bem-vindo | 2 min |
| PM2_INICIO_RAPIDO.md | Documentação | Início rápido | 2 min |
| GUIA_PM2.md | Documentação | Guia completo | 15 min |
| COMPARACAO_FORMAS_EXECUCAO.md | Documentação | Comparação | 5 min |
| PM2_TROUBLESHOOTING.md | Documentação | Troubleshooting | 10 min |
| PM2_SUMARIO.md | Documentação | Sumário | 5 min |
| INDICE_PM2.md | Documentação | Índice | 5 min |
| ecosystem.config.js | Configuração | Config principal | - |
| ecosystem.windows.config.js | Configuração | Config Windows | - |
| setup-pm2.bat | Script | Setup Windows | - |
| setup-pm2.sh | Script | Setup Linux/Mac | - |

---

## 🚀 Começar Agora

### Windows
```bash
setup-pm2.bat
```

### Linux/Mac
```bash
chmod +x setup-pm2.sh
./setup-pm2.sh
```

---

## 📞 Referências

- [PM2 Documentação Oficial](https://pm2.keymetrics.io/)
- [PM2 GitHub](https://github.com/Unitech/pm2)
- [PM2 Ecosystem File](https://pm2.keymetrics.io/docs/usage/ecosystem-file/)
- [PM2 CLI Reference](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

## ✅ Checklist de Leitura

- [ ] Li PM2_BEM_VINDO.md
- [ ] Li PM2_INICIO_RAPIDO.md
- [ ] Executei setup-pm2.bat ou ./setup-pm2.sh
- [ ] Verifiquei com pm2 status
- [ ] Acessei http://localhost:5173
- [ ] Acessei http://localhost:3000
- [ ] Vi logs com pm2 logs
- [ ] Pronto para usar!

---

## 🎉 Conclusão

Você tem tudo que precisa para gerenciar seu projeto com PM2:

✅ Configuração completa
✅ Scripts de setup automático
✅ Documentação detalhada
✅ Troubleshooting incluído
✅ Pronto para produção

**Bom desenvolvimento! 🚀**

---

**Índice criado em:** Janeiro 2025  
**Status:** ✅ COMPLETO
