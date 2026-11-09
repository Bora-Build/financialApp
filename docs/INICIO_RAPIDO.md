# Desenvolvimento local

Atualizado em 09/11/2026. [Índice](INDICE_DOCUMENTACAO.md).

## Preparação

Use Node.js 24 e MySQL em uma instância local exclusiva. Na raiz do repositório:

```sh
npm ci
```

Crie o banco e um usuário próprios, com acesso somente a esse banco. Importe `database/schema.sql` apenas no banco novo e vazio. O arquivo contém `DROP TABLE`; nunca execute sobre dados que deseja preservar. O banco local não deve apontar para a VPS.

## Frontend

Crie `.env.local`, ignorado pelo Git:

```dotenv
VITE_APP_BASE_PATH=/
VITE_API_URL=
```

Com `VITE_API_URL` vazio, o frontend usa `/api`; o Vite encaminha esse caminho para `http://localhost:21149`, conforme `vite.config.ts`.

## API principal

Em um terminal PowerShell, configure suas credenciais locais e execute:

```powershell
$env:HOST = '127.0.0.1'
$env:PORT = '21149'
$env:APP_BASE_PATH = '/'
$env:APP_URL = 'http://localhost:5173'
$env:DB_HOST = '127.0.0.1'
$env:DB_PORT = '3306'
$env:DB_NAME = 'financial_app'
$env:DB_USER = '<usuario-local>'
$env:DB_PASS = '<senha-local>'
$env:JWT_SECRET = '<segredo-local-aleatorio>'
$env:JWT_REFRESH_SECRET = '<outro-segredo-local-aleatorio>'
node FinancialApp.js
```

Substitua os exemplos entre `<...>` antes de executar. Não reutilize os segredos de produção. O entrypoint principal não carrega `.env` automaticamente; `.env.local` é lido pelo Vite, não por `node FinancialApp.js`. Use variáveis do processo, ou um arquivo local ignorado com `node --env-file=.env FinancialApp.js` no Node.js 24.

Em outro terminal:

```powershell
npm.cmd run dev
```

Abra `http://localhost:5173/login`.

O atalho Windows `scripts/start-local-dev.bat` inicia API e frontend; a configuração automática do MariaDB nele depende de caminhos específicos desta máquina. As variáveis definidas no terminal pai são herdadas. Ele não provisiona um banco completo nem substitui a configuração acima.

## Verificações

```sh
npm run lint
npm run type-check
npm run build
curl --fail http://127.0.0.1:21149/health
curl --fail http://127.0.0.1:21149/health/db
```

`/health` confirma o processo HTTP; `/health/db` confirma a conexão com o banco. Não substituem testes completos de login e cadastro.

O Vite fornece o frontend durante o desenvolvimento. Para servir o build pelo Express, `FinancialApp.js` prefere `public/index.html` quando existe e só usa `dist/` como alternativa. `npm run build` gera `dist/`, mas não substitui o `public/` legado. O workflow de produção monta um pacote separado com `dist/` em `public/` e evita esse problema.

O proxy opcional `backend/src/index.js` não substitui a API principal. Leia [backend/README.md](../backend/README.md).
