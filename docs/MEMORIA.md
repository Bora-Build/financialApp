# Memória: diagnóstico e ajuste do SelfMoney

Registro de **09/11/2026**. [Índice](INDICE_DOCUMENTACAO.md) · [Operação](../deploy/README.md).

## Medição inicial

| Medida | Valor aproximado observado |
| --- | --- |
| RAM total da VPS | 7.941 MiB |
| RAM disponível | 6.131 MiB |
| Buffers/cache do Linux | 5.020 MiB |
| Swap em uso | 0 MiB |
| Pressão de memória PSI, médias recentes | 0 |
| Node do SelfMoney, RSS | 85 MiB |
| Serviço systemd, MemoryCurrent | 33–36 MiB |
| Container MySQL, Docker stats | 196 MiB |
| Dados e índices do banco | 0,55 MiB |
| Cache InnoDB antes | 128 MiB |
| Conexões MySQL simultâneas, pico observado | 2 |

São fotografias de momentos próximos, não um perfil de carga ou prova de ausência de vazamento ao longo do tempo. RSS, memória contabilizada pelo cgroup e Docker stats usam critérios diferentes; não some essas medidas como se fossem a mesma coisa. O estado observado não indicava escassez de memória.

O Linux usa RAM para cache de arquivos. Memória disponível é mais útil que apenas memória livre para avaliar margem: boa parte do cache pode ser recuperada. Não execute limpeza global de caches para reduzir o gráfico; isso afeta os demais sistemas e não corrige a origem de um vazamento. Veja [documentação do kernel sobre meminfo](https://docs.kernel.org/filesystems/proc.html).

## Ajuste aplicado

O banco pequeno e o pico baixo de conexões permitiram reduzir o buffer pool para **64 MiB**, com chunks de **16 MiB**. O script [tune-memory.sh](../deploy/tune-memory.sh) faz backup antes, grava os valores com `SET PERSIST_ONLY` e reinicia exclusivamente `financialapp-mysql`. Ele confere os valores efetivos, a quantidade de tabelas e a conectividade da aplicação.

Chunks menores são necessários para não arredondar o cache para o bloco antigo de 128 MiB. A variável de chunk é aplicada no startup; por isso foi necessário um restart somente desse banco. Referências oficiais: [redimensionamento InnoDB](https://dev.mysql.com/doc/refman/8.4/en/innodb-buffer-pool-resize.html) e [variáveis persistidas](https://dev.mysql.com/doc/refman/8.4/en/persisted-system-variables.html).

A primeira leitura do Docker após a alteração foi aproximadamente **184 MiB**, contra **196 MiB** antes: ganho observado de cerca de **12 MiB**. Não se deve prometer uma liberação de 64 MiB de RAM física apenas por reduzir em 64 MiB o cache configurado. Outros buffers, páginas residentes e o alocador também participam do consumo; leituras podem mudar com aquecimento e carga.

O Node já tinha consumo baixo; seu heap e os limites não foram reduzidos arbitrariamente. Permanecem os tetos de 512 MiB para a aplicação e 768 MiB para o banco, que não são memória pré-reservada. O buffer de 64 MiB precisa ser reavaliado se o volume de dados ou a carga crescer.

O backup manual verificado ficou em `/srv/financialapp/backups/before-memory-tuning-20261109T125607Z.sql.gz`, restrito a root. Zaralho e LucFlix mantiveram os mesmos PIDs após o ajuste. Nenhuma configuração desses projetos, do monitoramento, do Caddy ou do kernel foi alterada.

## Persistência e novas instalações

Na instância existente, os valores estão persistidos pelo MySQL no diretório de dados. O comando original do container ainda pode exibir 128 MiB; confira os valores SQL efetivos em vez de concluir pelo comando Docker. Não edite `mysqld-auto.cnf` manualmente.

[bootstrap.sh](../deploy/bootstrap.sh) passou a usar 64 MiB e chunks de 16 MiB em instalações novas. Não execute o bootstrap na VPS atual. O workflow publica a aplicação, mas não reaplica o script de tuning automaticamente.

`tune-memory.sh` é uma intervenção manual para root, com breve indisponibilidade do banco. Não precisa ser repetido em cada deploy. Só use em `financialapp-mysql`, com o ambiente exclusivo de `/etc/financialapp/mysql.env` e uma avaliação atual de carga. Se a verificação falhar, o script tenta restaurar os valores anteriores quando o banco ainda responde; falhas de inicialização exigem intervenção específica no FinancialApp.

## Acompanhar

Como root na VPS, sem imprimir credenciais:

```sh
free -m
cat /proc/pressure/memory
systemctl show financialapp.service -p MemoryCurrent -p MemoryPeak -p MemoryMax -p NRestarts
docker stats --no-stream financialapp-mysql
curl --fail http://127.0.0.1:21149/health/db
```

Para consultar os valores efetivos do banco:

```sh
. /etc/financialapp/mysql.env
docker exec -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" financialapp-mysql \
  mysql -uroot -e 'SELECT @@GLOBAL.innodb_buffer_pool_size, @@GLOBAL.innodb_buffer_pool_chunk_size;'
unset MYSQL_ROOT_PASSWORD MYSQL_PASSWORD
```

Se houver crescimento contínuo sob carga semelhante, correlacione RSS/cgroup, conexões, consultas, tráfego e logs ao longo do tempo antes de reduzir mais buffers. Os testes de saúde não são um benchmark completo da aplicação.
