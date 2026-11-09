#!/usr/bin/env bash
# Apply only the resource adjustment authorized for the LucFlix media worker.
set -Eeuo pipefail
umask 0077
[[ $EUID == 0 ]]
unit=lucflix-media-worker.service
record=/etc/financialapp/resource-adjustment-20261109
install -d -m 700 "$record"
original_pid=$(systemctl show "$unit" -p MainPID --value)
[[ "$original_pid" != 0 ]]
if [[ ! -e "$record/worker-before-alignment.txt" ]]; then
  systemctl show "$unit" -p CPUQuotaPerSecUSec -p MemoryHigh -p MemoryMax -p DropInPaths > "$record/worker-before-alignment.txt"
fi
if [[ -d /run/systemd/system.control/$unit.d && ! -e "$record/runtime-properties-before-alignment" ]]; then
  cp -a "/run/systemd/system.control/$unit.d" "$record/runtime-properties-before-alignment"
fi
# An existing resources.conf sorts after the generated 50-* control drop-ins.
# Keep a dedicated, later-sorting persistent override; preserve that original file.
override="/etc/systemd/system/$unit.d/zz-vps-resource-balance.conf"
expected=$'# Owned by approved VPS resource balancing on 2026-11-09\n[Service]\nCPUQuota=200%\nMemoryHigh=2G'
if [[ -e "$override" && "$(cat "$override")" != "$expected" ]]; then
  echo 'Unexpected override contents; refusing to overwrite' >&2
  exit 1
fi
printf '%s\n' "$expected" > "$override"
chmod 644 "$override"
systemctl set-property "$unit" CPUQuota=200% MemoryHigh=2G
systemctl set-property --runtime "$unit" CPUQuota=200% MemoryHigh=2G
systemctl daemon-reload
[[ $(systemctl show "$unit" -p CPUQuotaPerSecUSec --value) == 2s ]]
[[ $(systemctl show "$unit" -p MemoryHigh --value) == 2147483648 ]]
[[ $(systemctl show "$unit" -p MemoryMax --value) == 4718592000 ]]
[[ $(systemctl show "$unit" -p MainPID --value) == "$original_pid" ]]
read -r quota period < /sys/fs/cgroup/system.slice/lucflix-media-worker.service/cpu.max
[[ "$quota" -eq $((period * 2)) ]]
cat > "$record/rollback-worker.sh" <<'EOF'
#!/usr/bin/env bash
set -eu
override=/etc/systemd/system/lucflix-media-worker.service.d/zz-vps-resource-balance.conf
if grep -qx '# Owned by approved VPS resource balancing on 2026-11-09' "$override"; then
  rm -- "$override"
fi
systemctl set-property lucflix-media-worker.service CPUQuota=300% MemoryHigh=3500M
systemctl set-property --runtime lucflix-media-worker.service CPUQuota=300% MemoryHigh=3500M
systemctl daemon-reload
EOF
chmod 700 "$record/rollback-worker.sh"
systemctl show "$unit" -p CPUQuotaPerSecUSec -p MemoryCurrent -p MemoryHigh -p MemoryMax -p MainPID
echo 'Verified after daemon-reload: quota 2 cores, soft memory 2 GiB, PID unchanged.'
