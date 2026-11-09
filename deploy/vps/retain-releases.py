#!/usr/bin/env python3
"""Keep active/pinned releases plus two recent inactive releases; dry-run by default."""
import argparse
import fcntl
import json
import os
from pathlib import Path
import re
import shutil
import sys
import time

PROJECTS = {
    'financialapp': (Path('/srv/financialapp/releases'), re.compile(r'[0-9a-f]{40}\.[A-Za-z0-9]+'), [Path('/srv/financialapp/releases/current')]),
    'lucflix': (Path('/srv/lucflix/releases'), re.compile(r'[0-9a-f]{40}'), [Path('/srv/lucflix/releases/current'), Path('/srv/lucflix/media-worker/current')]),
    'zaralho': (Path('/var/www/zaralho-releases'), re.compile(r'[0-9]+-[0-9]+-[0-9a-f]{40}'), [Path('/var/www/zaralho')]),
}
DATA_DIRS = ('processed', 'data', '.data', 'uploads', 'storage', 'backups', 'media')

def under(path, root):
    return path == root or root in path.parents

def process_references():
    refs = set()
    for proc in Path('/proc').iterdir():
        if not proc.name.isdigit():
            continue
        try:
            for name in ('cwd', 'exe', 'root'):
                try:
                    refs.add(Path(os.readlink(proc / name).removesuffix(' (deleted)')))
                except FileNotFoundError:
                    pass
            for fd in (proc / 'fd').iterdir():
                try:
                    target = os.readlink(fd).removesuffix(' (deleted)')
                    if target.startswith('/'):
                        refs.add(Path(target))
                except FileNotFoundError:
                    pass
            for line in (proc / 'maps').read_text().splitlines():
                fields = line.split(None, 5)
                if len(fields) == 6 and fields[5].startswith('/'):
                    refs.add(Path(fields[5].removesuffix(' (deleted)')))
        except (FileNotFoundError, ProcessLookupError):
            continue
        except PermissionError:
            raise RuntimeError('Cannot verify all process references; refuse cleanup')
    return refs

def pin_references():
    refs = set()
    for root, pattern, pins in PROJECTS.values():
        if root.is_symlink() or root.resolve() != root:
            raise RuntimeError(f'Unexpected release root: {root}')
        for pin in pins:
            if not pin.is_symlink():
                raise RuntimeError(f'Active release link missing: {pin}')
            resolved = pin.resolve(strict=True)
            if resolved.parent != root or not pattern.fullmatch(resolved.name):
                raise RuntimeError(f'Unexpected active release: {resolved}')
            refs.add(resolved)
        # Protect additional aliases alongside the active links.
        for entry in root.iterdir():
            if entry.is_symlink():
                refs.add(entry.resolve(strict=True))
    return refs

def dependency_references(releases):
    refs = set()
    for release in releases:
        for current, dirs, files in os.walk(release, followlinks=False):
            for name in dirs + files:
                entry = Path(current) / name
                if entry.is_symlink():
                    try:
                        refs.add(entry.resolve(strict=True))
                    except FileNotFoundError:
                        # A broken link is not a reference to an existing candidate.
                        pass
    return refs

def safe_candidate(path, root, pattern, refs):
    if path.is_symlink() or not path.is_dir() or path.parent != root:
        return False
    if not pattern.fullmatch(path.name) or path.resolve(strict=True) != path:
        return False
    if any(under(ref, path) for ref in refs):
        return False
    # Leave fresh releases alone, including artifacts of an in-progress deployment.
    if time.time() - path.stat().st_ctime < 3600:
        return False
    for line in Path('/proc/self/mountinfo').read_text().splitlines():
        mount = Path(line.split()[4].replace('\\040', ' ').replace('\\134', '\\'))
        if under(mount, path):
            return False
    # Never remove persistent data placed directly in a release by an old deploy.
    if any((path / name).exists() and not (path / name).is_symlink() for name in DATA_DIRS):
        return False
    # Cross-filesystem mounts and special files are not release artifacts.
    for current, dirs, files in os.walk(path, followlinks=False):
        if Path(current).stat().st_dev != root.stat().st_dev:
            return False
        for name in dirs + files:
            entry = Path(current) / name
            if not entry.is_symlink() and not (entry.is_dir() or entry.is_file()):
                return False
    return True

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    if os.geteuid() != 0:
        raise RuntimeError('Root is required to validate every process reference')
    if not shutil.rmtree.avoids_symlink_attacks:
        raise RuntimeError('Safe directory removal is unavailable')
    with open('/run/lock/vps-release-retention.lock', 'a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        with open('/srv/financialapp/incoming/deploy.lock', 'a') as deploy_lock:
            fcntl.flock(deploy_lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            refs = pin_references() | process_references()
            plan = []
            groups = []
            for project, (root, pattern, _) in PROJECTS.items():
                candidates = [p for p in root.iterdir() if p.is_dir() and not p.is_symlink() and pattern.fullmatch(p.name)]
                active = {p for p in candidates if any(under(ref, p) for ref in refs)}
                ordered = sorted((p for p in candidates if p not in active), key=lambda p: (p.stat().st_mtime_ns, p.stat().st_ctime_ns), reverse=True)
                keep = active | set(ordered[:2])
                groups.append((project, root, pattern, ordered, keep))
            # Follow cross-release dependencies from every retained release.
            kept = set().union(*(group[4] for group in groups))
            while True:
                refs |= dependency_references(kept)
                needed = {p for _, _, _, ordered, _ in groups for p in ordered if any(under(ref, p) for ref in refs)}
                if needed <= kept:
                    break
                kept |= needed
            for project, root, pattern, ordered, keep in groups:
                for path in ordered[2:]:
                    if path not in kept and safe_candidate(path, root, pattern, refs):
                        plan.append((project, path, path.stat().st_ino))
            print(json.dumps({'mode': 'apply' if args.apply else 'dry-run', 'candidates': [str(p) for _, p, _ in plan]}, indent=2), flush=True)
            if not args.apply:
                return
            for project, path, inode in plan:
                root, pattern, _ = PROJECTS[project]
                # Re-read all live references immediately before each deletion.
                refs = pin_references() | process_references()
                if path.stat().st_ino != inode or not safe_candidate(path, root, pattern, refs):
                    raise RuntimeError(f'Release changed or became referenced: {path}')
                shutil.rmtree(path)  # fd-based traversal; embedded symlinks are unlinked, never followed.
                print(f'Removed inactive release: {path}', flush=True)

if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'Retention refused/failed: {error}', file=sys.stderr)
        sys.exit(1)
