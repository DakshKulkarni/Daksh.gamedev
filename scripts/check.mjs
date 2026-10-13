import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML IDs');
for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  const ref = match[1];
  if (ref.startsWith('#')) {
    if (!ids.includes(ref.slice(1))) throw new Error(`Missing anchor ${ref}`);
  } else if (!/^(https?:|mailto:|tel:)/.test(ref)) {
    await access(path.join(root, ref.split(/[?#]/)[0]));
  }
}
for (const match of (await readFile(path.join(root, 'assets/fonts.css'), 'utf8')).matchAll(/url\(([^)]+)\)/g)) {
  await access(path.resolve(root, 'assets', match[1]));
}
for (const name of ['three.module.js', 'three.core.js', 'gsap.min.js', 'ScrollTrigger.min.js', 'lenis.min.js']) {
  if ((await readFile(path.join(root, 'vendor', name))).length < 1000) throw new Error(`Incomplete vendor file ${name}`);
}
console.log('Passed: local assets, fonts, internal navigation, unique IDs, and vendor integrity.');
