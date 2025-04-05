import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { Bench } from 'tinybench';
import { RecipeSelection, SlotRecipeVariantFn, SlotRecipeVariantRecord, defineConfig } from '../src';
import { toTvConfig } from './helpers.js';
import { SLOT_TEST_CASES } from './test-cases.js';

const { svb } = defineConfig({ hooks: { onComplete: (str) => twMerge(str) } });

const svbSimple = svb(SLOT_TEST_CASES.simple);
const tvSimple = tv(toTvConfig(SLOT_TEST_CASES.simple) as any);

const svbComplex = svb(SLOT_TEST_CASES.complex);
const tvComplex = tv(toTvConfig(SLOT_TEST_CASES.complex) as any);

const svbLarge = svb(SLOT_TEST_CASES.large);
const tvLarge = tv(toTvConfig(SLOT_TEST_CASES.large) as any);

const addBenchmark = <S extends string, T extends SlotRecipeVariantRecord<S>>(
  bench: Bench,
  name: string,
  tvFn: any, //ReturnType<TV>,
  svbFn: SlotRecipeVariantFn<S, T>,
  config?: RecipeSelection<T>
) => {
  bench
    .add(`${name} - TW`, () => {
      tvFn(config);
    })
    .add(`${name} - CVB`, () => {
      svbFn(config);
    });
};

export function registerSlotRecipeUsageBenchmarks(bench: Bench) {
  addBenchmark(
    bench,
    'Simple slot recipe (defaults)',
    (config: any) => {
      const { container, title, description } = tvSimple(config) as any;
      return {
        container: container(),
        title: title(),
        description: description(),
      };
    },
    svbSimple
  );

  addBenchmark(
    bench,
    'Simple slot recipe with overrides (defaults)',
    (config: any) => {
      const { container, title, description } = tvSimple(config) as any;
      return {
        container: container(),
        title: title(),
        description: description(),
      };
    },
    svbSimple,
    {
      color: 'secondary',
      size: 'lg',
    }
  );

  addBenchmark(
    bench,
    'Complex slot recipe (defaults)',
    (config: any) => {
      const { card, header, body, footer } = tvComplex(config) as any;
      return {
        card: card(),
        header: header(),
        body: body(),
        footer: footer(),
      };
    },
    svbComplex
  );

  addBenchmark(
    bench,
    'Complex slot recipe (many overrides)',
    (config: any) => {
      const { card, header, body, footer } = tvComplex(config) as any;
      return {
        card: card(),
        header: header(),
        body: body(),
        footer: footer(),
      };
    },
    svbComplex,
    {
      color: 'danger',
      size: 'lg',
      rounded: 'full',
      shadow: 'lg',
      disabled: true,
    }
  );

  addBenchmark(
    bench,
    'Complex slot recipe (with class override)',
    (config: any) => {
      const { card, header, body, footer } = tvComplex(config) as any;
      return {
        card: card(),
        header: header(),
        body: body(),
        footer: footer(),
      };
    },
    svbComplex,
    {
      color: 'success',
      size: 'md',
      class: 'custom-override-class',
    }
  );

  addBenchmark(
    bench,
    'Large slot recipe',
    (config: any) => {
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
      } = tvLarge(config) as any;
      return {
        container: container(),
        header: header(),
        toolbar: toolbar(),
        searchBar: searchBar(),
        content: content(),
        sidebar: sidebar(),
        main: main(),
        footer: footer(),
        title: title(),
        subtitle: subtitle(),
        navItem: navItem(),
        button: button(),
        icon: icon(),
        input: input(),
        label: label(),
        error: error(),
        card: card(),
        cardHeader: cardHeader(),
        cardBody: cardBody(),
        cardFooter: cardFooter(),
      };
    },
    svbLarge,
    {
      variant0: 'option0',
      variant5: 'option5',
      variant10: 'option7',
    }
  );
}
