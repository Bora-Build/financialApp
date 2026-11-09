# Regras de implantação na VPS

Instrução expressa do proprietário: é proibido modificar qualquer coisa relacionada aos projetos Zaralho e LucFlix existentes na VPS 103.204.193.6. Essa proibição inclui arquivos, dados, usuários, permissões, processos, serviços, configurações e automações desses projetos.

Inspeções desses projetos devem ser somente de leitura. Não reiniciar serviços existentes, não executar comandos globais de PM2/Docker e não alterar configurações globais para implantar o FinancialApp.

O FinancialApp deve ter diretórios, usuário de execução, credenciais, banco e serviço próprios. Seguir o padrão de releases e dados persistentes separados observado na VPS. Qualquer integração com o proxy compartilhado deve preservar integralmente as rotas existentes; se exigir modificar configuração compartilhada, explicar a mudança concreta e obter autorização específica antes de executá-la.

Nunca gravar senhas, chaves privadas ou tokens no repositório. Usar secrets do GitHub Actions e configuração protegida exclusiva do FinancialApp na VPS.

Autorizações específicas recebidas nesta implantação: acrescentar somente o bloco `selfmoney.lafdev.com.br` no Caddy e recarregar o Caddy após validação, preservando as rotas existentes; acrescentar somente a regra de firewall `ufw allow 443/tcp`. Essas operações foram concluídas. Não ampliam a autorização para outras mudanças globais ou nos projetos protegidos.
