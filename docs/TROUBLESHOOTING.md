# Diagnóstico e recuperação

[Índice](INDICE_DOCUMENTACAO.md) · [Operação na VPS](../deploy/README.md)

## ERR_TOO_MANY_REDIRECTS

A Boa Host termina HTTPS e encaminha HTTP para a VPS. O bloco exclusivo do SelfMoney no Caddy deve começar com `http://selfmoney.lafdev.com.br`. Usar o domínio sem esse prefixo ativou o redirecionamento HTTPS do Caddy e causou o ciclo já corrigido. Preserve `APP_URL=https://selfmoney.lafdev.com.br` no backend.

Verifique sem cookies:

```sh
curl -IL --max-redirs 5 https://selfmoney.lafdev.com.br/
```

A página deve terminar em `200`, sem repetir a mesma URL. Uma janela anônima ajuda a descartar redirecionamento antigo em cache, mas não corrige um loop no servidor.

## DNS, certificado ou HTTP 503 público

Confirme o registro `A`, nome `selfmoney`, valor `103.204.193.6`. O domínio é `lafdev.com.br`. Compare o acesso público com a API local:

```sh
curl --fail https://selfmoney.lafdev.com.br/health/db
curl --fail http://127.0.0.1:21149/health/db
```

O segundo comando roda na VPS. Se o interno funciona e o público mostra outro certificado ou 503, confira o cadastro/encaminhamento do domínio na Boa Host. Não desative a validação TLS para considerar o teste aprovado. Não altere as rotas dos outros projetos.

## Actions falha na chave SSH

Confira os cinco nomes exatos no [guia de secrets](../deploy/README.md#secrets-do-github-actions). A chave privada precisa incluir BEGIN/END e todas as linhas; `VPS_KNOWN_HOSTS` contém a chave pública do servidor, não a chave do usuário. Não cole o caminho de um arquivo no lugar do conteúdo.

Se houver erro de host key, valide a identidade da VPS por um canal confiável antes de atualizar o secret. Não use `StrictHostKeyChecking=no`. Se houver `Permission denied`, confira o usuário `financialapp-deploy`, a porta `28369` e a chave autorizada desse usuário.

## Actions falha após enviar o pacote

O usuário de deploy só pode reiniciar/parar `financialapp.service`. A página e `/health/db` precisam passar. Consulte os logs desse serviço e a conclusão do Actions; o script tenta restaurar a versão anterior se falhar depois da troca do link.

```sh
systemctl status financialapp.service --no-pager
journalctl -u financialapp.service -n 80 --no-pager
readlink -f /srv/financialapp/releases/current
cat /srv/financialapp/releases/deployed-commit
```

O marcador de commit registra o último deploy aprovado; alterações manuais fora desse fluxo não atualizam esse marcador.

## Banco indisponível

`/health` pode continuar saudável enquanto `/health/db` responde 503. Verifique somente o container e o ambiente próprios:

```sh
docker inspect --format '{{.State.Status}}' financialapp-mysql
docker logs --tail 80 financialapp-mysql
```

As credenciais ficam nos arquivos protegidos em `/etc/financialapp`. Não imprima esses arquivos em logs ou chamados. Não reinicie Docker globalmente nem use `docker compose down` de outro projeto. Nunca execute o schema inicial para resolver falha de conexão.

## Cadastro ou recuperação não envia e-mail

O envio Gmail está pendente. Configure `SMTP_USER`, `SMTP_PASS` e `MAIL_FROM` seguindo [Configuração](CONFIGURACAO.md). Não desative verificação de e-mail para contornar o problema.

## Desenvolvimento local

`npm run dev` inicia só o frontend; a API principal precisa de terminal separado. Use `npm.cmd` no PowerShell se `npm.ps1` estiver bloqueado. O proxy legado de IA usa porta padrão `3001` e não substitui `FinancialApp.js` em `21149`. Veja [Início rápido](INICIO_RAPIDO.md).
