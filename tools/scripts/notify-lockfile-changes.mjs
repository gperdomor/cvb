import { consola } from 'consola';

if (process.argv.slice(2).some((arg) => arg.includes('pnpm-lock.yaml'))) {
  console.log('----------------------------------------------------------------------------------------------------');
  consola.warn('⚠️  pnpm-lock.yaml changed, please run `pnpm install` to ensure your packages are up to date. ⚠️');
  console.log('----------------------------------------------------------------------------------------------------');
}
