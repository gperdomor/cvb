import { tinybenchPrinter } from '@monstermann/tinybench-pretty-printer';
import { Bench } from 'tinybench';

export const printBenchmark = (name: string, bench: Bench) => {
  const cli = tinybenchPrinter
    .name({
      header: name,
    })
    .ops({ method: 'none' })
    .time({ method: 'mean' })
    .samples({ method: 'none' })
    .toCli(bench);
  console.log(cli);
};
