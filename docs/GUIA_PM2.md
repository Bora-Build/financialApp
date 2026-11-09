> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# 🚀 PM2 - Gerenciador de Processos para Financial App

## 📋 O que é PM2?

PM2 é um gerenciador de processos Node.js que permite:
- ✅ Rodar múltiplos processos simultaneamente
- ✅ Reiniciar automático em caso de erro
- ✅ Monitoramento em tempo real
- ✅ Logs centralizados
- ✅ Iniciar na boot do sistema
- ✅ Balanceamento de carga

---

## 🎯 Arquitetura com PM2

```
┌─────────────────────────────────────────────────────────┐
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
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Instalação Rápida

### Passo 1: Instalar PM2 Globalmente
```bash
npm install -g pm2
```

### Passo 2: Executar Setup
**Windows:**
```bash
setup-pm2.bat
```

**Linux/Mac:**
```bash
chmod +x setup-pm2.sh
./setup-pm2.sh
```

### Passo 3: Verificar Status
```bash
pm2 status
```

---

## 📊 Comandos Principais

### Status e Monitoramento

```bash
# Ver status de todos os processos
pm2 status

# Ver logs em tempo real
pm2 logs

# Ver logs de um processo específico
pm2 logs financial-app-frontend
pm2 logs financial-app-backend

# Monitor em tempo real (CPU, memória, etc)
pm2 monit

# Ver informações detalhadas
pm2 info financial-app-frontend
```

### Controle de Processos

```bash
# Iniciar todos os processos
pm2 start ecosystem.config.js

# Iniciar apenas o frontend
pm2 start ecosystem.config.js --only financial-app-frontend

# Iniciar apenas o backend
pm2 start ecosystem.config.js --only financial-app-backend

# Reiniciar todos
pm2 restart all

# Reiniciar um processo específico
pm2 restart financial-app-frontend

# Parar todos
pm2 stop all

# Parar um processo específico
pm2 stop financial-app-backend

# Deletar todos
pm2 delete all

# Deletar um processo específico
pm2 delete financial-app-frontend
```

### Gerenciamento de Logs

```bash
# Ver últimas 100 linhas de logs
pm2 logs --lines 100

# Limpar todos os logs
pm2 flush

# Salvar logs em arquivo
pm2 logs > app-logs.txt
```

### Configuração de Boot

```bash
# Salvar configuração atual
pm2 save

# Gerar script de startup
pm2 startup

# Remover startup
pm2 unstartup
```

---

## 🔧 Configuração Detalhada

### Arquivo: `ecosystem.config.js`

```javascript
export default {
  apps: [
    {
      name: 'financial-app-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './',
      
      // Porta
      env: {
        PORT: 5173,
        NODE_ENV: 'development',
      },
      
      // Watch (reiniciar ao detectar mudanças)
      watch: false,
      ignore_watch: ['node_modules', 'dist'],
      
      // Logs
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      
      // Performance
      max_memory_restart: '500M',
      max_restarts: 10,
      min_uptime: '10s',
      
      // Instâncias
      instances: 1,
      exec_mode: 'fork',
    },
    // ... backend config
  ],
}
```

### Opções Importantes

| Opção | Descrição | Exemplo |
|-------|-----------|---------|
| `name` | Nome do processo | `financial-app-frontend` |
| `script` | Comando a executar | `npm` ou `./src/index.js` |
| `args` | Argumentos | `run dev` |
| `cwd` | Diretório de trabalho | `./` ou `./backend` |
| `env` | Variáveis de ambiente | `{ PORT: 5173 }` |
| `watch` | Reiniciar ao detectar mudanças | `true` ou `false` |
| `max_memory_restart` | Reiniciar se exceder memória | `500M` |
| `error_file` | Arquivo de erro | `./logs/error.log` |
| `out_file` | Arquivo de saída | `./logs/out.log` |
| `instances` | Número de instâncias | `1` ou `max` |
| `exec_mode` | Modo de execução | `fork` ou `cluster` |

---

## 🎯 Casos de Uso

### Caso 1: Desenvolvimento Local

```bash
# Iniciar ambos os processos
pm2 start ecosystem.config.js

# Ver logs em tempo real
pm2 logs

# Reiniciar quando necessário
pm2 restart all
```

### Caso 2: Produção

```bash
# Iniciar com NODE_ENV=production
pm2 start ecosystem.config.js --env production

# Salvar para iniciar na boot
pm2 save
pm2 startup

# Monitorar
pm2 monit
```

### Caso 3: Apenas Frontend

```bash
# Iniciar apenas frontend
pm2 start ecosystem.config.js --only financial-app-frontend

# Ver logs
pm2 logs financial-app-frontend
```

### Caso 4: Apenas Backend

```bash
# Iniciar apenas backend
pm2 start ecosystem.config.js --only financial-app-backend

# Ver logs
pm2 logs financial-app-backend
```

---

## 📈 Monitoramento

### Dashboard Web (PM2 Plus)

```bash
# Conectar ao PM2 Plus (opcional)
pm2 link <secret_key> <public_key>

# Acessar dashboard
# https://app.pm2.io
```

### Monitoramento Local

```bash
# Monitor em tempo real
pm2 monit

# Ver uso de recursos
pm2 status

# Salvar relatório
pm2 save
```

---

## 🐛 Troubleshooting

### Problema: Porta já em uso

```bash
# Verificar qual processo está usando a porta
# Windows
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :5173

# Matar processo
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

### Problema: Processo não inicia

```bash
# Ver logs de erro
pm2 logs financial-app-frontend

# Ver informações detalhadas
pm2 info financial-app-frontend

# Tentar iniciar manualmente
npm run dev
```

### Problema: Memória alta

```bash
# Ver uso de memória
pm2 monit

# Aumentar limite
# Editar ecosystem.config.js
max_memory_restart: '1G'

# Reiniciar
pm2 restart all
```

### Problema: Logs muito grandes

```bash
# Limpar logs
pm2 flush

# Limpar logs de um processo
pm2 flush financial-app-frontend
```

---

## 📚 Arquivos Criados

| Arquivo | Propósito |
|---------|-----------|
| `ecosystem.config.js` | Configuração principal do PM2 |
| `ecosystem.windows.config.js` | Configuração otimizada para Windows |
| `setup-pm2.sh` | Script de setup para Linux/Mac |
| `setup-pm2.bat` | Script de setup para Windows |
| `GUIA_PM2.md` | Este guia |

---

## 🚀 Próximos Passos

### Desenvolvimento
1. Executar `setup-pm2.bat` (Windows) ou `./setup-pm2.sh` (Linux/Mac)
2. Verificar status com `pm2 status`
3. Ver logs com `pm2 logs`

### Produção
1. Configurar variáveis de ambiente
2. Executar com `--env production`
3. Salvar com `pm2 save`
4. Configurar startup com `pm2 startup`

### Monitoramento
1. Usar `pm2 monit` para monitor em tempo real
2. Usar `pm2 logs` para ver logs
3. Usar `pm2 status` para ver status

---

## 📞 Referências

- [PM2 Documentação Oficial](https://pm2.keymetrics.io/)
- [PM2 GitHub](https://github.com/Unitech/pm2)
- [PM2 Ecosystem File](https://pm2.keymetrics.io/docs/usage/ecosystem-file/)
- [PM2 CLI Reference](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

## ✅ Checklist

- [ ] PM2 instalado globalmente
- [ ] Dependências instaladas (npm install)
- [ ] Arquivo ecosystem.config.js criado
- [ ] Diretório ./logs criado
- [ ] Processos iniciados com PM2
- [ ] Frontend acessível em http://localhost:5173
- [ ] Backend acessível em http://localhost:3000
- [ ] Logs sendo gerados corretamente
- [ ] Monitoramento funcionando

---

**Guia criado em:** Janeiro 2025  
**Status:** ✅ COMPLETO
