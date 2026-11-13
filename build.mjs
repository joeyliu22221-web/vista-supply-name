import { cp, mkdir, rm } from 'node:fs/promises';

const outputDirectory = new URL('./dist/', import.meta.url);

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  cp(new URL('./index.html', import.meta.url), new URL('./dist/index.html', import.meta.url)),
  cp(new URL('./in-the-field.html', import.meta.url), new URL('./dist/in-the-field.html', import.meta.url)),
  cp(new URL('./assets/', import.meta.url), new URL('./dist/assets/', import.meta.url), { recursive: true })
]);

console.log('Built static site in dist/');
