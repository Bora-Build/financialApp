> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# 🐛 PM2 - Troubleshooting

## ❌ Problema: PM2 não está instalado

### Sintoma
```
'pm2' is not recognized as an internal or external command
```

### Solução
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Verificar instalação
pm2 --version
```

---

## ❌ Problema: Porta já em uso

### Sintoma
```
Error: listen EADDRINUSE: address already in use :::5173
Error: listen EADDRINUSE: address already in use :::3000
```

### Solução

**Windows:**
```bash
# Encontrar processo na porta 5173
netstat -ano | findstr :5173

# Matar processo (substitua PID)
taskkill /PID 12345 /F

# Ou matar por nome
taskkill /IM node.exe /F
```

**Linux/Mac:**
```bash
# Encontrar processo na porta 5173
lsof -i :5173

# Matar processo (substitua PID)
kill -9 12345

# Ou matar por nome
killall node
```

---

## ❌ Problema: Processo não inicia

### Sintoma
```
pm2 status mostra "stopped" ou "errored"
```

### Solução

**Passo 1: Ver logs de erro**
```bash
pm2 logs financial-app-frontend
pm2 logs financial-app-backend
```

**Passo 2: Ver informações detalhadas**
```bash
pm2 info financial-app-frontend
pm2 info financial-app-backend
```

**Passo 3: Tentar iniciar manualmente**
```bash
# Frontend
npm run dev

# Backend
cd backend && npm run dev
```

**Passo 4: Verificar dependências**
```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

---

## ❌ Problema: Memória alta

### Sintoma
```
Processo usando 500MB+ de memória
```

### Solução

**Passo 1: Ver uso de memória**
```bash
pm2 monit
```

**Passo 2: Aumentar limite**
```javascript
// ecosystem.config.js
{
  max_memory_restart: '1G',  // Aumentar de 500M para 1G
}
```

**Passo 3: Reiniciar**
```bash
pm2 restart all
```

---

## ❌ Problema: Logs muito grandes

### Sintoma
```
Arquivos em ./logs/ com vários GB
```

### Solução

**Passo 1: Limpar logs**
```bash
# Limpar todos
pm2 flush

# Limpar um processo
pm2 flush financial-app-frontend
```

**Passo 2: Configurar rotação de logs**
```javascript
// ecosystem.config.js
{
  error_file: './logs/frontend-error.log',
  out_file: './logs/frontend-out.log',
  log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  // Adicionar rotação
  max_size: '10M',  // Rotacionar a cada 10MB
  max_file: 5,      // Manter 5 arquivos
}
```

---

## ❌ Problema: Processo reinicia constantemente

### Sintoma
```
pm2 status mostra ↺ > 10
```

### Solução

**Passo 1: Ver logs**
```bash
pm2 logs financial-app-frontend --lines 50
```

**Passo 2: Aumentar min_uptime**
```javascript
// ecosystem.config.js
{
  min_uptime: '30s',  // Aumentar de 10s para 30s
  max_restarts: 5,    // Reduzir de 10 para 5
}
```

**Passo 3: Reiniciar**
```bash
pm2 restart all
```

---

## ❌ Problema: Backend não conecta ao Groq

### Sintoma
```
Error: Failed to fetch from Groq API
```

### Solução

**Passo 1: Verificar .env**
```bash
# Backend/.env
GROQ_API_KEY=gsk_...
PORT=3000
```

**Passo 2: Verificar chave**
```bash
# Testar chave manualmente
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer gsk_..." \
  -H "Content-Type: application/json" \
  -d '{"model":"mixtral-8x7b-32768","messages":[{"role":"user","content":"test"}]}'
```

**Passo 3: Reiniciar backend**
```bash
pm2 restart financial-app-backend
```

---

## ❌ Problema: Frontend não conecta ao Backend

### Sintoma
```
ERR_CONNECTION_REFUSED ao chamar localhost:3000
```

### Solução

**Passo 1: Verificar se backend está rodando**
```bash
pm2 status
# Deve mostrar financial-app-backend como "online"
```

**Passo 2: Verificar porta**
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

**Passo 3: Verificar .env.local**
```
VITE_USE_BACKEND=true
VITE_BACKEND_URL=http://localhost:3000
```

**Passo 4: Reiniciar frontend**
```bash
pm2 restart financial-app-frontend
```

---

## ❌ Problema: PM2 não salva configuração

### Sintoma
```
Processos não iniciam após reboot
```

### Solução

**Passo 1: Salvar configuração**
```bash
pm2 save
```

**Passo 2: Gerar startup script**
```bash
pm2 startup
```

**Passo 3: Verificar**
```bash
pm2 status
```

---

## ❌ Problema: Não consegue ver logs

### Sintoma
```
pm2 logs não mostra nada
```

### Solução

**Passo 1: Verificar se logs existem**
```bash
# Windows
dir logs

# Linux/Mac
ls -la logs
```

**Passo 2: Ver logs com mais linhas**
```bash
pm2 logs --lines 100
```

**Passo 3: Ver logs de um processo específico**
```bash
pm2 logs financial-app-frontend
pm2 logs financial-app-backend
```

**Passo 4: Limpar e reiniciar**
```bash
pm2 flush
pm2 restart all
```

---

## ❌ Problema: Erro ao executar setup-pm2.bat

### Sintoma
```
'npm' is not recognized
'pm2' is not recognized
```

### Solução

**Passo 1: Verificar Node.js**
```bash
node --version
npm --version
```

**Passo 2: Instalar Node.js**
- Baixar em: https://nodejs.org/
- Instalar versão LTS
- Reiniciar terminal

**Passo 3: Instalar PM2**
```bash
npm install -g pm2
```

**Passo 4: Executar setup novamente**
```bash
setup-pm2.bat
```

---

## ❌ Problema: Erro ao executar setup-pm2.sh

### Sintoma
```
Permission denied
```

### Solução

**Passo 1: Dar permissão**
```bash
chmod +x setup-pm2.sh
```

**Passo 2: Executar**
```bash
./setup-pm2.sh
```

---

## ✅ Verificação de Saúde

### Checklist

```bash
# 1. PM2 instalado?
pm2 --version

# 2. Processos rodando?
pm2 status

# 3. Logs sem erros?
pm2 logs --lines 20

# 4. Portas acessíveis?
# Frontend: http://localhost:5173
# Backend: http://localhost:3000

# 5. Memória OK?
pm2 monit

# 6. Configuração salva?
pm2 status
```

---

## 🆘 Último Recurso

### Resetar tudo

```bash
# 1. Parar todos os processos
pm2 stop all

# 2. Deletar todos
pm2 delete all

# 3. Limpar logs
pm2 flush

# 4. Remover startup
pm2 unstartup

# 5. Reinstalar PM2
npm uninstall -g pm2
npm install -g pm2

# 6. Executar setup novamente
setup-pm2.bat  # Windows
./setup-pm2.sh # Linux/Mac
```

---

## 📞 Referências

- [PM2 Troubleshooting](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [PM2 GitHub Issues](https://github.com/Unitech/pm2/issues)
- [Node.js Docs](https://nodejs.org/docs/)

---

**Troubleshooting criado em:** Janeiro 2025  
**Status:** ✅ COMPLETO
