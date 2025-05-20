import { consola } from 'consola';

if (process.argv.slice(2).some((arg) => arg.includes('package-lock.json'))) {
  consola.warn('⚠️  package-lock.json changed, please run `npm install` to ensure your packages are up to date. ⚠️');
}
