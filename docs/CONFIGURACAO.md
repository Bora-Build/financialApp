# Variáveis e integrações

[Índice](INDICE_DOCUMENTACAO.md) · [Operação](../deploy/README.md)

## Frontend: valores públicos de build

| Variável | Produção web | Uso |
| --- | --- | --- |
| `VITE_APP_BASE_PATH` | `/` | Rotas, assets e PWA na raiz do subdomínio |
| `VITE_API_URL` | vazio | API na mesma origem, em `/api` |

Tudo que recebe prefixo `VITE_` pode ser incluído no navegador. Nunca coloque senha do banco, JWT, SMTP ou chave de IA nessas variáveis. Para APK, sobrescreva `VITE_API_URL` com `https://selfmoney.lafdev.com.br`.

## Backend: `/etc/financialapp/app.env`

Arquivo da VPS protegido, lido pelo systemd. Os valores secretos foram gerados durante o bootstrap e não ficam no Git nem nos secrets do Actions.

| Variável | Valor ou finalidade |
| --- | --- |
| `NODE_ENV` | `production` |
| `HOST` | `127.0.0.1` |
| `PORT` | `21149` |
| `APP_BASE_PATH` | `/` |
| `APP_URL` | `https://selfmoney.lafdev.com.br` |
| `DB_HOST` / `DB_PORT` | `127.0.0.1` / `3310` |
| `DB_NAME` / `DB_USER` | `financialapp` / `financialapp` |
| `DB_PASS` | Senha própria do banco |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Segredos diferentes e aleatórios, já provisionados |
| `WEBAUTHN_RP_NAME` | `SelfMoney` |
| `WEBAUTHN_RP_ID` | `selfmoney.lafdev.com.br` |

Após editar esse arquivo como root, reinicie somente `financialapp.service`. Alterar segredos JWT invalida tokens existentes. Alterar o domínio de WebAuthn pode exigir novo registro das passkeys.

## E-mail: pendente

O backend usa o serviço Gmail do Nodemailer. Configure `SMTP_USER` com a conta de envio, `SMTP_PASS` com uma senha de aplicativo e `MAIL_FROM` com o remetente autorizado. O proprietário optou por adiar essa integração. Sem esses valores, confirmação de cadastro e recuperação de senha não funcionam; o deploy saudável não comprova envio de e-mail.

## Google OAuth: opcional

Configure `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` próprios do SelfMoney. O callback para o domínio atual é:

```text
https://selfmoney.lafdev.com.br/api/auth/google/callback
```

`GOOGLE_REDIRECT_URI` pode definir explicitamente esse endereço. Valide o fluxo completo após configurar o provedor; ele não foi testado nesta implantação.

## IA: opcional

A API principal oferece `/api/insights` autenticado e usa `GROQ_API_KEY` no servidor. Há respostas de fallback sem a integração; exibir dicas não prova que a API Groq foi chamada. O proxy legado em `backend/src/index.js` é separado e não foi implantado como serviço na VPS.

## Banco e implantação

`/etc/financialapp/mysql.env` pertence somente ao container exclusivo e contém a senha administrativa do MySQL e as credenciais iniciais do banco. Alterar o arquivo depois da inicialização não troca automaticamente senhas de usuários existentes no MySQL. Rotação exige atualizar o banco e o `app.env` de forma coordenada.

Os cinco secrets de transporte SSH do Actions estão documentados em [Operação na VPS](../deploy/README.md). Não são necessários secrets de banco ou de root no GitHub.
