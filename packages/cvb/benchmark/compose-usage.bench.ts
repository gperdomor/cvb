import { compose as composeCVA, cva } from 'cva';
import { bench, describe } from 'vitest';
import { compose, cvb, RecipeSelection, RecipeVariantRecord } from '../src';
import { ClassProp } from '../src/lib/types.js';
import { benchOpts } from './helpers.js';
import { COMPOSE_CASES } from './test-cases.js';

const baseButton = cvb(COMPOSE_CASES.base);
const size = cvb(COMPOSE_CASES.size);
const shadow = cvb(COMPOSE_CASES.shadow);
const composed = compose(baseButton, size, shadow);

const baseButtonCVA = cva(COMPOSE_CASES.base);
const sizeCVA = cva(COMPOSE_CASES.size);
const shadowCVA = cva(COMPOSE_CASES.shadow);
const composedCVA = composeCVA(baseButtonCVA, sizeCVA, shadowCVA);

const shape = cvb(COMPOSE_CASES.shape);
const type = cvb(COMPOSE_CASES.type);
const shapeCVA = cva(COMPOSE_CASES.shape);
const typeCVA = cva(COMPOSE_CASES.type);

const complexComposed = compose(baseButton, size, shadow, shape, type);
const complexComposedCVA = composeCVA(baseButtonCVA, sizeCVA, shadowCVA, shapeCVA, typeCVA);

describe('Composition Usage', () => {
  describe('Simple', () => {
    describe.each<{ name: string; config?: RecipeSelection<RecipeVariantRecord> & ClassProp }>([
      { name: 'with defaults', config: undefined },
      { name: 'with overrides', config: { color: 'secondary' } },
      { name: 'with many overrides', config: { color: 'secondary', size: 'lg', shadow: 'md' } },
      { name: 'with class overrides', config: { color: 'primary', size: 'sm', className: 'custom-class' } },
    ])('$name', ({ config }) => {
      bench(
        'cvb',
        () => {
          composed(config);
        },
        benchOpts
      );

      bench(
        'cva',
        () => {
          composedCVA(config);
        },
        benchOpts
      );
    });
  });

  describe('Complex', () => {
    describe.each<{ name: string; config?: RecipeSelection<RecipeVariantRecord> & ClassProp }>([
      { name: 'with defaults', config: undefined },
      { name: 'with overrides', config: { color: 'secondary', size: 'lg' } },
      {
        name: 'with many overrides',
        config: { color: 'secondary', size: 'lg', shadow: 'md', shape: 'circle', type: 'outline' },
      },
      {
        name: 'with class overrides',
        config: { color: 'primary', size: 'sm', shape: 'circle', type: 'outline', className: 'custom-class' },
      },
    ])('$name', ({ config }) => {
      bench(
        'cvb',
        () => {
          complexComposed(config);
        },
        benchOpts
      );

      bench(
        'cva',
        () => {
          complexComposedCVA(config);
        },
        benchOpts
      );
    });
  });
});
