# Backend do SelfMoney

## API principal em produção

O entrypoint de produção é [FinancialApp.js](../FinancialApp.js), na raiz. Ele importa `backend/db.js`, middleware e rotas desta pasta, e também serve o frontend compilado.

Na VPS, `financialapp.service` executa `node FinancialApp.js` como usuário `financialapp`, ouvindo somente `127.0.0.1:21149`. O ambiente vem de `/etc/financialapp/app.env`, e o MySQL exclusivo atende em `127.0.0.1:3310`.

| Rota | Finalidade |
| --- | --- |
| `GET /health` | Saúde do processo HTTP |
| `GET /health/db` | Teste `SELECT 1` no banco; 503 se indisponível |
| `/api/auth` | Cadastro, login, tokens, perfil, e-mail, passkeys e Google OAuth |
| `/api/accounts`, `/api/sharing` | Contas e compartilhamento |
| `/api/categories`, `/api/income`, `/api/transactions` | Categorias e movimentações |
| `/api/budgets`, `/api/goals` | Orçamentos e metas |
| `/api/dashboard`, `/api/insights` | Resumos e insights |
| `/api/onboarding`, `/api/sync` | Onboarding e sincronização |
| `/api/media/:assetId` | Imagens de login permitidas pelo servidor |

As regras de autenticação e métodos disponíveis são definidos em cada arquivo de rota. O cliente autenticado envia `Authorization: Bearer <token>`. Não confunda saúde do banco com aprovação de todos os fluxos funcionais.

Para desenvolvimento, instale as dependências na raiz e siga [Início rápido](../docs/INICIO_RAPIDO.md). O servidor principal não carrega `.env` automaticamente. As variáveis e integrações estão em [Configuração](../docs/CONFIGURACAO.md).

## Proxy opcional de IA: implementação legada

`backend/src/index.js` é outro servidor Express, com seu próprio `backend/package.json`. Não está instalado como serviço na produção atual e não oferece a API financeira acima.

Para executá-lo separadamente em ambiente local:

```sh
cd backend
npm ci
npm run dev
```

Defina `GROQ_API_KEY` em um `.env` local ignorado ou no processo. Esse entrypoint usa `dotenv` e porta padrão **3001**, sobrescrita por `PORT`.

Rotas desse servidor separado: `GET /health`, `POST /api/ai/generate`, `POST /api/ai/insights` e `POST /api/ai/anomalies`. São endpoints de proxy de IA, não rotas automaticamente expostas pelo FinancialApp principal. Não publique esse proxy adicional na VPS sem um escopo próprio de implantação.

A API principal já possui `/api/insights` e sua integração opcional Groq. Veja [Arquitetura](../docs/ARQUITETURA.md) e [Operação](../deploy/README.md).
