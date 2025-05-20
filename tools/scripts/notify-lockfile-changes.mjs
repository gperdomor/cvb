import { consola } from 'consola';

if (process.argv.slice(2).some((arg) => arg.includes('pnpm-lock.yaml'))) {
  consola.warn('⚠️  pnpm-lock.yaml changed, please run `pnpm install` to ensure your packages are up to date. ⚠️');
}
