# Revisão de recursos da VPS

Revisão de **09/11/2026, aproximadamente 11h34–11h40 (America/Sao_Paulo)**. Escopo autorizado: leitura de todos os projetos, monitoramento e infraestrutura para dimensionar recursos. **Nenhum limite, processo, arquivo ou dado dos projetos existentes foi alterado nesta revisão.**

[Índice](INDICE_DOCUMENTACAO.md) · [Memória do FinancialApp](MEMORIA.md)

## Capacidade e janela observada

- 4 CPUs lógicas, 7.941 MiB de RAM utilizável e 2.047 MiB de swap, sem uso na revisão.
- Disco raiz ext4, aproximadamente 96 GiB; cerca de 38 GiB ocupados e 59 GiB disponíveis na leitura inicial.
- Prometheus iniciado em 06/11/2026 às 20h25 BRT. Cerca de 7.580 amostras de memória disponíveis na consulta de três dias; a retenção configurada de 30 dias não significa que já exista um mês de histórico.
- Maior uso de RAM do host na subconsulta de cinco minutos: 29,7%; percentil 95: 26,2%. A menor memória disponível nas amostras originais foi aproximadamente 5,44 GiB.
- CPU do host, média móvel de cinco minutos: máximo observado 79,2% e percentil 95 de 72,3% dos quatro núcleos.
- Não há séries históricas individuais de RAM/CPU dos projetos no Prometheus atual. Os picos individuais abaixo vêm de `memory.peak` dos cgroups, desde o início/recriação de cada grupo. Não são picos de 30 dias, percentis individuais ou garantia de carga máxima futura.

O pico do serviço systemd FinancialApp cobre somente a execução atual, iniciada às 09h59 BRT de 09/11. O MySQL foi reiniciado no ajuste de cache; seu pico também cobre uma janela curta. LucFlix API e worker têm grupos ativos desde 07/11 às 21h07 e 22h04 BRT; PM2 e Caddy desde 06/11 às 17h16 BRT. Deploys e reinícios podem reiniciar contadores de pico.

## Memória por componente

Unidade: **MiB**. Picos e valores atuais são de cgroups, incluindo cache de arquivos e memória de kernel atribuída ao grupo. Não confundir com RSS isolado ou Docker stats, que costuma descontar cache inativo.

| Componente | Atual na revisão | Pico registrado | Teto atual | Teto candidato | Folga sobre o pico |
| --- | ---: | ---: | ---: | ---: | ---: |
| FinancialApp Node | 40 | 40,1 | 512 | 256 | ~538% |
| FinancialApp MySQL | 185 | 195,0 | 768 | 384 | ~97% |
| Zaralho, grupo PM2 e filhos | 188 | 195,1 | Sem teto | 512 | ~162% |
| LucFlix API | 205 | 234,8 | Sem teto | 512 | ~118% |
| LucFlix worker e filhos | 3.500 | 3.502,2 | 4.500 | Manter 4.500 inicialmente | ~28% |
| Grafana | 461 | 512,0 | 512 | 768 | ~50% |
| Alloy | 93 | 94,3 | 384 | 192 | ~104% |
| Prometheus | 82 | 133,5 | 512 | 256 | ~92% |
| Caddy compartilhado | 84 | 108,0 | Sem teto | 256 | ~137% |

**Os candidatos não foram aplicados.** Eles são limites de segurança propostos a partir de picos observados, e não promessas de consumo permanente nem uma medição de capacidade máxima. Reduzir um teto acima do uso atual não libera automaticamente a diferença em RAM.

### Pontos que mudam a decisão

O worker LucFlix tinha aproximadamente 513 MiB de memória anônima, 2.891 MiB de cache de arquivos e cerca de 81 MiB de slab recuperável. Seu pico de 3,42 GiB inclui cache; por outro lado, o cgroup contabiliza esse cache no teto. Portanto, **não se deve colocar um teto de 512 MiB ou 1 GiB no worker com base apenas no RSS**.

Ele já tem `MemoryHigh=3500M`, `MemoryMax=4500M`, CPU limitada a três núcleos e prioridade relativa baixa. Havia 132.891 eventos `high` acumulados, sem eventos de OOM ou OOM kill. O contador registra pressão/reclaim no limite flexível, não quantidade de crashes. Baixar esse limite pode trocar RAM por mais leitura de disco e reduzir o desempenho das conversões.

O Grafana já registrou 222 eventos no limite máximo de memória, sem OOM kill. O teto de 512 MiB corta a observação do pico natural: não é possível concluir que 512 MiB seja seu máximo de demanda. Por isso a proposta mantém margem maior e exige acompanhamento.

MySQL, Alloy, Prometheus e os serviços consultados não registravam OOM kill nos cgroups na leitura. Isso não substitui um histórico de eventos externo.

### A soma dos tetos precisa caber

Os candidatos somam **7.636 MiB** (7,46 GiB). A VPS tem **7.941 MiB** utilizáveis: sobrariam apenas **305 MiB** se todos atingissem esses tetos ao mesmo tempo. Isso é insuficiente para uma reserva confortável de sistema operacional e deploy.

Logo, essa tabela não pode ser aplicada e anunciada como garantia de isolamento completo em 8 GB. Uma reserva de 1.024 MiB para o sistema e 512 MiB para operações temporárias levaria o orçamento a **9.172 MiB**, acima da capacidade atual.

Há duas estratégias possíveis:

1. **Manter os 8 GB e limitar o trabalho de mídia:** medir e testar menor concorrência, threads e cache do worker em conversões representativas. Só depois definir um teto menor e um orçamento agregado por projeto. Manter folga para o volume observado é obrigatório; não reduzir o hard limit abaixo do pico atual sem esse teste.
2. **Preservar o perfil atual de processamento e os tetos com folga:** dimensionar capacidade adicional suficiente para o orçamento simultâneo e a reserva. Essa é uma conta de capacidade, não uma indicação de compra ou de plano de hospedagem.

Enquanto houver RAM disponível, cache recuperável pode permanecer em uso. Esvaziar caches do kernel não cria isolamento nem corrige consumo de processos.

## CPU e prioridade

Amostra direta de aproximadamente 20 segundos, em núcleos equivalentes:

| Componente | Núcleos usados na amostra | Limite atual |
| --- | ---: | --- |
| LucFlix worker | 2,854 | 3 |
| LucFlix API | 0,001 | Sem quota; CPUWeight 200 |
| Zaralho/PM2 | 0,005 | Sem quota |
| FinancialApp Node | <0,001 | 1 |
| FinancialApp MySQL | 0,008 | 0,75 |
| Grafana | 0,015 | 0,35 |
| Alloy | 0,020 | 0,35 |
| Prometheus | 0,004 | 0,5 |
| Caddy | 0,001 | Sem quota |

Essa amostra não é o pico individual de cada aplicação; os picos históricos individuais não estão coletados. A carga dominante atual é o processamento de mídia. O worker e o Alloy tiveram throttling na amostra. Não reduzir quotas dos serviços interativos com base apenas nesse momento de baixo tráfego.

Próximo teste candidato: reduzir a concorrência/CPU de mídia de forma controlada, comparando tempo de conversão e latência dos sites. Preservar prioridade de API e proxy. Um teto agregado por projeto evita que filhos, novos workers ou futuras instâncias escapem do orçamento. A instalação de dependências durante deploy também precisa entrar no grupo de recursos do projeto; limitar só o serviço Node não a limita.

## Armazenamento

Medições arredondadas em GiB. Tamanhos mudaram alguns MiB durante a própria leitura, devido a conversões em andamento.

| Escopo | Uso observado | Proposta de orçamento, ainda sem quota |
| --- | ---: | ---: |
| FinancialApp completo | 0,83 | 4 |
| Zaralho releases + dados compartilhados | 5,05 | 8 |
| LucFlix completo | 19,3 | 40 |
| Dados de Grafana, Prometheus e Alloy | 0,43 | 6 |
| Sistema, logs, imagens e infraestrutura compartilhada | Medir continuamente; inclui itens abaixo | 15 |
| Reserva de disco livre | Cerca de 59 GiB disponíveis agora | Preservar pelo menos 20 |

Orçamentos propostos mais reserva somam 93 GiB, próximos da capacidade do disco raiz. Precisam ser recalculados com os bytes efetivos do filesystem antes de criar volumes ou quotas; há overhead e reserva ext4. A tabela não representa partições ou quotas já criadas.

### O que está crescendo

- O espaço indisponível ao usuário comum no filesystem aumentou aproximadamente **9,70 GiB nas últimas 24 horas**, conforme `size - avail` do node exporter. É uma diferença entre dois momentos, não uma taxa garantida para o futuro. Não foi demonstrado que todo esse crescimento pertence a um único projeto.
- LucFlix tem aproximadamente **17,95 GiB em `shared/processed`**, 0,18 GiB em dados e 1,07 GiB em cinco releases. A biblioteca processada é dado funcional: não apagar por retenção genérica.
- Zaralho tem **cinco releases de aproximadamente 1,01 GiB cada**, total de 5,04 GiB. Manter a atual e duas anteriores reduziria o conjunto para perto de 3,03 GiB, com economia potencial de aproximadamente 2,02 GiB, depois de conferir links e dependências. Nada foi removido.
- FinancialApp tem quatro releases de aproximadamente 160 MiB, total de 642 MiB, e banco em disco de aproximadamente 210 MiB. Manter atual e duas anteriores economizaria aproximadamente 160 MiB na fotografia atual. Nada foi removido.
- `/var/lib/containerd` ocupa aproximadamente **4,16 GiB**. É um armazenamento compartilhado de imagens; não atribuir tudo ao SelfMoney nem executar prune global. `/var/lib/docker` ocupa cerca de 0,43 GiB, incluindo volumes já contabilizados no monitoramento. Não somar novamente esses volumes ao fazer o inventário.
- `/var/log` ocupa cerca de **0,96 GiB**, dos quais o journal usa aproximadamente **822 MiB**. Alterar sua retenção é uma mudança global, não uma configuração isolada do FinancialApp.
- Os containers consultados já têm rotação de logs de 10 MB × 3 arquivos. Prometheus já tem retenção configurada de 30 dias e teto de 4 GiB para blocos TSDB; esse teto não é uma quota rígida de todo o volume, que também contém WAL e dados temporários.

### Proposta de organização

- Releases: atual + duas anteriores, sempre verificando o link ativo e excluindo diretórios de dados e backups da política. A limpeza deve ser específica de cada aplicação, nunca um comando global.
- Backups: retenção e cópia externa definidas por projeto; não presumir que backups antigos possam ser apagados sem confirmar política e restauração.
- LucFlix: orçamento para biblioteca, arquivos temporários e espaço de trabalho das conversões. Fazer o importador parar/adiar novos trabalhos ao atingir o limite preventivo; não apagar mídia funcional automaticamente.
- Alertas preventivos em 70%, críticos em 85% do orçamento de cada projeto, preservando reserva global.
- Quotas/volumes próprios para isolamento real de disco. O filesystem raiz atual não mostra quotas de projeto habilitadas no mount; só usar pastas diferentes não impede esgotamento global. Ativar quotas ou reorganizar volumes exige uma mudança de infraestrutura separada e validada.

## Implementação proposta em etapas

1. Coletar memória total, anônima, cache, CPU e disco por cgroup/projeto durante uma janela representativa. Cobrir tráfego de pico, conversões maiores, backups e deploy. O monitoramento atual permite histórico do host, mas não os percentis individuais necessários.
2. Validar o orçamento e a margem acima com o proprietário; o worker e o Grafana impedem aplicar uma tabela genérica de 256/512 MiB para todos.
3. Proteger APIs/proxy e limitar tarefas de fundo por projeto, incluindo deploys. Testar em uma alteração por vez, com captura de configuração, plano de reversão e verificação das rotas de cada sistema.
4. Implantar retenção específica de releases/logs e acompanhar crescimento. Separar dados persistentes de artefatos descartáveis.
5. Só depois fixar os tetos finais e quotas de disco, com uma reserva global que realmente caiba. Não prometer que uma aplicação nunca afetará outra apenas porque há pastas ou containers separados.

## Resultado desta revisão

Foi concluída uma auditoria de leitura com picos de cgroup e máximos/percentis do host, sem reinícios ou alterações nos projetos. As margens são candidatas, e as lacunas de medição foram explicitadas. A autorização para revisar todos os sistemas não foi interpretada como autorização para modificar seus dados ou aplicar limites aos projetos anteriormente protegidos.

## Etapa aplicada após aprovação do proprietário

Depois da aprovação, em 09/11/2026, foi executada a primeira etapa controlada:

- Worker LucFlix: CPU de 300% para 200%, memória flexível de 3.500 MiB para 2 GiB; teto rígido de 4.500 MiB preservado. Sem reinício do worker ou alteração da fila de uploads.
- Detectada e corrigida a precedência de um `resources.conf` existente. Os limites foram verificados após recarregar o systemd, com override próprio e reversão registrada.
- Retenção de releases: versão ativa e duas anteriores preservadas em cada projeto, com proteção de referências e dependências. Cinco releases antigas removidas, liberando **2,59 GiB**. Nenhum dado persistente, mídia ou backup removido.
- Retenção diária e amostras leves por componente instaladas. A coleta inicial registrou nove componentes sem erro e tem rotação limitada a aproximadamente 64 MiB.
- Os processos principais de FinancialApp, LucFlix API, LucFlix worker, Zaralho/PM2 e Caddy mantiveram os mesmos PIDs durante a execução; endpoints de API, banco e web responderam.

Os demais valores das tabelas acima continuam como candidatos, não limites aplicados. A memória inicial do worker caiu significativamente pela recuperação de cache, mas varia com as conversões e não deve ser anunciada como economia fixa de RAM física. Operação, reversão e limitações da retenção estão em [deploy/vps/README.md](../deploy/vps/README.md).
