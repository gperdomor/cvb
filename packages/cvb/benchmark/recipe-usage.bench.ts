import { CVA, cva } from 'cva';
import { bench, describe } from 'vitest';
import { cvb, RecipeSelection, RecipeVariantRecord } from '../src';
import { ClassProp } from '../src/lib/types.js';
import { benchOpts } from './helpers.js';
import { TEST_CASES } from './test-cases.js';

const cvbSimple = cvb(TEST_CASES.simple);
const cvaSimple = cva(TEST_CASES.simple) as ReturnType<CVA>;

const cvbComplex = cvb(TEST_CASES.complex);
const cvaComplex = cva(TEST_CASES.complex) as ReturnType<CVA>;

const cvbLarge = cvb(TEST_CASES.large);
const cvaLarge = cva(TEST_CASES.large) as ReturnType<CVA>;

describe('Recipe Usage', () => {
  describe('Simple', () => {
    describe.each<{ name: string; config?: RecipeSelection<RecipeVariantRecord> & ClassProp }>([
      { name: 'with defaults', config: undefined },
      { name: 'with overrides', config: { color: 'secondary', size: 'lg' } },
      { name: 'with class overrides', config: { color: 'secondary', size: 'lg', class: 'custom-override-class' } },
    ])('$name', ({ config }) => {
      bench(
        'cvb',
        () => {
          cvbSimple(config);
        },
        benchOpts
      );

      bench(
        'cva',
        () => {
          cvaSimple(config);
        },
        benchOpts
      );
    });
  });

  describe('Complex', () => {
    describe.each<{ name: string; config?: RecipeSelection<RecipeVariantRecord> }>([
      { name: 'with defaults', config: undefined },
      {
        name: 'with overrides',
        config: { color: 'danger', size: 'lg', rounded: 'full', shadow: 'lg', disabled: true },
      },
      {
        name: 'with class overrides',
        config: { color: 'danger', size: 'lg', rounded: 'full', class: 'custom-class-override' },
      },
    ])('$name', ({ config }) => {
      bench(
        'cvb',
        () => {
          cvbComplex(config);
        },
        benchOpts
      );

      bench(
        'cva',
        () => {
          cvaComplex(config);
        },
        benchOpts
      );
    });
  });

  describe('Large', () => {
    describe.each<{ name: string; config?: RecipeSelection<RecipeVariantRecord> }>([
      { name: 'with defaults', config: undefined },
      {
        name: 'with overrides',
        config: { variant0: 'option0', variant5: 'option5', variant10: 'option7' },
      },
    ])('$name', ({ config }) => {
      bench(
        'cvb',
        () => {
          cvbLarge(config);
        },
        benchOpts
      );

      bench(
        'cva',
        () => {
          cvaLarge(config);
        },
        benchOpts
      );
    });
  });
});
