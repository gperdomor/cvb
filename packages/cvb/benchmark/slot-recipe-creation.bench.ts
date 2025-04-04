import { tv } from 'tailwind-variants';
import { Bench } from 'tinybench';
import { SlotRecipeDefinition, svb } from '../src';
import { printBenchmark, toTvConfig } from './helpers.js';
import { SLOT_TEST_CASES } from './test-cases.js';

async function createBenchmark(name: string, config: SlotRecipeDefinition) {
  const tvConfig = toTvConfig(config);

  console.log('==> tvConfig', JSON.stringify(tvConfig, null, 2));

  const benchmark = new Bench({
    time: 1000,
    setup: (_task, mode) => {
      // Run the garbage collector before warmup at each cycle
      if (mode === 'warmup' && typeof globalThis.gc === 'function') {
        globalThis.gc();
      }
    },
  })
    .add('TV', () => {
      tv(tvConfig as any);
    })
    .add('SVB', () => {
      svb(config);
    });

  await benchmark.run();

  printBenchmark(name, benchmark);
}

async function run() {
  await createBenchmark('Simple slot recipe creation', SLOT_TEST_CASES.simple);

  await createBenchmark('Complex slot recipe creation', SLOT_TEST_CASES.complex);

  await createBenchmark('Large slot recipe creation', SLOT_TEST_CASES.large);

  process.exit();
}

run();
