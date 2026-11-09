#!/usr/bin/env bash
# One-time setup. Run as root with a directory containing deploy/, database/
# and authorized_key.pub. Existing project services are never restarted.
set -Eeuo pipefail
umask 0077
assets=$(realpath "${1:?Pass the setup assets directory}")
base=/srv/financialapp
[[ $EUID == 0 ]]
[[ ! -e "$base" && ! -e /etc/financialapp && ! -e /etc/systemd/system/financialapp.service ]]
! getent passwd financialapp >/dev/null
! getent passwd financialapp-deploy >/dev/null
! docker container inspect financialapp-mysql >/dev/null 2>&1
! ss -lnt | grep -qE ':(21149|3310)[[:space:]]'
test -s "$assets/authorized_key.pub"
test -s "$assets/database/schema.sql"
docker pull mysql:8.4
groupadd --system financialapp
useradd --system --gid financialapp --home-dir "$base" --shell /usr/sbin/nologin financialapp
useradd --create-home --gid financialapp --shell /bin/bash financialapp-deploy
# Permit only this service's lifecycle operations; no global service access.
printf 'financialapp-deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart financialapp.service, /usr/bin/systemctl stop financialapp.service\n' > /etc/sudoers.d/financialapp
chmod 440 /etc/sudoers.d/financialapp
visudo -cf /etc/sudoers.d/financialapp
install -d -m 755 "$base" "$base/bin" "$base/releases"
chown financialapp-deploy:financialapp "$base/releases"
chmod 2750 "$base/releases"
install -d -m 2750 -o financialapp-deploy -g financialapp "$base/incoming"
install -d -m 750 -o financialapp -g financialapp "$base/shared"
install -d -m 700 /etc/financialapp
install -m 755 "$assets/deploy/release.sh" "$base/bin/release"
install -m 644 "$assets/deploy/financialapp.service" /etc/systemd/system/financialapp.service
install -d -m 700 -o financialapp-deploy -g financialapp /home/financialapp-deploy/.ssh
{ printf 'restrict '; cat "$assets/authorized_key.pub"; } > /home/financialapp-deploy/.ssh/authorized_keys
chown financialapp-deploy:financialapp /home/financialapp-deploy/.ssh/authorized_keys
chmod 600 /home/financialapp-deploy/.ssh/authorized_keys
db_password=$(openssl rand -hex 32)
db_root_password=$(openssl rand -hex 32)
cat > /etc/financialapp/mysql.env <<EOF
MYSQL_ROOT_PASSWORD=$db_root_password
MYSQL_DATABASE=financialapp
MYSQL_USER=financialapp
MYSQL_PASSWORD=$db_password
EOF
cat > /etc/financialapp/app.env <<EOF
NODE_ENV=production
HOST=127.0.0.1
PORT=21149
APP_BASE_PATH=/
APP_URL=https://selfmoney.lafdev.com.br
DB_HOST=127.0.0.1
DB_PORT=3310
DB_USER=financialapp
DB_PASS=$db_password
DB_NAME=financialapp
JWT_SECRET=$(openssl rand -hex 48)
JWT_REFRESH_SECRET=$(openssl rand -hex 48)
WEBAUTHN_RP_NAME=SelfMoney
WEBAUTHN_RP_ID=selfmoney.lafdev.com.br
# Email, Google OAuth and AI credentials are intentionally not configured.
EOF
chmod 600 /etc/financialapp/*.env
install -d -m 700 "$base/shared/mysql"
docker run -d --name financialapp-mysql --restart unless-stopped \
  --memory 768m --cpus 0.75 --pids-limit 256 \
  --log-opt max-size=10m --log-opt max-file=3 \
  --env-file /etc/financialapp/mysql.env \
  -p 127.0.0.1:3310:3306 \
  --mount type=bind,source="$base/shared/mysql",target=/var/lib/mysql \
  mysql:8.4 --innodb-buffer-pool-size=67108864 --innodb-buffer-pool-chunk-size=16777216 --max-connections=30 --performance-schema=OFF
ready=false
for attempt in {1..90}; do
  if docker exec -e MYSQL_PWD="$db_root_password" financialapp-mysql mysql -h127.0.0.1 -uroot -Nse 'SELECT 1' >/dev/null 2>&1; then
    ready=true
    break
  fi
  sleep 2
done
[[ "$ready" == true ]]
# The schema contains DROP TABLE statements: run ONCE, against this new isolated database only.
docker exec -i -e MYSQL_PWD="$db_root_password" financialapp-mysql mysql -uroot --default-character-set=utf8mb4 financialapp < "$assets/database/schema.sql"
docker exec -e MYSQL_PWD="$db_password" financialapp-mysql mysql -ufinancialapp -Nse 'SELECT COUNT(*) FROM information_schema.tables WHERE table_schema="financialapp"'
systemctl daemon-reload
systemctl enable financialapp.service
echo 'FinancialApp isolated setup complete (proxy unchanged).'
printf '[103.204.193.6]:28369 '
cut -d ' ' -f 1,2 /etc/ssh/ssh_host_ed25519_key.pub
