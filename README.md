# Financial App

Aplicativo de controle financeiro pessoal com React, TypeScript e API Node.js.

## Tecnologias

- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: Node.js + Express + MySQL
- Estado: Zustand + TanStack Query
- Graficos: Recharts
- Formularios: React Hook Form + Zod

## Setup local

### Pre-requisitos

- Node.js 18+

### Variaveis de ambiente

Crie um arquivo `.env.local` na raiz com os valores do frontend.

### Instalar e rodar

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

## Banco de dados

O schema SQL esta em `database/schema.sql`.

## Deploy na KingHost (Node.js + Git)

Este projeto foi ajustado para o mesmo formato do Portfolio que ja funciona na KingHost:
- arquivo de entrada pronto: `FinancialApp.js`
- frontend pronto em `public/`

### Passo a passo rapido

1. Configure os secrets/vars do projeto.
2. Rode build completo para KingHost:

```bash
npm install
npm run build:kinghost
```

3. No painel Node.js da KingHost:
- Caminho da aplicacao: `/financialApp`
- Script: `FinancialApp.js`
- Acesso Web: `SIM`
- SSL: `SIM`

4. Variaveis recomendadas para KingHost:
- `PORT=21149`
- `HOST=0.0.0.0`
- `APP_BASE_PATH=/financialApp`
- `VITE_APP_BASE_PATH=/financialApp/`
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `GROQ_API_KEY` (se usar insights IA no backend)
- `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` (recuperacao de senha)

5. Opcional com PM2:

```bash
npm run pm2:kinghost:start
npm run pm2:kinghost:logs
```

## CI/CD (GitHub Actions)

O workflow `.github/workflows/deploy.yml` agora publica o SelfMoney na VPS a cada push em `main`, com build, lint, SSH exclusivo, verificacao de saude e rollback de codigo. Ele substitui a antiga geracao de commits de build para KingHost.

Configuracao, secrets, DNS e operacao estao em [deploy/README.md](deploy/README.md).

## APK Android (Capacitor)

Este projeto ja esta preparado para gerar APK Android usando Capacitor.

### Pre-requisitos

- Java JDK 17 (ou superior) instalado
- `JAVA_HOME` configurado no Windows
- Android Studio instalado (com Android SDK e Build Tools)

### Comandos

1. Instalar dependencias:

```bash
npm install
```

2. Gerar build web para Android (com API apontando para producao) e sincronizar:

```bash
npm run android:prepare
```

3. Abrir projeto Android no Android Studio:

```bash
npm run android:open
```

4. Gerar APK debug via terminal (opcional):

```bash
npm run android:apk:debug
```

O arquivo final fica em:

`android/app/build/outputs/apk/debug/app-debug.apk`

### Observacoes

- O build Android usa, por padrao:
  - `VITE_API_URL=https://anacron.com.br/financialApp`
  - `VITE_APP_BASE_PATH=/`
- Para trocar a API no APK, rode com variavel customizada:

```bash
$env:VITE_API_URL="https://seu-dominio.com/financialApp"; npm run android:prepare
```
