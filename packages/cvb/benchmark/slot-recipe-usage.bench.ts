import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { bench, describe } from 'vitest';
import { RecipeSelection, SlotRecipeVariantRecord, defineConfig } from '../src';
import { SlotClassProp } from '../src/lib/types.js';
import { benchOpts, toTvConfig } from './helpers.js';
import { SLOT_TEST_CASES } from './test-cases.js';

const { svb } = defineConfig({ hooks: { onComplete: (str) => twMerge(str) } });

const svbSimple = svb(SLOT_TEST_CASES.simple);
const tvSimple = tv(toTvConfig(SLOT_TEST_CASES.simple) as any);

const svbComplex = svb(SLOT_TEST_CASES.complex);
const tvComplex = tv(toTvConfig(SLOT_TEST_CASES.complex) as any);

const svbLarge = svb(SLOT_TEST_CASES.large);
const tvLarge = tv(toTvConfig(SLOT_TEST_CASES.large) as any);

describe('Slot Recipe Usage', () => {
  describe('Simple', () => {
    describe.each<{ name: string; config?: RecipeSelection<SlotRecipeVariantRecord<string>> & SlotClassProp<string> }>([
      { name: 'with defaults', config: undefined },
      { name: 'with overrides', config: { color: 'secondary', size: 'lg' } },
    ])('$name', ({ config }) => {
      bench(
        'cvb',
        () => {
          svbSimple(config);
        },
        benchOpts
      );

      bench(
        'tv',
        () => {
          const { container, title, description } = tvSimple(config as any) as any;
          // Tailwind Variants build functions so we are executing them to force style resolution and get a proper comparison
          container();
          title();
          description();
        },
        benchOpts
      );
    });
  });

  describe('Complex', () => {
    describe.each<{ name: string; config?: RecipeSelection<SlotRecipeVariantRecord<string>> & SlotClassProp<string> }>([
      { name: 'with defaults', config: undefined },
      {
        name: 'with overrides',
        config: { size: 'lg', variant: 'secondary' },
      },
    ])('$name', ({ config }) => {
      bench(
        'cvb',
        () => {
          svbComplex(config);
        },
        benchOpts
      );

      bench(
        'tv',
        () => {
          const { card, header, body, footer } = tvComplex(config as any) as any;
          // Tailwind Variants build functions so we are executing them to force style resolution and get a proper comparison
          card();
          header();
          body();
          footer();
        },
        benchOpts
      );
    });
  });

  describe('Large', () => {
    describe.each<{ name: string; config?: RecipeSelection<SlotRecipeVariantRecord<string>> & SlotClassProp<string> }>([
      { name: 'with defaults', config: undefined },
      {
        name: 'with overrides',
        config: { theme: 'dark', size: 'lg', layout: 'comfortable' },
      },
    ])('$name', ({ config }) => {
      bench(
        'cvb',
        () => {
          svbLarge(config);
        },
        benchOpts
      );

      bench(
        'tv',
        () => {
          const {
            container,
            header,
            toolbar,
            searchBar,
            content,
            sidebar,
            main,
            footer,
            title,
            subtitle,
            navItem,
            button,
            icon,
            input,
            label,
            error,
            card,
            cardHeader,
            cardBody,
            cardFooter,
          } = tvLarge(config as any) as any;
          // Tailwind Variants build functions so we are executing them to force style resolution and get a proper comparison
          container();
          header();
          toolbar();
          searchBar();
          content();
          sidebar();
          main();
          footer();
          title();
          subtitle();
          navItem();
          button();
          icon();
          input();
          label();
          error();
          card();
          cardHeader();
          cardBody();
          cardFooter();
        },
        benchOpts
      );
    });
  });
});
