import { tv } from 'tailwind-variants';
import { Bench } from 'tinybench';
import { SlotRecipeDefinition, svb } from '../src';
import { toTvConfig } from './helpers.js';
import { SLOT_TEST_CASES } from './test-cases.js';

const addBenchmark = (bench: Bench, name: string, config: SlotRecipeDefinition) => {
  const tvConfig = toTvConfig(config);

  bench
    .add(`${name} - TW`, () => {
      tv(tvConfig as any);
    })
    .add(`${name} - CVB`, () => {
      svb(config);
    });
};

export function registerSlotRecipeCreationBenchmarks(bench: Bench) {
  addBenchmark(bench, 'Simple slot recipe creation', SLOT_TEST_CASES.simple);

  addBenchmark(bench, 'Complex slot recipe creation', SLOT_TEST_CASES.complex);

  addBenchmark(bench, 'Large slot recipe creation', SLOT_TEST_CASES.large);
}
