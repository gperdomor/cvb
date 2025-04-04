import { tinybenchPrinter } from '@monstermann/tinybench-pretty-printer';
import { Bench } from 'tinybench';
import { SlotRecipeDefinition } from '../src';

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

export const toTvConfig = (config: SlotRecipeDefinition) => {
  return {
    slots: { ...config.base },
    variants: config.variants,
    compoundVariants: config.compoundVariants,
    defaultVariants: config.defaultVariants,
  };
};
