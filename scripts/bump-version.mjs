import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const pkgPath = path.join(rootDir, 'package.json');
const swPath = path.join(rootDir, 'public', 'sw.js');

const mode = process.argv[2] || 'patch'; // 'patch' | 'minor' | 'major' | 'sync'

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const [major, minor, patch] = (pkg.version || '1.0.0').split('.').map(Number);

let nextVersion = pkg.version;
if (mode === 'major') {
  nextVersion = `${major + 1}.0.0`;
} else if (mode === 'minor') {
  nextVersion = `${major}.${minor + 1}.0`;
} else if (mode === 'patch') {
  nextVersion = `${major}.${minor}.${patch + 1}`;
}

if (nextVersion !== pkg.version) {
  pkg.version = nextVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf8');
  const updatedSw = swContent.replace(
    /const CACHE_NAME = 'awakening-v[^']+';/,
    `const CACHE_NAME = 'awakening-v${nextVersion}';`
  );
  if (updatedSw !== swContent) {
    fs.writeFileSync(swPath, updatedSw, 'utf8');
  }
}

console.log(`Version synced: v${nextVersion}`);
