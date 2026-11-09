#!/usr/bin/env bash
set -Eeuo pipefail
umask 0027
base=/srv/financialapp
release=${1:?Pass a 40-character Git commit SHA}
[[ "$release" =~ ^[a-f0-9]{40}$ ]] || exit 2
exec 9>"$base/incoming/deploy.lock"
flock -n 9 || { echo 'Another FinancialApp deployment is running'; exit 1; }
archive="$base/incoming/$release.tar.gz"
[[ -f "$archive" ]] || { echo 'Archive missing'; exit 1; }
target=$(mktemp -d "$base/releases/$release.XXXXXX")
chmod 750 "$target"
previous=$(readlink -f "$base/releases/current" || true)
tar -xzf "$archive" --no-same-owner -C "$target"
[[ -f "$target/FinancialApp.js" && -f "$target/public/index.html" ]] || exit 1
cd "$target"
nice -n 10 npm ci --omit=dev --no-audit --no-fund --ignore-scripts
node --check FinancialApp.js
ln -s "$target" "$base/releases/.current-$release"
mv -Tf "$base/releases/.current-$release" "$base/releases/current"
rollback() {
  if [[ -n "$previous" && -d "$previous" && "$previous" != "$target" ]]; then
    ln -s "$previous" "$base/releases/.rollback-$release"
    mv -Tf "$base/releases/.rollback-$release" "$base/releases/current"
    sudo -n /usr/bin/systemctl restart financialapp.service
    echo "Rolled back to $previous"
  else
    sudo -n /usr/bin/systemctl stop financialapp.service
    rm -f "$base/releases/current"
    echo 'First deployment failed; FinancialApp stopped'
  fi
}
trap rollback ERR
sudo -n /usr/bin/systemctl restart financialapp.service
healthy=false
for attempt in {1..30}; do
  if curl --fail --silent --max-time 3 http://127.0.0.1:21149/health/db >/dev/null &&
     curl --fail --silent --max-time 3 http://127.0.0.1:21149/ >/dev/null; then
    healthy=true
    break
  fi
  sleep 2
done
[[ "$healthy" == true ]]
trap - ERR
printf '%s\n' "$release" > "$base/releases/deployed-commit"
rm -f "$archive"
echo "FinancialApp deployed: $release"
