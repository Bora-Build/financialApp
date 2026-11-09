> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# 🚀 PM2 - Guia Prático (Tudo em Um Arquivo)

## ⚡ Início Rápido (2 minutos)

### Windows
```bash
setup-pm2.bat
```

### Linux/Mac
```bash
chmod +x setup-pm2.sh
./setup-pm2.sh
```

**Pronto! Frontend (5173) + Backend (3000) rodando.**

---

## 📋 Comandos Essenciais

```bash
pm2 status              # Ver status
pm2 logs                # Ver logs
pm2 monit               # Monitor
pm2 restart all         # Reiniciar
pm2 stop all            # Parar
pm2 delete all          # Deletar
```

---

## 🌐 Acessar

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 🐛 Problema? Veja Aqui

**Porta em uso:**
```bash
# Windows
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :5173
```

**Processo não inicia:**
```bash
pm2 logs
```

**Resetar tudo:**
```bash
pm2 delete all
pm2 flush
setup-pm2.bat  # ou ./setup-pm2.sh
```

---

**Fim. Pronto para usar.**
