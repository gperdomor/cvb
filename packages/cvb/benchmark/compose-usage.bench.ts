import { compose as composeCVA, CVA, cva } from 'cva';
import { Bench } from 'tinybench';
import { compose, cvb, RecipeSelection, RecipeVariantRecord } from '../src';
import { printBenchmark } from './helpers.js';
import { COMPOSE_CASES } from './test-cases.js';

async function createBenchmark<T extends RecipeVariantRecord>(
  name: string,
  cvaFn: ReturnType<CVA>,
  cvbFn: any,
  config?: RecipeSelection<T>
) {
  const benchmark = new Bench({
    time: 5000,
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
  const baseButton = cvb(COMPOSE_CASES.base);
  const size = cvb(COMPOSE_CASES.size);
  const shadow = cvb(COMPOSE_CASES.shadow);
  const composed = compose(baseButton, size, shadow);

  const baseButtonCVA = cva(COMPOSE_CASES.base);
  const sizeCVA = cva(COMPOSE_CASES.size);
  const shadowCVA = cva(COMPOSE_CASES.shadow);
  const composedCVA = composeCVA(baseButtonCVA, sizeCVA, shadowCVA);

  await createBenchmark('Simple composition (defaults)', composedCVA, composed);

  await createBenchmark('Simple composition (with overrides)', composedCVA, composed, { color: 'secondary' });

  await createBenchmark('Simple composition (with many overrides)', composedCVA, composed, {
    color: 'secondary',
    size: 'lg',
    shadow: 'md',
  });

  await createBenchmark('Simple composition (with custom class)', composedCVA, composed, {
    color: 'primary',
    size: 'sm',
    className: 'custom-class',
  });

  // COMPLEX
  const shape = cvb(COMPOSE_CASES.shape);
  const type = cvb(COMPOSE_CASES.type);

  const shapeCVA = cva(COMPOSE_CASES.shape);
  const typeCVA = cva(COMPOSE_CASES.type);

  const complexComposed = compose(baseButton, size, shadow, shape, type);
  const complexComposedCVA = composeCVA(baseButtonCVA, sizeCVA, shadowCVA, shapeCVA, typeCVA);

  await createBenchmark('Complex composition (defaults)', complexComposedCVA, complexComposed);

  await createBenchmark('Complex composition (with overrides)', complexComposedCVA, complexComposed, {
    color: 'secondary',
  });

  await createBenchmark('Complex composition (with many overrides)', complexComposedCVA, complexComposed, {
    color: 'secondary',
    size: 'lg',
    shadow: 'md',
    shape: 'circle',
    type: 'outline',
  });

  await createBenchmark('Complex composition (with custom class)', complexComposedCVA, complexComposed, {
    color: 'primary',
    size: 'sm',
    shape: 'circle',
    type: 'outline',
    className: 'custom-class',
  });

  process.exit();
}

run();
