import { CVA, cva } from 'cva';
import { Bench } from 'tinybench';
import { cvb, RecipeRuntimeFn, RecipeSelection, RecipeVariantRecord } from '../src';
import { printBenchmark } from './print.helper.js';
import { TEST_CASES } from './test-cases.js';

const cvbSimple = cvb(TEST_CASES.simple);
const cvaSimple = cva(TEST_CASES.simple) as ReturnType<CVA>;

const cvbComplex = cvb(TEST_CASES.complex);
const cvaComplex = cva(TEST_CASES.complex) as ReturnType<CVA>;

const cvbLarge = cvb(TEST_CASES.large);
const cvaLarge = cva(TEST_CASES.large) as ReturnType<CVA>;

async function createBenchmark<T extends RecipeVariantRecord>(
  name: string,
  cvaFn: ReturnType<CVA>,
  cvbFn: RecipeRuntimeFn<T>,
  config?: RecipeSelection<T>
) {
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
      cvaFn(config);
    })
    .add('CVB', () => {
      cvbFn(config);
    });

  await benchmark.run();

  printBenchmark(name, benchmark);
}

async function run() {
  await createBenchmark('Simple recipe (defaults)', cvaSimple, cvbSimple);

  await createBenchmark('Simple recipe with overrides (defaults)', cvaSimple, cvbSimple, {
    color: 'secondary',
    size: 'lg',
  });

  await createBenchmark('Complex recipe (defaults)', cvaComplex, cvbComplex);

  await createBenchmark('Complex recipe (many overrides)', cvaComplex, cvbComplex, {
    color: 'danger',
    size: 'lg',
    rounded: 'full',
    shadow: 'lg',
    disabled: true,
  });

  await createBenchmark('Complex recipe (with class override)', cvaComplex, cvbComplex, {
    color: 'success',
    size: 'md',
    class: 'custom-override-class',
  });

  await createBenchmark('Large recipe', cvaLarge, cvbLarge, {
    variant0: 'option0',
    variant5: 'option5',
    variant10: 'option7',
  });

  process.exit();
}

run();
