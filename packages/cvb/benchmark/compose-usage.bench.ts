import { compose as composeCVA, CVA, cva } from 'cva';
import { Bench } from 'tinybench';
import { compose, cvb, RecipeSelection, RecipeVariantFn, RecipeVariantRecord } from '../src';
import { COMPOSE_CASES } from './test-cases.js';

const addBenchmark = <T extends RecipeVariantRecord>(
  bench: Bench,
  name: string,
  cvaFn: ReturnType<CVA>,
  cvbFn: RecipeVariantFn<T>,
  config?: RecipeSelection<T>
) => {
  bench
    .add(`${name} - CVA`, () => {
      cvaFn(config);
    })
    .add(`${name} - CVB`, () => {
      cvbFn(config);
    });
};

export function registerCompositionBenchmarks(bench: Bench) {
  const baseButton = cvb(COMPOSE_CASES.base);
  const size = cvb(COMPOSE_CASES.size);
  const shadow = cvb(COMPOSE_CASES.shadow);
  const composed = compose(baseButton, size, shadow);

  const baseButtonCVA = cva(COMPOSE_CASES.base);
  const sizeCVA = cva(COMPOSE_CASES.size);
  const shadowCVA = cva(COMPOSE_CASES.shadow);
  const composedCVA = composeCVA(baseButtonCVA, sizeCVA, shadowCVA);

  addBenchmark(bench, 'Simple composition (defaults)', composedCVA, composed);

  addBenchmark(bench, 'Simple composition (with overrides)', composedCVA, composed, { color: 'secondary' });

  addBenchmark(bench, 'Simple composition (with many overrides)', composedCVA, composed, {
    color: 'secondary',
    size: 'lg',
    shadow: 'md',
  });

  addBenchmark(bench, 'Simple composition (with custom class)', composedCVA, composed, {
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

  addBenchmark(bench, 'Complex composition (defaults)', complexComposedCVA, complexComposed);

  addBenchmark(bench, 'Complex composition (with overrides)', complexComposedCVA, complexComposed, {
    color: 'secondary',
  });

  addBenchmark(bench, 'Complex composition (with many overrides)', complexComposedCVA, complexComposed, {
    color: 'secondary',
    size: 'lg',
    shadow: 'md',
    shape: 'circle',
    type: 'outline',
  });

  addBenchmark(bench, 'Complex composition (with custom class)', complexComposedCVA, complexComposed, {
    color: 'primary',
    size: 'sm',
    shape: 'circle',
    type: 'outline',
    className: 'custom-class',
  });
}
