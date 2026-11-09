# Regras de implantação na VPS

Instrução expressa do proprietário: é proibido modificar qualquer coisa relacionada aos projetos Zaralho e LucFlix existentes na VPS 103.204.193.6. Essa proibição inclui arquivos, dados, usuários, permissões, processos, serviços, configurações e automações desses projetos.

Inspeções desses projetos devem ser somente de leitura. Não reiniciar serviços existentes, não executar comandos globais de PM2/Docker e não alterar configurações globais para implantar o FinancialApp.

O FinancialApp deve ter diretórios, usuário de execução, credenciais, banco e serviço próprios. Seguir o padrão de releases e dados persistentes separados observado na VPS. Qualquer integração com o proxy compartilhado deve preservar integralmente as rotas existentes; se exigir modificar configuração compartilhada, explicar a mudança concreta e obter autorização específica antes de executá-la.

Nunca gravar senhas, chaves privadas ou tokens no repositório. Usar secrets do GitHub Actions e configuração protegida exclusiva do FinancialApp na VPS.

Autorizações específicas recebidas nesta implantação: acrescentar somente o bloco `selfmoney.lafdev.com.br` no Caddy e recarregar o Caddy após validação, preservando as rotas existentes; acrescentar somente a regra de firewall `ufw allow 443/tcp`. Essas operações foram concluídas. Não ampliam a autorização para outras mudanças globais ou nos projetos protegidos.

## Estado operacional de referência (09/11/2026)

Produção: `https://selfmoney.lafdev.com.br`. O HTTPS público termina no proxy da Boa Host; o bloco exclusivo do Caddy recebe HTTP e deve usar `http://selfmoney.lafdev.com.br` para evitar ciclos de redirecionamento. Preservar essa configuração ao atualizar os modelos.

A aplicação usa `financialapp.service`, usuário `financialapp` e `127.0.0.1:21149`. O banco exclusivo está no container `financialapp-mysql`, acessível em `127.0.0.1:3310`, com dados em `/srv/financialapp/shared/mysql`. O deploy usa `financialapp-deploy` e releases em `/srv/financialapp/releases`.

Os cinco repository secrets foram cadastrados e o workflow VPS foi validado com sucesso. Cada push em `main`, inclusive documentação, aciona o deploy. O workflow não instala automaticamente os modelos de infraestrutura em `deploy/` e nunca deve reaplicar `database/schema.sql`, que contém DROP TABLE.

Não considerar saúde HTTP/banco como validação de todos os fluxos: e-mail foi adiado pelo proprietário; Google OAuth, IA, APK e backups agendados não foram validados/provisionados nesta implantação. Consultar `docs/ESTADO_ATUAL.md` e `deploy/README.md` antes de operar.

O cache InnoDB foi ajustado e persistido em 64 MiB, com chunks de 16 MiB, após medição e backup manual em 09/11/2026. Consultar `docs/MEMORIA.md` antes de novos ajustes. Limites systemd/Docker são tetos, não reservas; distinguir memória disponível, RSS, cgroup e cache do Linux. Não limpar caches globais nem alterar serviços de outros projetos para reduzir um gráfico de memória.
