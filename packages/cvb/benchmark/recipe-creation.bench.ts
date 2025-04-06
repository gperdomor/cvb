import { cva as _cva } from 'cva';
import { bench, describe } from 'vitest';
import { cvb as _cvb } from '../src';
import { benchOpts } from './helpers';
import { TEST_CASES } from './test-cases';

// workaround for https://github.com/vitest-dev/vitest/issues/6543
const cva = _cva;
const cvb = _cvb;

describe('Recipe Creation', () => {
  describe('Simple', () => {
    bench(
      'cvb - simple recipe creation',
      () => {
        cvb(TEST_CASES.simple);
      },
      benchOpts
    );

    bench(
      'cva - simple recipe creation',
      () => {
        cva(TEST_CASES.simple);
      },
      benchOpts
    );
  });

  describe('Complex', () => {
    bench(
      'cvb - complex recipe creation',
      () => {
        cvb(TEST_CASES.complex);
      },
      benchOpts
    );

    bench(
      'cva - complex recipe creation',
      () => {
        cva(TEST_CASES.complex);
      },
      benchOpts
    );
  });

  describe('Large', () => {
    bench(
      'cvb - large recipe creation',
      () => {
        cvb(TEST_CASES.large);
      },
      benchOpts
    );

    bench(
      'cva - large recipe creation',
      () => {
        cva(TEST_CASES.large);
      },
      benchOpts
    );
  });
});
