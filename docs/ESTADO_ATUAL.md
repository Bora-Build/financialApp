# Estado da implantação

Registro de referência de **09/11/2026**. Este documento registra o que foi validado nessa data; consulte o Actions e os health checks para o estado ao vivo.

| Item | Situação verificada |
| --- | --- |
| Domínio | `selfmoney.lafdev.com.br`, DNS A para `103.204.193.6` |
| Acesso público | HTTPS válido, página com HTTP 200 |
| Aplicação | `financialapp.service`, usuário exclusivo, porta local 21149 |
| Banco | MySQL 8.4 exclusivo, conexão aprovada por `/health/db` |
| Memória do banco | Cache InnoDB reduzido para 64 MiB; chunks de 16 MiB, persistidos |
| Deploy automático | Cinco secrets cadastrados e deploy real aprovado |
| Validação no Actions | Instalação, lint, build, SSH, publicação e health checks aprovados |
| Isolamento | Zaralho e LucFlix continuaram ativos, com os mesmos PIDs durante a validação |
| Dados iniciais | Banco novo, 12 tabelas iniciais e categorias; sem migração de dados antigos |
| E-mail | Adiado pelo proprietário; cadastro e recuperação dependem dessa configuração |
| Google OAuth e IA | Credenciais e fluxos completos não validados nesta implantação |
| APK Android | Nenhum novo APK gerado ou testado |
| Backups agendados | Não provisionados; procedimento manual documentado |

[Execução de referência aprovada](https://github.com/lucasandrefernando/financialApp/actions/runs/42618478590), commit `86986834877aa8b69d0be046fbe56811e159a3ac`.

O erro de redirecionamento público foi resolvido usando HTTP no bloco interno do Caddy; o HTTPS público termina no proxy da Boa Host. A API e o banco foram testados novamente após o deploy automático.

A proteção dos projetos existentes está registrada em [AGENTS.md](../AGENTS.md). Os comandos operacionais e limites estão em [Operação na VPS](../deploy/README.md).

Após a implantação, foi feita uma análise de RAM: não havia swap em uso ou pressão de memória no momento da medição. O consumo do container MySQL caiu de aproximadamente 196 para 184 MiB na primeira leitura após o ajuste; o ganho não é uma projeção de 64 MiB. Um backup manual foi criado antes da intervenção. Consulte [Memória](MEMORIA.md) para contexto e limitações.
