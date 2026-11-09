# SelfMoney: deploy e operação na VPS

Produção: **https://selfmoney.lafdev.com.br**. Revisado em **09/11/2026** após um deploy real aprovado pelo GitHub Actions.

[Visão geral](../README.md) · [Índice](../docs/INDICE_DOCUMENTACAO.md) · [Diagnóstico](../docs/TROUBLESHOOTING.md)

## Isolamento obrigatório

Zaralho, LucFlix e monitoramento não fazem parte deste projeto. É expressamente proibido alterar seus arquivos, usuários, dados, permissões, processos, serviços ou automações. Nunca use comandos globais como reiniciar Docker, reiniciar todos os processos PM2 ou derrubar stacks de outros projetos.

O proprietário autorizou a inclusão do bloco exclusivo do SelfMoney no Caddy, sua validação e reload, e a liberação de `443/tcp` no UFW. As rotas existentes foram preservadas e os PIDs dos projetos protegidos permaneceram iguais durante a validação. Novas mudanças em infraestrutura compartilhada exigem avaliação das regras em [AGENTS.md](../AGENTS.md).

## Inventário

| Item | Configuração |
| --- | --- |
| SSH público | `103.204.193.6:28369` |
| Usuário de deploy | `financialapp-deploy` |
| Usuário de execução | `financialapp` |
| Serviço da aplicação | `financialapp.service` |
| Raiz exclusiva | `/srv/financialapp` |
| Porta da aplicação | `127.0.0.1:21149` |
| MySQL | Container exclusivo `financialapp-mysql`, imagem `mysql:8.4` |
| Banco / usuário do banco | `financialapp` / `financialapp` |
| Porta MySQL | `127.0.0.1:3310` |
| Persistência MySQL | `/srv/financialapp/shared/mysql` |
| Configuração da aplicação | `/etc/financialapp/app.env` |
| Configuração inicial MySQL | `/etc/financialapp/mysql.env` |
| Script instalado de deploy | `/srv/financialapp/bin/release` |
| Unidade systemd | `/etc/systemd/system/financialapp.service` |
| Bloco Caddy exclusivo | `/etc/caddy/selfmoney.caddy` |
| Limites da aplicação | 512 MiB e até 1 CPU |
| Limites do MySQL | 768 MiB e até 0,75 CPU |
| Cache InnoDB | 64 MiB, chunks de 16 MiB |

Os arquivos `.env` da VPS são restritos a root. O usuário de deploy não precisa lê-los: o systemd injeta o ambiente ao iniciar a aplicação. A chave de deploy permite sudo somente para reiniciar/parar `financialapp.service`.

Os limites acima são tetos, não reservas de RAM. O cache InnoDB foi reduzido de 128 para 64 MiB após medir o banco em 09/11/2026. O ajuste da instância existente foi persistido pelo MySQL e sobrevive ao restart do container; não depende de executar o bootstrap novamente. Veja [medições e manutenção](../docs/MEMORIA.md).

## DNS, TLS e proxy

Registro configurado na zona `lafdev.com.br`:

| Tipo | Nome | Valor |
| --- | --- | --- |
| A | `selfmoney` | `103.204.193.6` |

A Boa Host termina o HTTPS público e encaminha HTTP com o Host do domínio para a VPS. O certificado público é gerenciado nessa camada externa. A regra 443/tcp foi liberada no UFW, mas isso não substitui o encaminhamento/cadastro do domínio no painel da hospedagem.

O bloco atual é:

```caddyfile
# Boa Host terminates public HTTPS and forwards HTTP to this VPS.
http://selfmoney.lafdev.com.br {
    reverse_proxy 127.0.0.1:21149
}
```

O `Caddyfile` compartilhado importa `/etc/caddy/selfmoney.caddy`. Não volte a usar o domínio sem `http://` nesse bloco: o redirecionamento HTTPS automático interno gerou um ciclo e foi corrigido. A aplicação mantém `APP_URL=https://selfmoney.lafdev.com.br` e `APP_BASE_PATH=/`.

## Secrets do GitHub Actions

Os cinco repository secrets já foram cadastrados e validados. Para recriar ou revisar, abra [Settings → Secrets and variables → Actions](https://github.com/lucasandrefernando/financialApp/settings/secrets/actions) e use **New repository secret**:

| Nome exato | Valor |
| --- | --- |
| `VPS_HOST` | `103.204.193.6` |
| `VPS_PORT` | `28369` |
| `VPS_USER` | `financialapp-deploy` |
| `VPS_SSH_KEY` | Conteúdo completo da chave privada exclusiva, incluindo BEGIN/END |
| `VPS_KNOWN_HOSTS` | Linha da chave ED25519 do servidor, mostrada abaixo |

Identidade pública registrada na implantação:

```text
[103.204.193.6]:28369 ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILDC1dHA0dQ83MW0XXEOj8T58azJmIzQKE8NSkL5cuO5
```

Confirme a identidade por um canal confiável se houver reinstalação ou troca de chave da VPS; não aceite uma nova chave automaticamente. A chave pública acima não é segredo. A chave privada fica fora do Git, no computador de configuração, em `.deploy-private/financialapp_deploy`; `VPS_KNOWN_HOSTS` também foi fornecido em `.deploy-private/VPS_KNOWN_HOSTS.txt`. Esses caminhos locais não existem automaticamente em outros clones.

Copie o conteúdo dos arquivos, sem aspas adicionais. Não use senha de root nem credenciais do banco como secrets de deploy. O GitHub não permite reler o valor de secrets existentes; valide por uma execução ou substitua o valor conhecido.

## Fluxo automático

Arquivo versionado: [deploy.yml](../.github/workflows/deploy.yml). Cada push em `main`, inclusive mudanças de documentação, aciona:

1. Checkout e Node.js 24.
2. `npm ci` e `npm run lint`.
3. `npm run build`, que inclui TypeScript, com `VITE_APP_BASE_PATH=/` e API na mesma origem.
4. Pacote de `FinancialApp.js`, dependências declaradas, backend e frontend compilado em `public/`.
5. SSH com chave exclusiva e verificação estrita da identidade do servidor.
6. Envio do pacote para `/srv/financialapp/incoming/<sha>.tar.gz`.
7. Execução de `/srv/financialapp/bin/release <sha>`.

O script usa `flock`, cria uma pasta de release com SHA e sufixo único, instala dependências de produção com `--ignore-scripts`, troca atomicamente o link `releases/current` e reinicia somente `financialapp.service`. Testa a página e `/health/db` até 30 vezes, com pausa de dois segundos e timeout de três segundos por requisição. O tempo total pode exceder um minuto se houver timeouts.

Se a validação falhar após a troca, o script tenta restaurar a release anterior e reinicia somente o FinancialApp. Sem versão anterior, para apenas esse serviço. Falhas anteriores à troca deixam a release ativa intacta. O rollback é de código; não desfaz mudanças no banco.

O workflow não cria commits de build, não envia `.env`, não recria o banco e não reaplica o schema inicial. Os modelos em `deploy/` não são instalados novamente pelo workflow: atualizar `release.sh`, systemd ou Caddy exige uma operação separada e controlada no SelfMoney.

## Executar e conferir um deploy

Em [Actions](https://github.com/lucasandrefernando/financialApp/actions), selecione **Deploy SelfMoney to VPS → Run workflow → main → Run workflow**. Para repetir uma execução, use **Re-run all jobs**. O script permite uma nova release para o mesmo SHA.

[Execução de referência aprovada](https://github.com/lucasandrefernando/financialApp/actions/runs/42618478590), commit `86986834877aa8b69d0be046fbe56811e159a3ac`. Depois dela foram conferidos HTTPS 200, banco conectado e processos protegidos sem mudança.

Verificação pública:

```sh
curl --fail https://selfmoney.lafdev.com.br/health/db
curl -IL --max-redirs 5 https://selfmoney.lafdev.com.br/
```

`/health/db` deve informar `ok: true` e `db: up`. Isso não comprova login, e-mail, Google OAuth ou IA.

## SSH e observação

Com a chave exclusiva em um local protegido:

```sh
ssh -i /caminho/da/chave -p 28369 financialapp-deploy@103.204.193.6
```

Verifique a identidade do servidor antes de confiar no primeiro acesso. Na VPS:

```sh
systemctl status financialapp.service --no-pager
readlink -f /srv/financialapp/releases/current
cat /srv/financialapp/releases/deployed-commit
curl --fail http://127.0.0.1:21149/health/db
```

Como root, para diagnóstico ou intervenção específica autorizada:

```sh
journalctl -u financialapp.service -n 80 --no-pager
docker logs --tail 80 financialapp-mysql
systemctl restart financialapp.service
```

Não publique logs contendo tokens, dados pessoais ou credenciais. Não imprima os arquivos de ambiente em chamados ou no Actions.

## Banco, backup e recuperação

Foi criado um banco novo, com 12 tabelas iniciais e categorias, sem migrar dados antigos. Rotas de autenticação podem criar tabelas e ajustar colunas adicionais em tempo de execução. O `database/schema.sql` contém `DROP TABLE` e só deve ser usado uma vez em banco novo e vazio; nunca no deploy recorrente.

Não há backup agendado provisionado. Exemplo de backup manual exclusivo, executado como root na VPS:

Um backup manual já foi criado e validado pelo ajuste de memória em `/srv/financialapp/backups/before-memory-tuning-20261109T125607Z.sql.gz`. Isso não configura backup periódico nem substitui um teste de restauração.

```sh
set -euo pipefail
umask 0077
install -d -m 700 /srv/financialapp/backups
. /etc/financialapp/mysql.env
backup_file="/srv/financialapp/backups/financialapp-$(date -u +%Y%m%dT%H%M%SZ).sql.gz"
docker exec -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" financialapp-mysql \
  mysqldump -uroot --single-transaction --no-tablespaces --routines --triggers \
  --databases financialapp | gzip > "$backup_file"
gzip -t "$backup_file"
unset MYSQL_ROOT_PASSWORD MYSQL_PASSWORD
```

Esse exemplo documenta o procedimento; não é uma confirmação de backup executado. Guarde uma cópia protegida fora da VPS e valide a restauração em banco isolado. Não restaure sobre produção sem uma decisão explícita sobre os dados substituídos. Não copie o diretório MySQL em uso como substituto de um backup consistente.

Para reverter código, prefira um commit de reversão revisado em `main`, que aciona o mesmo workflow. Antes de futuras migrações, faça backup e verifique compatibilidade com a versão anterior; o rollback automático não restaura dados.

Releases antigas e tentativas interrompidas são preservadas. Monitore espaço em disco. Qualquer limpeza deve conferir caminhos absolutos dentro de `/srv/financialapp`, preservar `releases/current`, dados e backups, e não tocar nos outros projetos.

## Pendências funcionais

- E-mail adiado pelo proprietário: configurar `SMTP_USER`, `SMTP_PASS` e `MAIL_FROM`; cadastro e recuperação dependem disso.
- Google OAuth e IA: configurar credenciais próprias e testar os fluxos antes de considerá-los habilitados.
- Backup periódico e testes de restauração: ainda não provisionados.
- Android: sobrescrever a API legada no build; nenhum APK novo foi validado.

Veja [Configuração](../docs/CONFIGURACAO.md) e [Estado da implantação](../docs/ESTADO_ATUAL.md).

## Bootstrap e configurações legadas

[bootstrap.sh](bootstrap.sh) é um instalador único para root, com assets `deploy/`, `database/schema.sql` e `authorized_key.pub`. Aborta se detectar instalação/usuários existentes do FinancialApp. Não é um atualizador e não deve ser repetido nesta VPS. A importação do bloco do Caddy é uma etapa controlada separada.

Os scripts KingHost e PM2 continuam no repositório por compatibilidade; a produção atual usa systemd e o workflow VPS. Consulte o [índice](../docs/INDICE_DOCUMENTACAO.md) para referências históricas.
