import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { Bench } from 'tinybench';
import { RecipeSelection, SlotRecipeRuntimeFn, SlotRecipeVariantRecord, defineConfig } from '../src';
import { printBenchmark, toTvConfig } from './helpers.js';
import { SLOT_TEST_CASES } from './test-cases.js';

const { svb } = defineConfig({ hooks: { onComplete: (str) => twMerge(str) } });

const svbSimple = svb(SLOT_TEST_CASES.simple);
const tvSimple = tv(toTvConfig(SLOT_TEST_CASES.simple) as any);

const svbComplex = svb(SLOT_TEST_CASES.complex);
const tvComplex = tv(toTvConfig(SLOT_TEST_CASES.complex) as any);

const svbLarge = svb(SLOT_TEST_CASES.large);
const tvLarge = tv(toTvConfig(SLOT_TEST_CASES.large) as any);

async function createBenchmark<S extends string, T extends SlotRecipeVariantRecord<S>>(
  name: string,
  tvFn: any, //ReturnType<TV>,
  svbFn: SlotRecipeRuntimeFn<S, T>,
  config?: RecipeSelection<T>
) {
  const benchmark = new Bench({
    time: 1000,
    setup: (_task, mode) => {
      // Run the garbage collector before warmup at each cycle
      if (mode === 'warmup' && typeof globalThis.gc === 'function') {
        globalThis.gc();
      }
    },
  })
    .add('TV', () => {
      tvFn(config);
    })
    .add('CVB', () => {
      svbFn(config);
    });

  await benchmark.run();

  printBenchmark(name, benchmark);
}

async function run() {
  await createBenchmark(
    'Simple recipe (defaults)',
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

  await createBenchmark(
    'Simple recipe with overrides (defaults)',
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

  await createBenchmark(
    'Complex recipe (defaults)',
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

  await createBenchmark(
    'Complex recipe (many overrides)',
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

  await createBenchmark(
    'Complex recipe (with class override)',
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

  await createBenchmark(
    'Large recipe',
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

  process.exit();
}

run();
