# SelfMoney — FinancialApp

Aplicativo de controle financeiro pessoal com React, TypeScript e API Node.js/Express com MySQL.

**Produção:** https://selfmoney.lafdev.com.br

**Repositório:** https://github.com/lucasandrefernando/financialApp

## Documentação

| Assunto | Guia |
| --- | --- |
| Desenvolvimento e comandos locais | [Início rápido](docs/INICIO_RAPIDO.md) |
| Arquitetura e componentes | [Arquitetura](docs/ARQUITETURA.md) |
| Variáveis e integrações | [Configuração](docs/CONFIGURACAO.md) |
| Deploy, secrets, logs, backup e rollback | [Operação na VPS](deploy/README.md) |
| Diagnóstico de falhas | [Troubleshooting](docs/TROUBLESHOOTING.md) |
| API principal e proxy de IA legado | [Backend](backend/README.md) |
| Situação validada e pendências | [Estado da implantação](docs/ESTADO_ATUAL.md) |
| Todos os documentos e histórico | [Índice](docs/INDICE_DOCUMENTACAO.md) |

## Tecnologias

React 18, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, React Hook Form, Zod, Recharts, Express e MySQL. A produção usa Node.js 24, systemd, Docker para o banco exclusivo, Caddy e GitHub Actions.

## Desenvolvimento

Use Node.js 24 e o lockfile do projeto:

```sh
npm ci
npm run dev
```

O frontend abre em `http://localhost:5173`. Login e dados exigem a API principal em `127.0.0.1:21149` e um banco local configurado; `npm run dev` sozinho inicia apenas o Vite. Siga o [guia local](docs/INICIO_RAPIDO.md) para iniciar os dois processos.

```sh
npm run lint
npm run type-check
npm run build
```

No PowerShell, use `npm.cmd` se a política de execução bloquear `npm.ps1`.

## Publicação

Cada push em `main` executa `.github/workflows/deploy.yml`: valida o código, compila para `/`, envia a release por SSH e reinicia somente `financialapp.service`. O deploy confere página e banco e volta à release anterior se a verificação falhar. O schema inicial não é reaplicado.

Os cinco secrets são `VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_KEY` e `VPS_KNOWN_HOSTS`. Já foram validados em um [deploy real](https://github.com/lucasandrefernando/financialApp/actions/runs/42618478590). Consulte os valores públicos e a operação em [deploy/README.md](deploy/README.md).

Zaralho, LucFlix e monitoramento estão fora do escopo desta aplicação e não podem ser modificados. As regras persistentes estão em [AGENTS.md](AGENTS.md).

## Banco e integrações

O banco de produção é exclusivo do SelfMoney. `database/schema.sql` cria as tabelas e categorias iniciais, mas contém `DROP TABLE`: use somente em um banco novo e vazio. Nunca reaplique esse arquivo em produção para atualizar código.

E-mail de confirmação e recuperação está pendente por decisão do proprietário. Novos usuários não conseguem concluir o cadastro até configurar `SMTP_USER` e `SMTP_PASS`. Google OAuth e IA também dependem de credenciais próprias. Veja [Configuração](docs/CONFIGURACAO.md).

## Android

Os scripts Capacitor permanecem disponíveis. O padrão de API em `scripts/build-android-web.mjs` ainda é o endereço legado; sobrescreva explicitamente ao gerar um APK para esta produção:

```powershell
$env:VITE_API_URL = 'https://selfmoney.lafdev.com.br'
$env:VITE_APP_BASE_PATH = '/'
npm.cmd run android:prepare
npm.cmd run android:open
```

Com Java, Android SDK e Gradle configurados para o projeto:

```powershell
npm.cmd run android:apk:debug
```

Saída esperada: `android/app/build/outputs/apk/debug/app-debug.apk`. Não foi gerado nem validado um novo APK nesta implantação.

## Configurações anteriores

Os scripts KingHost e PM2 foram preservados por compatibilidade, mas não gerenciam a produção atual. Os guias antigos estão identificados como históricos no [índice](docs/INDICE_DOCUMENTACAO.md).
