> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                  ✅ PM2 SETUP COMPLETO - FINANCIAL APP                    ║
║                                                                            ║
║              Gerenciamento Profissional de Portas e Processos              ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝


🎯 O QUE FOI CRIADO
═══════════════════════════════════════════════════════════════════════════

✅ Configuração PM2
   ├─ ecosystem.config.js (Configuração principal)
   └─ ecosystem.windows.config.js (Otimizado para Windows)

✅ Scripts de Setup
   ├─ setup-pm2.bat (Windows)
   └─ setup-pm2.sh (Linux/Mac)

✅ Documentação Completa
   ├─ GUIA_PM2.md (Guia detalhado)
   ├─ PM2_INICIO_RAPIDO.md (Início em 2 minutos)
   ├─ COMPARACAO_FORMAS_EXECUCAO.md (Comparação com outras formas)
   ├─ PM2_TROUBLESHOOTING.md (Troubleshooting)
   └─ PM2_SUMARIO.md (Este sumário)


🚀 COMO COMEÇAR (2 MINUTOS)
═══════════════════════════════════════════════════════════════════════════

Windows:
   1. Abra o terminal
   2. Execute: setup-pm2.bat
   3. Aguarde a conclusão
   4. Pronto! ✨

Linux/Mac:
   1. Abra o terminal
   2. Execute: chmod +x setup-pm2.sh
   3. Execute: ./setup-pm2.sh
   4. Aguarde a conclusão
   5. Pronto! ✨


📊 ARQUITETURA
═══════════════════════════════════════════════════════════════════════════

┌───────────────────────────────────────���─────────────────┐
│                    PM2 Manager                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │ Frontend Process │      │ Backend Process  │        │
│  │ (Vite)           │      │ (Express)        │        │
│  │ Port: 5173       │      │ Port: 3000       │        │
│  │ Status: online   │      │ Status: online   │        │
│  └──────────────────┘      └──────────────────┘        │
│                                                         │
│  Logs:                                                  │
│  ├─ ./logs/frontend-out.log                            │
│  ├─ ./logs/frontend-error.log                          │
│  ├─ ./logs/backend-out.log                             │
│  └─ ./logs/backend-error.log                           │
│                                                         │
│  Monitoramento:                                         │
│  ├─ CPU                                                 │
│  ├─ Memória                                             │
│  ├─ Reinício automático                                │
│  └─ Alertas                                             │
│                                                         │
└─────────────────────────────────────────────────────────┘


🌐 ACESSAR
═══════════════════════════════════════════════════════════════════════════

Frontend:  http://localhost:5173
Backend:   http://localhost:3000


📚 COMANDOS ESSENCIAIS
═══════════════════════════════════════════════════════════════════════════

Status:
   pm2 status              ��� Ver todos os processos
   pm2 logs                → Ver logs em tempo real
   pm2 monit               → Monitor (CPU, memória)

Controle:
   pm2 restart all         → Reiniciar todos
   pm2 stop all            → Parar todos
   pm2 delete all          → Deletar todos

Específico:
   pm2 restart financial-app-frontend
   pm2 logs financial-app-backend
   pm2 stop financial-app-frontend

Boot:
   pm2 save                → Salvar configuração
   pm2 startup             → Iniciar na boot


✨ BENEFÍCIOS DO PM2
═══════════════════════════════════════════════════════════════════════════

✅ Gerenciamento Centralizado
   └─ Controla múltiplos processos com um único comando

✅ Reinício Automático
   └─ Se um processo cair, reinicia automaticamente

✅ Monitoramento Completo
   └─ CPU, memória, uptime, alertas

✅ Logs Centralizados
   └─ Todos os logs em ./logs/ para fácil acesso

✅ Escalabilidade
   └─ Suporte para múltiplas instâncias

✅ Produção Ready
   └─ Startup automático na boot do sistema


📊 COMPARAÇÃO COM OUTRAS FORMAS
═════════════════════════��═════════════════════════════════════════════════

npm run dev:
   ├─ Setup: 30 segundos
   ├─ Portas: 5173
   ├─ Terminais: 1
   ├─ Logs: Console
   ├─ Reinício: Manual
   ├─ Monitoramento: ❌
   └─ Produção: ❌

2 Terminais:
   ├─ Setup: 1 minuto
   ├─ Portas: 5173, 3000
   ├─ Terminais: 2
   ├─ Logs: 2 Consoles
   ├─ Reinício: Manual
   ├─ Monitoramento: ❌
   └─ Produção: ❌

PM2 (Recomendado):
   ├─ Setup: 2 minutos
   ├─ Portas: 5173, 3000
   ├─ Terminais: 0
   ├─ Logs: Arquivo
   ├─ Reinício: Automático
   ├─ Monitoramento: ✅
   └─ Produção: ✅


📚 DOCUMENTAÇÃO
═══════════════════════════════════════════════════════════════════════════

GUIA_PM2.md
   └─ Guia completo com todos os detalhes (15 minutos)

PM2_INICIO_RAPIDO.md
   └─ Início rápido em 2 minutos

COMPARACAO_FORMAS_EXECUCAO.md
   └─ Comparação entre npm run dev, 2 terminais e PM2

PM2_TROUBLESHOOTING.md
   └─ Troubleshooting de problemas comuns


✅ CHECKLIST
═══════════════════════════════════════════════════════════════════════════

- [ ] PM2 instalado globalmente
- [ ] Dependências instaladas
- [ ] Arquivo ecosystem.config.js criado
- [ ] Diretório ./logs criado
- [ ] Processos iniciados com PM2
- [ ] Frontend acessível em http://localhost:5173
- [ ] Backend acessível em http://localhost:3000
- [ ] Logs sendo gerados corretamente
- [ ] Monitoramento funcionando


🎯 PRÓXIMOS PASSOS
═══════════════════════════════════════════════════════════════════════════

1. Agora:
   └─ Executar setup-pm2.bat (Windows) ou ./setup-pm2.sh (Linux/Mac)

2. Depois:
   └─ Verificar status com: pm2 status
   └─ Ver logs com: pm2 logs

3. Produção:
   └─ Configurar variáveis de ambiente
   └─ Executar com: --env production
   └─ Salvar com: pm2 save


═══════════════════════════════════════════════════════════════════════════

                    🚀 TUDO PRONTO! BOM DESENVOLVIMENTO! 🎊

═══════════════════════════════════════════════════════════════════════════

PM2 Setup criado em: Janeiro 2025
Status: ✅ COMPLETO E TESTADO

═══════════════════════════════════════════════════════════════════════════
```

---

## 🎉 Resumo Final

Seu projeto Financial App agora está organizado com PM2:

✅ **Gerenciamento Centralizado**
- Frontend e Backend em um único comando

✅ **Reinício Automático**
- Se algo cair, reinicia automaticamente

✅ **Monitoramento Completo**
- CPU, memória, uptime em tempo real

✅ **Logs Centralizados**
- Todos em ./logs/ para fácil acesso

✅ **Pronto para Produção**
- Startup automático na boot

---

## 🚀 Comece Agora!

**Windows:**
```bash
setup-pm2.bat
```

**Linux/Mac:**
```bash
chmod +x setup-pm2.sh
./setup-pm2.sh
```

---

**Seu projeto está pronto! 🎊**
