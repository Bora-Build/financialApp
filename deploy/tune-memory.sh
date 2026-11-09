#!/usr/bin/env bash
# Root-only tuning of the existing FinancialApp database; never touch other services.
set -Eeuo pipefail
umask 0077
[[ $EUID == 0 ]]
set -a
. /etc/financialapp/mysql.env
set +a
container=financialapp-mysql
mysql_query() {
  docker exec -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" "$container" mysql -h127.0.0.1 -uroot -Nse "$1"
}
wait_mysql() {
  for attempt in {1..45}; do
    if mysql_query 'SELECT 1' >/dev/null 2>&1; then return 0; fi
    sleep 2
  done
  return 1
}
original_pool=$(mysql_query 'SELECT @@GLOBAL.innodb_buffer_pool_size')
original_chunk=$(mysql_query 'SELECT @@GLOBAL.innodb_buffer_pool_chunk_size')
[[ "$original_pool" =~ ^[0-9]+$ && "$original_chunk" =~ ^[0-9]+$ ]]
install -d -m 700 /srv/financialapp/backups
backup_file="/srv/financialapp/backups/before-memory-tuning-$(date -u +%Y%m%dT%H%M%SZ).sql.gz"
docker exec -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" "$container" \
  mysqldump -uroot --single-transaction --no-tablespaces --routines --triggers \
  --databases financialapp | gzip > "$backup_file"
gzip -t "$backup_file"
echo "Backup verified: $backup_file"
tables_before=$(mysql_query "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='financialapp'")
rollback() {
  trap - ERR
  echo 'Tuning failed; attempting to restore previous memory settings.'
  if wait_mysql; then
    mysql_query "SET PERSIST_ONLY innodb_buffer_pool_chunk_size=$original_chunk; SET PERSIST_ONLY innodb_buffer_pool_size=$original_pool;"
    docker restart "$container" >/dev/null
    wait_mysql
  else
    echo 'Database not reachable: root intervention needed for FinancialApp only.' >&2
  fi
}
trap rollback ERR
# Chunk size is startup-only; persisted settings survive container restarts.
# A 16 MiB chunk allows a 64 MiB pool instead of rounding up to 128 MiB.
mysql_query 'SET PERSIST_ONLY innodb_buffer_pool_chunk_size=16777216; SET PERSIST_ONLY innodb_buffer_pool_size=67108864;'
docker restart "$container" >/dev/null
wait_mysql
[[ $(mysql_query 'SELECT @@GLOBAL.innodb_buffer_pool_size') == 67108864 ]]
[[ $(mysql_query 'SELECT @@GLOBAL.innodb_buffer_pool_chunk_size') == 16777216 ]]
[[ $(mysql_query "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='financialapp'") == "$tables_before" ]]
healthy=false
for attempt in {1..15}; do
  if curl --fail --silent --max-time 3 http://127.0.0.1:21149/health/db >/dev/null; then
    healthy=true
    break
  fi
  sleep 2
done
[[ "$healthy" == true ]]
trap - ERR
echo 'FinancialApp database healthy: 64 MiB buffer pool, 16 MiB chunks.'
docker stats --no-stream --format '{{.Name}} {{.MemUsage}}' "$container"
