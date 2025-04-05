import { CVA, cva } from 'cva';
import { Bench } from 'tinybench';
import { cvb, RecipeSelection, RecipeVariantFn, RecipeVariantRecord } from '../src';
import { TEST_CASES } from './test-cases.js';

const cvbSimple = cvb(TEST_CASES.simple);
const cvaSimple = cva(TEST_CASES.simple) as ReturnType<CVA>;

const cvbComplex = cvb(TEST_CASES.complex);
const cvaComplex = cva(TEST_CASES.complex) as ReturnType<CVA>;

const cvbLarge = cvb(TEST_CASES.large);
const cvaLarge = cva(TEST_CASES.large) as ReturnType<CVA>;

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

export function registerRecipeUsageBenchmarks(bench: Bench) {
  addBenchmark(bench, 'Simple recipe (defaults)', cvaSimple, cvbSimple);

  addBenchmark(bench, 'Simple recipe with overrides (defaults)', cvaSimple, cvbSimple, {
    color: 'secondary',
    size: 'lg',
  });

  addBenchmark(bench, 'Complex recipe (defaults)', cvaComplex, cvbComplex);

  addBenchmark(bench, 'Complex recipe (many overrides)', cvaComplex, cvbComplex, {
    color: 'danger',
    size: 'lg',
    rounded: 'full',
    shadow: 'lg',
    disabled: true,
  });

  addBenchmark(bench, 'Complex recipe (with class override)', cvaComplex, cvbComplex, {
    color: 'success',
    size: 'md',
    class: 'custom-override-class',
  });

  addBenchmark(bench, 'Large recipe', cvaLarge, cvbLarge, {
    variant0: 'option0',
    variant5: 'option5',
    variant10: 'option7',
  });
}
