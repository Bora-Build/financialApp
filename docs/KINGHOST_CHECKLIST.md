> **Documento histórico — revisado em 09/11/2026.** Este conteúdo registra uma configuração ou etapa anterior; comandos, portas, provedores e afirmações de conclusão abaixo não definem a produção atual. Para operar o SelfMoney, use o [índice atual](INDICE_DOCUMENTACAO.md), o [guia local](INICIO_RAPIDO.md) e o [guia da VPS](../deploy/README.md). Não execute procedimentos antigos na VPS nem altere Zaralho, LucFlix ou monitoramento.

# KingHost - Checklist de Configuracao

## Toques da aplicacao (o que precisa configurar)

1. Arquivo de entrada no painel Node.js: `FinancialApp.js`
2. Pasta de arquivos estaticos: `public/` (gerada por `npm run build:kinghost`)
3. Porta da aplicacao: `21149`
4. Base path da aplicacao: `/financialApp`

## Variaveis obrigatorias

- `PORT=21149`
- `HOST=0.0.0.0`
- `APP_BASE_PATH=/financialApp`
- `VITE_APP_BASE_PATH=/financialApp/`
- `DB_HOST`
- `DB_USER`
- `DB_PASS`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

## Variaveis opcionais

- `VITE_API_URL` (se quiser forcar URL de API)
- `GROQ_API_KEY` (insights IA backend)
- `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` (reset de senha por e-mail)
- `APP_URL` (links completos de reset de senha)

## Comandos de validacao local antes do push

```bash
npm install
npm run build:kinghost
set PORT=32149&& set APP_BASE_PATH=/financialApp&& node FinancialApp.js
```

Depois teste no navegador:

- `http://localhost:32149/`
- `http://localhost:32149/financialApp/`

## Erros que impedem abrir na KingHost

1. Script do painel apontando para arquivo errado (`server.js` em vez de `FinancialApp.js`)
2. `public/index.html` ausente no repositório
3. `PORT` diferente da configurada no painel
4. `APP_BASE_PATH` e `VITE_APP_BASE_PATH` divergentes
5. Build nao gerado antes da sincronizacao Git->FTP
