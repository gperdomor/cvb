import { cva } from 'cva';
import { Bench } from 'tinybench';
import { cvb, RecipeDefinition } from '../src';
import { TEST_CASES } from './test-cases.js';

const addBenchmark = (bench: Bench, name: string, args: RecipeDefinition) => {
  bench
    .add(`${name} - CVA`, () => {
      cva(args);
    })
    .add(`${name} - CVB`, () => {
      cvb(args);
    });
};

export function registerRecipeCreationBenchmarks(bench: Bench) {
  addBenchmark(bench, 'Simple recipe creation', TEST_CASES.simple);

  addBenchmark(bench, 'Complex recipe creation', TEST_CASES.complex);

  addBenchmark(bench, 'Large recipe creation', TEST_CASES.large);
}
