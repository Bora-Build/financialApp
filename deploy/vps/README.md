# Recursos e retenção dos projetos na VPS

Implementação autorizada em **09/11/2026**, após a [revisão dos picos](../../docs/REVISAO_RECURSOS_VPS.md). Estes arquivos são modelos de administração para root; não são reaplicados pelo workflow de publicação do FinancialApp.

## Worker LucFlix

`set-worker-limits.sh` ajusta somente `lucflix-media-worker.service`, sem reinício:

| Recurso | Antes | Aplicado |
| --- | --- | --- |
| Quota de CPU | 300% (3 núcleos equivalentes) | 200% (2 núcleos equivalentes) |
| Memória flexível | 3.500 MiB | 2 GiB |
| Teto de memória | 4.500 MiB | Mantido em 4.500 MiB |

O limite flexível favorece a recuperação de cache do próprio worker. Não representa um teto rígido de 2 GiB: a memória pode ultrapassá-lo e o reclaim pode afetar a velocidade de conversão. A quota menor também pode aumentar o tempo de processamento. Não foi alterada a concorrência configurada de uploads ou interrompida a fila.

A verificação inicial identificou que `resources.conf` era lido depois dos drop-ins `50-*` gerados por `systemctl set-property`. A correção usa um arquivo exclusivo, `zz-vps-resource-balance.conf`, sem modificar o original. Os valores foram conferidos novamente após `daemon-reload`, inclusive em `cpu.max`. A ordenação segue as regras de [drop-ins do systemd](https://www.freedesktop.org/software/systemd/man/255/systemd.unit.html).

A amostra final de 20 segundos mediu **1,999 núcleo equivalente**; a memória contabilizada ficou entre **1,46 e 1,70 GiB** nas leituras de validação, sem OOM kill. São observações pontuais durante conversões, não uma promessa de consumo fixo ou de throughput. A redução da memória contabilizada foi principalmente de cache.

Registros e reversão: `/etc/financialapp/resource-adjustment-20261109/`. O script `rollback-worker.sh`, protegido para root, remove somente o override dessa intervenção e restaura CPU 300% e memória flexível 3.500 MiB, sem reiniciar processos. Ele não desfaz remoções de releases.

## Retenção de releases

Instalados:

- `/usr/local/lib/vps-release-retention.py`
- `vps-release-retention.service`
- `vps-release-retention.timer`

Escopo fixo: `/srv/financialapp/releases`, `/srv/lucflix/releases` e `/var/www/zaralho-releases`. Preserva a versão ativa de cada link, duas releases inativas recentes e dependências adicionais necessárias. Se API e worker apontarem para versões diferentes, ambas permanecem protegidas. Releases novas, com menos de uma hora, não são removidas.

A rotina recusa caminhos inesperados, roots com symlinks, mounts dentro de releases e releases com diretórios persistentes reais conhecidos. Verifica referências de processos e dependências entre versões. Links internos para dados são removidos somente como links quando uma release antiga é excluída; o destino não é percorrido.

Há um lock global da retenção e um lock compartilhado com o deploy do FinancialApp. Os deploys de LucFlix e Zaralho ainda não compartilham formalmente esse lock; a rotina verifica novamente referências antes de cada remoção, mas uma operação administrativa concorrente pode criar uma corrida. **Antes de rollback manual ou alteração de links de LucFlix/Zaralho, pare o timer, aguarde a rotina terminar e faça a operação em janela controlada.** Para integrar novos deploys, use o mesmo `/run/lock/vps-release-retention.lock` em todo o período de manipulação de releases desses projetos.

Como root:

```sh
# Simulação: não remove arquivos.
python3 /usr/local/lib/vps-release-retention.py

# Consultar execução e agenda.
systemctl status vps-release-retention.service --no-pager
systemctl list-timers vps-release-retention.timer --no-pager
journalctl -u vps-release-retention.service -n 80 --no-pager
```

Agendada diariamente às **04h30 UTC** (01h30 em São Paulo), com atraso aleatório de até dez minutos. A rotina usa até 25% de um núcleo, limite de 128 MiB e prioridade baixa de CPU/I/O. Ela não impõe quota de disco, não limpa imagens Docker, não altera o journal global e não apaga mídia, dados ou backups.

Primeira execução: cinco releases antigas removidas, liberando **2.785.857.536 bytes (2,59 GiB)**. Os três sistemas mantiveram os mesmos processos principais e responderam após a limpeza. Testes com dados sintéticos validaram retenção da ativa + duas anteriores, preservação de dados por symlink e dependência entre releases.

## Histórico leve por componente

Instalados:

- `/usr/local/lib/vps-resource-sample.py`
- `vps-resource-sample.service`
- `vps-resource-sample.timer`

O timer registra aproximadamente uma amostra por minuto em `/var/lib/vps-resource-samples/samples.jsonl`, restrito a root. Inclui memória total do cgroup, anônima, cache, eventos de pressão/OOM, CPU acumulada, limites e memória/disco do host. Abrange cinco serviços e os containers ativos; não lê nem registra credenciais ou argumentos de processos.

Os arquivos rodam em até quatro segmentos de cerca de 16 MiB cada (~64 MiB no total, mais uma linha por rotação). A rotina tem teto de 64 MiB e quota de 10% de um núcleo. Isso não altera o Grafana, Alloy ou Prometheus existentes. O job de amostragem não limita o consumo das aplicações por si só.

```sh
systemctl list-timers vps-resource-sample.timer --no-pager
journalctl -u vps-resource-sample.service -n 20 --no-pager
```

Para suspender uma dessas automações, desabilite somente seu timer. Não reinicie globalmente PM2, Docker ou os serviços dos projetos.

## Próxima avaliação

Usar as amostras para validar conversões maiores e tráfego de pico antes de reduzir tetos rígidos. Permanecem candidatos os limites dos demais serviços; nenhuma aplicação interativa recebeu um teto menor nesta etapa. Os orçamentos de disco são propostas, não quotas já instaladas. Biblioteca de mídia, backups e armazenamento compartilhado exigem políticas próprias antes de novas limpezas.
