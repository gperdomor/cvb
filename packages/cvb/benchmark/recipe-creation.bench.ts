import { cva } from 'cva';
import { Bench } from 'tinybench';
import { cvb, RecipeDefinition } from '../src';
import { printBenchmark } from './helpers.js';
import { TEST_CASES } from './test-cases.js';

async function createBenchmark(name: string, args: RecipeDefinition) {
  const benchmark = new Bench({
    time: 1000,
    setup: (_task, mode) => {
      // Run the garbage collector before warmup at each cycle
      if (mode === 'warmup' && typeof globalThis.gc === 'function') {
        globalThis.gc();
      }
    },
  })
    .add('CVA', () => {
      cva(args);
    })
    .add('CVB', () => {
      cvb(args);
    });

  await benchmark.run();

  printBenchmark(name, benchmark);
}

async function run() {
  await createBenchmark('Simple recipe creation', TEST_CASES.simple);

  await createBenchmark('Complex recipe creation', TEST_CASES.complex);

  await createBenchmark('Large recipe creation', TEST_CASES.large);

  process.exit();
}

run();
