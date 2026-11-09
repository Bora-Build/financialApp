#!/usr/bin/env python3
"""Record numeric cgroup samples without credentials or changes to application services."""
import json
import os
from pathlib import Path
import subprocess
import time

DIRECTORY = Path('/var/lib/vps-resource-samples')
LOG = DIRECTORY / 'samples.jsonl'
SERVICES = ('financialapp.service', 'lucflix-api.service', 'lucflix-media-worker.service', 'pm2-root.service', 'caddy.service')

def command(args):
    return subprocess.check_output(args, text=True, timeout=10).strip()

def pairs(path):
    return {key: int(value) for key, value in (line.split() for line in path.read_text().splitlines())}

def measure(cgroup):
    base = Path('/sys/fs/cgroup' + cgroup)
    stats = pairs(base / 'memory.stat')
    return {
        'current': int((base / 'memory.current').read_text()),
        'peak': int((base / 'memory.peak').read_text()),
        'high': (base / 'memory.high').read_text().strip(),
        'max': (base / 'memory.max').read_text().strip(),
        'anon': stats.get('anon', 0), 'file': stats.get('file', 0),
        'inactive_file': stats.get('inactive_file', 0),
        'cpu': pairs(base / 'cpu.stat'), 'events': pairs(base / 'memory.events'),
    }

def main():
    result = {'timestamp': time.time(), 'groups': {}, 'errors': {}}
    for name in SERVICES:
        try:
            group = command(['systemctl', 'show', name, '-p', 'ControlGroup', '--value'])
            result['groups'][name] = measure(group)
        except Exception as error:
            result['errors'][name] = type(error).__name__
    try:
        names = command(['docker', 'ps', '--format', '{{.Names}}']).splitlines()
        for name in names:
            try:
                pid = command(['docker', 'inspect', '-f', '{{.State.Pid}}', name])
                group = next(line.split('::', 1)[1] for line in Path('/proc/' + pid + '/cgroup').read_text().splitlines() if line.startswith('0::'))
                result['groups'][name] = measure(group)
            except Exception as error:
                result['errors'][name] = type(error).__name__
    except Exception as error:
        result['errors']['docker'] = type(error).__name__
    result['host'] = {line.split(':', 1)[0]: int(line.split()[1]) * 1024 for line in Path('/proc/meminfo').read_text().splitlines() if line.split(':', 1)[0] in ('MemTotal', 'MemAvailable', 'MemFree', 'Cached', 'Buffers', 'SReclaimable', 'SwapFree')}
    fs = os.statvfs('/')
    result['disk'] = {'total': fs.f_blocks * fs.f_frsize, 'available': fs.f_bavail * fs.f_frsize}
    DIRECTORY.mkdir(mode=0o700, exist_ok=True)
    if LOG.exists() and LOG.stat().st_size >= 16 * 1024 * 1024:
        oldest = LOG.with_name(LOG.name + '.3')
        oldest.unlink(missing_ok=True)
        for suffix in (2, 1):
            previous = LOG.with_name(LOG.name + '.' + str(suffix))
            if previous.exists():
                previous.replace(LOG.with_name(LOG.name + '.' + str(suffix + 1)))
        LOG.replace(LOG.with_name(LOG.name + '.1'))
    with LOG.open('a') as output:
        output.write(json.dumps(result, separators=(',', ':')) + '\n')
    print(json.dumps({'groups': len(result['groups']), 'errors': result['errors']}))

if __name__ == '__main__':
    os.umask(0o077)
    main()
