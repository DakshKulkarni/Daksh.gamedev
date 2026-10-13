import { mkdir, cp, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const name of ['index.html', 'style.css', 'App.js', 'scene.js', 'assets', 'vendor', 'THIRD_PARTY_NOTICES.md']) {
  await cp(path.join(root, name), path.join(dist, name), { recursive: true });
}
console.log('Built deployable static portfolio in dist/');
console.log('No package installation or runtime CDN is required.');
