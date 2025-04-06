import { tv as _tv } from 'tailwind-variants';
import { bench, describe } from 'vitest';
import { svb as _svb } from '../src';
import { benchOpts } from './helpers';
import { toTvConfig } from './helpers.js';
import { SLOT_TEST_CASES } from './test-cases.js';

// workaround for https://github.com/vitest-dev/vitest/issues/6543
const tv = _tv;
const svb = _svb;

describe('Slot Recipe Creation', () => {
  describe('Simple', () => {
    const tvConfig = toTvConfig(SLOT_TEST_CASES.simple);

    bench(
      'svb',
      () => {
        svb(SLOT_TEST_CASES.simple);
      },
      benchOpts
    );

    bench(
      'tv',
      () => {
        tv(tvConfig as any);
      },
      benchOpts
    );
  });

  describe('Complex', () => {
    const tvConfig = toTvConfig(SLOT_TEST_CASES.complex);

    bench(
      'svb',
      () => {
        svb(SLOT_TEST_CASES.complex);
      },
      benchOpts
    );

    bench(
      'tv',
      () => {
        tv(tvConfig as any);
      },
      benchOpts
    );
  });

  describe('Large', () => {
    const tvConfig = toTvConfig(SLOT_TEST_CASES.large);

    bench(
      'svb',
      () => {
        svb(SLOT_TEST_CASES.large);
      },
      benchOpts
    );

    bench(
      'tv',
      () => {
        tv(tvConfig as any);
      },
      benchOpts
    );
  });
});
