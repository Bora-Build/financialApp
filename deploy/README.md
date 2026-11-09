# SelfMoney na VPS

Endereco planejado: https://selfmoney.lafdev.com.br

## Isolamento

- Raiz exclusiva: `/srv/financialapp`.
- Execucao: usuario `financialapp`, servico `financialapp.service`, porta local `21149`.
- Deploy: usuario `financialapp-deploy`, chave SSH exclusiva e sudo limitado a reiniciar/parar somente esse servico.
- MySQL 8.4 exclusivo: container `financialapp-mysql`, porta local `3310`, banco e usuario `financialapp`.
- Dados persistentes: `/srv/financialapp/shared/mysql`.
- Segredos: `/etc/financialapp/app.env` e `/etc/financialapp/mysql.env`, somente root pode ler.
- Limites: aplicacao 512 MiB/1 CPU; banco 768 MiB/0,75 CPU.
- Zaralho, LucFlix e monitoramento nao fazem parte deste deploy.

## DNS e acesso publico

Criar registro DNS `A`, nome `selfmoney`, valor `103.204.193.6`. Nao criar AAAA sem IPv6 funcional. As portas publicas 80 e 443 precisam chegar ao Caddy desta VPS para HTTPS automatico; verificar o encaminhamento no painel da hospedagem, pois a interface da VPS usa endereco privado.

O bloco exclusivo em `selfmoney.caddy` e importado pelo Caddy sem modificar as rotas dos outros projetos. O reload do Caddy foi autorizado expressamente pelo proprietario. A Boa Host termina o HTTPS publico e encaminha HTTP para a VPS: o bloco interno deve usar `http://selfmoney.lafdev.com.br`, evitando um ciclo de redirecionamento HTTPS. O certificado publico e gerenciado nessa camada externa.

A regra `443/tcp` foi liberada no UFW com autorizacao expressa. Nenhuma regra existente foi removida ou substituida.

## Secrets do GitHub Actions

Em Settings > Secrets and variables > Actions > New repository secret:

| Nome | Valor |
| --- | --- |
| `VPS_HOST` | `103.204.193.6` |
| `VPS_PORT` | `28369` |
| `VPS_USER` | `financialapp-deploy` |
| `VPS_SSH_KEY` | Chave privada exclusiva, fornecida localmente fora do Git |
| `VPS_KNOWN_HOSTS` | Linha completa da chave publica ED25519 do servidor, fornecida localmente |

Nenhuma senha de root ou do banco precisa ser cadastrada no GitHub.

## Fluxo de atualizacao

Cada push em `main` instala dependencias, roda lint, compila para `/`, empacota frontend e backend e envia por SSH com verificacao da chave do servidor. O workflow nao cria commits de build nem envia `.env`.

`release.sh` serializa deploys com flock, instala dependencias de producao sem scripts de instalacao, troca o link `releases/current` e reinicia somente `financialapp.service`. Confere a pagina e `/health/db`; se houver falha, restaura a release anterior e reinicia somente o FinancialApp. Sem versao anterior, para somente esse servico. O rollback cobre codigo, nao o banco. O schema inicial nunca e executado no deploy automatico.

Para testar depois de cadastrar os secrets: Actions > Deploy SelfMoney to VPS > Run workflow. Releases antigas sao preservadas; acompanhar espaco em disco antes de remover releases ou backups do proprio FinancialApp.

## Operacao (root)

```sh
systemctl status financialapp.service --no-pager
journalctl -u financialapp.service -n 80 --no-pager
curl --fail http://127.0.0.1:21149/health/db
docker logs --tail 80 financialapp-mysql
```

O banco foi criado vazio, com tabelas e categorias iniciais; nenhum dado de outro ambiente foi migrado. Fazer backup do banco antes de futuras migracoes. `database/schema.sql` contem DROP TABLE e so pode ser usado em um banco novo, vazio e exclusivo.

## Configuracoes pendentes

O proprietario escolheu adiar e-mail. Sem `SMTP_USER`/`SMTP_PASS` (Gmail e senha de aplicativo), confirmacao de cadastro e recuperacao de senha nao funcionam. Configurar tambem `MAIL_FROM` em `/etc/financialapp/app.env` quando disponivel e reiniciar somente `financialapp.service`.

Google OAuth (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) e IA (`GROQ_API_KEY`) tambem exigem credenciais proprias, caso sejam usados. Nunca reutilizar credenciais dos outros projetos. Para Google OAuth, cadastrar o callback exibido pelo backend, de acordo com o dominio definitivo.

## Bootstrap

`bootstrap.sh` e uma instalacao unica, executada como root com assets `deploy/`, `database/schema.sql` e `authorized_key.pub`. Aborta se detectar instalacao ou usuarios existentes do FinancialApp. Nao usar para atualizar a aplicacao; atualizacoes usam `release.sh`. Nao reiniciar Docker, PM2 ou outros servicos globalmente.
