/* eslint-disable no-constant-binary-expression */
import { compose, cvb, cx, defineConfig, svb } from './cvb.js';
import { CXOptions, RecipeDefinition, SlotRecipeDefinition, SlotVariantProps, VariantProps } from './types.js';

describe('cx', () => {
  describe.each<CXOptions>([
    [null, ''],
    [undefined, ''],
    [false && 'foo', ''],
    [true && 'foo', 'foo'],
    [['foo', undefined, 'bar', undefined, 'baz'], 'foo bar baz'],
    [
      [
        'foo',
        [
          undefined,
          ['bar'],
          [undefined, ['baz', 'qux', 'quux', 'quuz', [[[[[[[[['corge', 'grault']]]]], 'garply']]]]]],
        ],
      ],
      'foo bar baz qux quux quuz corge grault garply',
      [['foo', [1 && 'bar', { baz: false, bat: null }, ['hello', ['world']]], 'cya'], 'foo bar hello world cya'],
    ],
  ])('cx(%o)', (options, expected) => {
    test(`returns ${expected}`, () => {
      expect(cx(options)).toBe(expected);
    });
  });
});

describe('compose', () => {
  test('should merge into a single component', () => {
    const box = cvb({
      variants: {
        shadow: {
          sm: 'shadow-sm',
          md: 'shadow-md',
        },
      },
      defaultVariants: {
        shadow: 'sm',
      },
    });

    const stack = cvb({
      variants: {
        gap: {
          unset: null,
          1: 'gap-1',
          2: 'gap-2',
          3: 'gap-3',
        },
      },
      defaultVariants: {
        gap: 'unset',
      },
    });

    const card = compose(box, stack);

    expectTypeOf(card).toBeFunction();
    expectTypeOf(card).parameter(0).toMatchTypeOf<
      | {
          shadow?: 'sm' | 'md' | undefined;
          gap?: 'unset' | 1 | 2 | 3 | undefined;
        }
      | undefined
    >();

    expect(card()).toBe('shadow-sm');
    expect(card({ class: 'adhoc-class' })).toBe('shadow-sm adhoc-class');
    expect(card({ className: 'adhoc-class' })).toBe('shadow-sm adhoc-class');
    expect(card({ shadow: 'md' })).toBe('shadow-md');
    expect(card({ gap: 2 })).toBe('shadow-sm gap-2');
    expect(card({ shadow: 'md', gap: 3, class: 'adhoc-class' })).toBe('shadow-md gap-3 adhoc-class');
    expect(card({ shadow: 'md', gap: 3, className: 'adhoc-class' })).toBe('shadow-md gap-3 adhoc-class');
  });
});

const toCompoundVariantsWithClassName = <
  T extends RecipeDefinition['compoundVariants'] | SlotRecipeDefinition['compoundVariants']
>(
  compoundVariants: T
): T => {
  return (compoundVariants?.map(({ class: className, ...rest }) => ({ ...rest, className })) ?? []) as T;
};

describe('cvb', () => {
  const buttonConfig: Required<RecipeDefinition> = {
    base: 'button font-semibold border rounded',
    variants: {
      intent: {
        unset: null,
        primary: 'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600',
        secondary: 'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
        warning: 'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600',
        danger: [
          'button--danger',
          [1 && 'bg-red-500', { baz: false, bat: null }, ['text-white', ['border-transparent']]],
          'hover:bg-red-600',
        ],
      },
      disabled: {
        unset: null,
        true: 'button--disabled opacity-050 cursor-not-allowed',
        false: 'button--enabled cursor-pointer',
      },
      size: {
        unset: null,
        small: 'button--small text-sm py-1 px-2',
        medium: 'button--medium text-base py-2 px-4',
        large: 'button--large text-lg py-2.5 px-4',
      },
      m: {
        unset: null,
        0: 'm-0',
        1: 'm-1',
      },
    },
    compoundVariants: [
      {
        intent: 'primary',
        size: 'medium',
        class: 'button--primary-medium uppercase',
      },
      {
        intent: 'warning',
        disabled: false,
        class: 'button--warning-enabled text-gray-800',
      },
      {
        intent: 'warning',
        disabled: true,
        class: ['button--warning-disabled', [1 && 'text-black', { baz: false, bat: null }]],
      },
    ],
    defaultVariants: {
      disabled: false,
      intent: 'primary',
      size: 'medium',
    },
  };

  const buttonConfigWithArray: Required<RecipeDefinition> = {
    base: [buttonConfig.base],
    variants: {
      intent: {
        unset: null,
        primary: ['button--primary', 'bg-blue-500', 'text-white', 'border-transparent', 'hover:bg-blue-600'],
        secondary: ['button--secondary', 'bg-white', 'text-gray-800', 'border-gray-400', 'hover:bg-gray-100'],
        warning: ['button--warning', 'bg-yellow-500', 'border-transparent', 'hover:bg-yellow-600'],
        danger: [
          'button--danger',
          [1 && 'bg-red-500', { baz: false, bat: null }, ['text-white', ['border-transparent']]],
          'hover:bg-red-600',
        ],
      },
      disabled: {
        unset: null,
        true: ['button--disabled', 'opacity-050', 'cursor-not-allowed'],
        false: ['button--enabled', 'cursor-pointer'],
      },
      size: {
        unset: null,
        small: ['button--small', 'text-sm', 'py-1', 'px-2'],
        medium: ['button--medium', 'text-base', 'py-2', 'px-4'],
        large: ['button--large', 'text-lg', 'py-2.5', 'px-4'],
      },
      m: {
        unset: null,
        0: 'm-0',
        1: 'm-1',
      },
    },
    compoundVariants: [
      {
        intent: 'primary',
        size: 'medium',
        class: ['button--primary-medium', 'uppercase'],
      },
      {
        intent: 'warning',
        disabled: false,
        class: ['button--warning-enabled', 'text-gray-800'],
      },
      {
        intent: 'warning',
        disabled: true,
        class: ['button--warning-disabled', [1 && 'text-black', { baz: false, bat: null }]],
      },
    ],
    defaultVariants: buttonConfig.defaultVariants,
  };

  describe('without base', () => {
    describe('without anything', () => {
      test('empty', () => {
        const example = cvb({ variants: {} });
        expect(example()).toBe('');
        expect(
          example({
            // @ts-expect-error: This is not a valid variant and should be ignored
            aCheekyInvalidProp: 'lol',
          })
        ).toBe('');
        expect(example({ class: 'adhoc-class' })).toBe('adhoc-class');
        expect(example({ className: 'adhoc-className' })).toBe('adhoc-className');
        expect(
          example({
            class: 'adhoc-class',
            // @ts-expect-error: Only one of class or className is allowed, with class taking precedence
            className: 'adhoc-className',
          })
        ).toBe('adhoc-class');
      });

      test('undefined', () => {
        // @ts-expect-error props is invalid
        const example = cvb(undefined);
        expect(example()).toBe('');
        expect(
          example({
            aCheekyInvalidProp: 'lol',
          })
        ).toBe('');
        expect(example({ class: 'adhoc-class' })).toBe('adhoc-class');
        expect(example({ className: 'adhoc-className' })).toBe('adhoc-className');
        expect(
          example({
            className: 'adhoc-className',
          })
        ).toBe('adhoc-className');
      });

      test('null', () => {
        // @ts-expect-error props is invalid
        const example = cvb(null);
        expect(example()).toBe('');
        expect(
          example({
            aCheekyInvalidProp: 'lol',
          })
        ).toBe('');
        expect(example({ class: 'adhoc-class' })).toBe('adhoc-class');
        expect(example({ className: 'adhoc-className' })).toBe('adhoc-className');
        expect(
          example({
            class: 'adhoc-class',
            // @ts-expect-error: Only one of class or className is allowed, with class taking precedence
            className: 'adhoc-className',
          })
        ).toBe('adhoc-class');
      });
    });

    describe('without defaults', () => {
      const buttonWithoutBaseWithoutDefaultsString = cvb({
        variants: buttonConfig.variants,
        compoundVariants: buttonConfig.compoundVariants,
      });
      const buttonWithoutBaseWithoutDefaultsWithClassNameString = cvb({
        variants: buttonConfig.variants,
        compoundVariants: toCompoundVariantsWithClassName(buttonConfig.compoundVariants),
      });
      const buttonWithoutBaseWithoutDefaultsArray = cvb({
        variants: buttonConfigWithArray.variants,
        compoundVariants: buttonConfigWithArray.compoundVariants,
      });
      const buttonWithoutBaseWithoutDefaultsWithClassNameArray = cvb({
        variants: buttonConfigWithArray.variants,
        compoundVariants: toCompoundVariantsWithClassName(buttonConfigWithArray.compoundVariants),
      });

      type ButtonWithoutDefaultsWithoutBaseProps =
        | VariantProps<typeof buttonWithoutBaseWithoutDefaultsString>
        | VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameString>
        | VariantProps<typeof buttonWithoutBaseWithoutDefaultsArray>
        | VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameArray>;

      it.each<[number, ButtonWithoutDefaultsWithoutBaseProps, string]>([
        [
          1,
          // @ts-expect-error Invalid variant
          undefined,
          '',
        ],
        [2, {}, ''],
        [
          3,
          {
            aCheekyInvalidProp: 'lol',
          } as ButtonWithoutDefaultsWithoutBaseProps,
          '',
        ],
        [4, { intent: 'secondary' }, 'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100'],
        [5, { size: 'small' }, 'button--small text-sm py-1 px-2'],
        [6, { disabled: true }, 'button--disabled opacity-050 cursor-not-allowed'],
        [
          7,
          {
            intent: 'secondary',
            size: 'unset',
          },
          'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
        ],
        [
          8,
          { intent: 'secondary', size: undefined },
          'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
        ],
        [
          9,
          { intent: 'danger', size: 'medium' },
          'button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--medium text-base py-2 px-4',
        ],
        [
          10,
          { intent: 'warning', size: 'large' },
          'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4',
        ],
        [
          11,
          { intent: 'warning', size: 'large', disabled: true },
          'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black',
        ],
        [
          12,
          { intent: 'primary', m: 0 },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-0',
        ],
        [
          13,
          { intent: 'primary', m: 1 },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1',
        ],
        // !@TODO Add type "extractor" including class prop
        [
          14,
          {
            intent: 'primary',
            m: 1,
            class: 'adhoc-class',
          } as ButtonWithoutDefaultsWithoutBaseProps,
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1 adhoc-class',
        ],
        [
          15,
          {
            intent: 'primary',
            m: 1,
            className: 'adhoc-classname',
          } as ButtonWithoutDefaultsWithoutBaseProps,
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1 adhoc-classname',
        ],
        // typings needed
      ])('%d - button(%o) return %o', (_, options, expected) => {
        expect(buttonWithoutBaseWithoutDefaultsString(options)).toBe(expected);
        expect(buttonWithoutBaseWithoutDefaultsWithClassNameString(options)).toBe(expected);
        expect(buttonWithoutBaseWithoutDefaultsArray(options)).toBe(expected);
        expect(buttonWithoutBaseWithoutDefaultsWithClassNameArray(options)).toBe(expected);
      });
    });

    describe('with defaults', () => {
      const buttonWithoutBaseWithDefaultsString = cvb({
        variants: buttonConfig.variants,
        compoundVariants: [
          ...buttonConfig.compoundVariants,
          {
            intent: ['warning', 'danger'],
            class: 'button--warning-danger !border-red-500',
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: 'button--warning-danger-medium',
          },
        ],
        defaultVariants: { ...buttonConfig.defaultVariants, m: 0 },
      });
      const buttonWithoutBaseWithDefaultsWithClassNameString = cvb({
        variants: buttonConfig.variants,
        compoundVariants: [
          ...toCompoundVariantsWithClassName(buttonConfig.compoundVariants),
          {
            intent: ['warning', 'danger'],
            className: 'button--warning-danger !border-red-500',
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            className: 'button--warning-danger-medium',
          },
        ],
        defaultVariants: { ...buttonConfig.defaultVariants, m: 0 },
      });
      const buttonWithoutBaseWithDefaultsArray = cvb({
        variants: buttonConfigWithArray.variants,
        compoundVariants: [
          ...buttonConfigWithArray.compoundVariants,
          {
            intent: ['warning', 'danger'],
            class: 'button--warning-danger !border-red-500',
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: 'button--warning-danger-medium',
          },
        ],
        defaultVariants: { ...buttonConfigWithArray.defaultVariants, m: 0 },
      });
      const buttonWithoutBaseWithDefaultsWithClassNameArray = cvb({
        variants: buttonConfigWithArray.variants,
        compoundVariants: [
          ...toCompoundVariantsWithClassName(buttonConfigWithArray.compoundVariants),
          {
            intent: ['warning', 'danger'],
            className: 'button--warning-danger !border-red-500',
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            className: 'button--warning-danger-medium',
          },
        ],
        defaultVariants: { ...buttonConfigWithArray.defaultVariants, m: 0 },
      });

      type ButtonWithoutBaseWithDefaultsProps =
        | VariantProps<typeof buttonWithoutBaseWithDefaultsString>
        | VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameString>
        | VariantProps<typeof buttonWithoutBaseWithDefaultsArray>
        | VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameArray>;

      it.each<[number, ButtonWithoutBaseWithDefaultsProps, string]>([
        [
          1,
          // @ts-expect-error Invalid variant
          undefined,
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          2,
          {},
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          3,
          {
            aCheekyInvalidProp: 'lol',
          } as ButtonWithoutBaseWithDefaultsProps,
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          4,
          { intent: 'secondary' },
          'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0',
        ],
        [
          5,
          { size: 'small' },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--small text-sm py-1 px-2 m-0',
        ],
        [
          6,
          { disabled: true },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          7,
          {
            intent: 'secondary',
            size: 'unset',
          },
          'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer m-0',
        ],
        [
          8,
          { intent: 'secondary', size: undefined },
          'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0',
        ],
        [
          9,
          { intent: 'danger', size: 'medium' },
          'button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--warning-danger !border-red-500 button--warning-danger-medium',
        ],
        [
          10,
          { intent: 'warning', size: 'large' },
          'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 m-0 button--warning-enabled text-gray-800 button--warning-danger !border-red-500',
        ],
        [
          11,
          { intent: 'warning', size: 'large', disabled: true },
          'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 m-0 button--warning-disabled text-black button--warning-danger !border-red-500',
        ],
        [
          12,
          { intent: 'primary', m: 0 },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          13,
          { intent: 'primary', m: 1 },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-1 button--primary-medium uppercase',
        ],
        // !@TODO Add type "extractor" including class prop
        [
          14,
          {
            intent: 'primary',
            m: 0,
            class: 'adhoc-class',
          } as ButtonWithoutBaseWithDefaultsProps,
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase adhoc-class',
        ],
        [
          15,
          {
            intent: 'primary',
            m: 1,
            className: 'adhoc-classname',
          } as ButtonWithoutBaseWithDefaultsProps,
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-1 button--primary-medium uppercase adhoc-classname',
        ],
      ])('%d - button(%o) return %o', (_, options, expected) => {
        expect(buttonWithoutBaseWithDefaultsString(options)).toBe(expected);
        expect(buttonWithoutBaseWithDefaultsWithClassNameString(options)).toBe(expected);
        expect(buttonWithoutBaseWithDefaultsArray(options)).toBe(expected);
        expect(buttonWithoutBaseWithDefaultsWithClassNameArray(options)).toBe(expected);
      });
    });
  });

  describe('with base', () => {
    describe('without defaults', () => {
      const buttonWithBaseWithoutDefaultsString = cvb({
        base: buttonConfig.base,
        variants: buttonConfig.variants,
        compoundVariants: [
          ...buttonConfig.compoundVariants,
          {
            intent: ['warning', 'danger'],
            class: 'button--warning-danger !border-red-500',
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: 'button--warning-danger-medium',
          },
        ],
      });
      const buttonWithBaseWithoutDefaultsWithClassNameString = cvb({
        base: buttonConfig.base,
        variants: buttonConfig.variants,
        compoundVariants: [
          ...toCompoundVariantsWithClassName(buttonConfig.compoundVariants),
          {
            intent: ['warning', 'danger'],
            className: 'button--warning-danger !border-red-500',
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: 'button--warning-danger-medium',
          },
        ],
      });

      const buttonWithBaseWithoutDefaultsArray = cvb({
        base: buttonConfigWithArray.base,
        variants: buttonConfigWithArray.variants,
        compoundVariants: [
          ...buttonConfigWithArray.compoundVariants,
          {
            intent: ['warning', 'danger'],
            class: 'button--warning-danger !border-red-500',
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: 'button--warning-danger-medium',
          },
        ],
      });
      const buttonWithBaseWithoutDefaultsWithClassNameArray = cvb({
        base: buttonConfigWithArray.base,
        variants: buttonConfigWithArray.variants,
        compoundVariants: [
          ...toCompoundVariantsWithClassName(buttonConfigWithArray.compoundVariants),
          {
            intent: ['warning', 'danger'],
            class: 'button--warning-danger !border-red-500',
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: 'button--warning-danger-medium',
          },
        ],
      });

      type ButtonWithBaseWithoutDefaultsProps =
        | VariantProps<typeof buttonWithBaseWithoutDefaultsString>
        | VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameString>
        | VariantProps<typeof buttonWithBaseWithoutDefaultsArray>
        | VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameArray>;

      it.each<[number, ButtonWithBaseWithoutDefaultsProps, string]>([
        [1, undefined as unknown as ButtonWithBaseWithoutDefaultsProps, 'button font-semibold border rounded'],
        [2, {}, 'button font-semibold border rounded'],
        [
          3,
          {
            aCheekyInvalidProp: 'lol',
          },
          'button font-semibold border rounded',
        ],
        [
          4,
          { intent: 'secondary' },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
        ],
        [5, { size: 'small' }, 'button font-semibold border rounded button--small text-sm py-1 px-2'],
        [6, { disabled: false }, 'button font-semibold border rounded button--enabled cursor-pointer'],
        [7, { disabled: true }, 'button font-semibold border rounded button--disabled opacity-050 cursor-not-allowed'],
        [
          8,
          { intent: 'secondary', size: 'unset' },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
        ],
        [
          9,
          { intent: 'secondary', size: undefined },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
        ],
        [
          10,
          { intent: 'danger', size: 'medium' },
          'button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--medium text-base py-2 px-4 button--warning-danger !border-red-500 button--warning-danger-medium',
        ],
        [
          11,
          { intent: 'warning', size: 'large' },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500',
        ],
        [
          12,
          { intent: 'warning', size: 'large', disabled: 'unset' },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500',
        ],
        [
          13,
          { intent: 'warning', size: 'large', disabled: true },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black button--warning-danger !border-red-500',
        ],
        [
          14,
          { intent: 'warning', size: 'large', disabled: false },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500',
        ],
        // !@TODO Add type "extractor" including class prop
        [
          15,
          {
            intent: 'primary',
            class: 'adhoc-class',
          } as ButtonWithBaseWithoutDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 adhoc-class',
        ],
        [
          16,
          {
            intent: 'primary',
            className: 'adhoc-className',
          } as ButtonWithBaseWithoutDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 adhoc-className',
        ],
      ])('%d - button(%o) return %o', (_, options, expected) => {
        expect(buttonWithBaseWithoutDefaultsString(options)).toBe(expected);
        expect(buttonWithBaseWithoutDefaultsWithClassNameString(options)).toBe(expected);
        expect(buttonWithBaseWithoutDefaultsArray(options)).toBe(expected);
        expect(buttonWithBaseWithoutDefaultsWithClassNameArray(options)).toBe(expected);
      });
    });

    describe('with defaults', () => {
      const buttonWithBaseWithDefaultsString = cvb({
        base: buttonConfig.base,
        variants: buttonConfig.variants,
        compoundVariants: [
          ...buttonConfig.compoundVariants,
          {
            intent: ['warning', 'danger'],
            class: 'button--warning-danger !border-red-500',
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: 'button--warning-danger-medium',
          },
        ],
        defaultVariants: {
          ...buttonConfig.defaultVariants,
        },
      });
      const buttonWithBaseWithDefaultsWithClassNameString = cvb({
        base: buttonConfig.base,
        variants: buttonConfig.variants,
        compoundVariants: [
          ...toCompoundVariantsWithClassName(buttonConfig.compoundVariants),
          {
            intent: ['warning', 'danger'],
            class: 'button--warning-danger !border-red-500',
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: 'button--warning-danger-medium',
          },
        ],
        defaultVariants: {
          ...buttonConfig.defaultVariants,
        },
      });

      const buttonWithBaseWithDefaultsArray = cvb({
        base: buttonConfigWithArray.base,
        variants: buttonConfigWithArray.variants,
        compoundVariants: [
          ...buttonConfigWithArray.compoundVariants,
          {
            intent: ['warning', 'danger'],
            class: 'button--warning-danger !border-red-500',
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: 'button--warning-danger-medium',
          },
        ],
        defaultVariants: {
          ...buttonConfigWithArray.defaultVariants,
        },
      });
      const buttonWithBaseWithDefaultsWithClassNameArray = cvb({
        base: buttonConfigWithArray.base,
        variants: buttonConfigWithArray.variants,
        compoundVariants: [
          ...toCompoundVariantsWithClassName(buttonConfigWithArray.compoundVariants),
          {
            intent: ['warning', 'danger'],
            class: 'button--warning-danger !border-red-500',
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: 'button--warning-danger-medium',
          },
        ],
        defaultVariants: {
          ...buttonConfigWithArray.defaultVariants,
        },
      });

      type ButtonWithBaseWithDefaultsProps =
        | VariantProps<typeof buttonWithBaseWithDefaultsString>
        | VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameString>
        | VariantProps<typeof buttonWithBaseWithDefaultsArray>
        | VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameArray>;

      it.each<[number, ButtonWithBaseWithDefaultsProps, string]>([
        [
          1,
          // @ts-expect-error Invalid variant
          undefined,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase',
        ],
        [
          2,
          {},
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase',
        ],
        [
          3,
          {
            aCheekyInvalidProp: 'lol',
          } as ButtonWithBaseWithDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase',
        ],
        [
          4,
          { intent: 'secondary' },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4',
        ],
        [
          5,
          { size: 'small' },
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--small text-sm py-1 px-2',
        ],
        [
          6,
          { disabled: 'unset' },
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--medium text-base py-2 px-4 button--primary-medium uppercase',
        ],
        [
          7,
          { disabled: false },
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase',
        ],
        [
          8,
          { disabled: true },
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 button--primary-medium uppercase',
        ],
        [
          9,
          { intent: 'secondary', size: 'unset' },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer',
        ],
        [
          10,
          { intent: 'secondary', size: undefined },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4',
        ],
        [
          11,
          { intent: 'danger', size: 'medium' },
          'button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--warning-danger !border-red-500 button--warning-danger-medium',
        ],
        [
          12,
          { intent: 'warning', size: 'large' },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500',
        ],
        [
          13,
          {
            intent: 'warning',
            size: 'large',
            disabled: 'unset',
          },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500',
        ],
        [
          14,
          { intent: 'warning', size: 'large', disabled: true },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black button--warning-danger !border-red-500',
        ],
        [
          15,
          { intent: 'warning', size: 'large', disabled: false },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500',
        ],
        // !@TODO Add type "extractor" including class prop
        [
          16,
          {
            intent: 'primary',
            class: 'adhoc-class',
          } as ButtonWithBaseWithDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase adhoc-class',
        ],
        [
          17,
          {
            intent: 'primary',
            className: 'adhoc-classname',
          } as ButtonWithBaseWithDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase adhoc-classname',
        ],
      ])('%d - button(%o) return %o', (_, options, expected) => {
        expect(buttonWithBaseWithDefaultsString(options)).toBe(expected);
        expect(buttonWithBaseWithDefaultsWithClassNameString(options)).toBe(expected);
        expect(buttonWithBaseWithDefaultsArray(options)).toBe(expected);
        expect(buttonWithBaseWithDefaultsWithClassNameArray(options)).toBe(expected);
      });
    });
  });
});

describe('svb', () => {
  const checkboxConfig: Required<SlotRecipeDefinition> = {
    slots: ['root', 'control', 'label'],
    base: {
      label: 'font-semibold',
      root: 'checkbox',
      control: 'border rounded',
    },
    variants: {
      intent: {
        unset: {
          root: null,
          control: null,
          label: null,
        },
        primary: {
          root: 'cbx--primary-root bg-blue-500',
          control: 'cbx--primary-control border-transparent hover:bg-blue-600',
          label: 'cbx--primary-label text-white',
        },
        secondary: {
          root: 'cbx--secondary-root bg-white',
          control: 'cbx--secondary-control border-gray-400 hover:bg-gray-100',
          label: 'cbx--secondary-label text-gray-800',
        },
        warning: {
          root: 'cbx--warning-root bg-yellow-500',
          control: 'cbx--warning-control border-transparent hover:bg-yellow-600',
          label: 'cbx--warning-label text-white',
        },
        danger: {
          root: 'cbx--danger-root bg-white',
          control: ['cbx--danger-control', [1 && 'bg-red-500', { baz: false, bat: null }, [['border-transparent']]]],
          label: 'cbx--danger-label text-white',
        },
      },
      disabled: {
        unset: {
          root: null,
          control: null,
          label: null,
        },
        true: {
          root: 'cbx--disabled opacity-050 cursor-not-allowed',
        },
        false: {
          root: 'cbx--enabled cursor-pointer',
        },
      },
      size: {
        small: {
          root: 'cbx--small',
          control: 'w-2 h-2 py-1 px-2',
          label: 'text-sm',
        },
        medium: {
          root: 'cbx--medium',
          control: 'w-2.5 h-2.5 py-2 px-4',
          label: 'text-md',
        },
        large: {
          root: 'cbx--large',
          control: 'w-2.5 h-2.5 py-2.5 px-4',
          label: 'text-lg',
        },
      },
      m: {
        unset: {
          root: null,
          control: null,
          label: null,
        },
        0: {
          root: 'm-0',
        },
        1: {
          root: 'm-1',
        },
      },
    },
    compoundVariants: [
      {
        intent: 'primary',
        size: 'medium',
        class: {
          root: 'cbx--primary-medium',
          label: 'uppercase',
        },
      },
      {
        intent: 'warning',
        disabled: false,
        class: {
          root: 'cbx--warning-enabled',
          label: ['text-gray-800'],
        },
      },
      {
        intent: 'warning',
        disabled: true,
        class: {
          root: 'cbx--warning-disabled',
          label: [[1 && 'text-black', { baz: false, bat: null }]],
        },
      },
    ],
    defaultVariants: {
      m: 0,
      disabled: false,
      intent: 'primary',
      size: 'medium',
    },
  };
  const checkboxConfigWithArray: Required<SlotRecipeDefinition> = {
    slots: checkboxConfig.slots,
    base: checkboxConfig.base,
    variants: {
      intent: {
        unset: {
          root: null,
          control: null,
          label: null,
        },
        primary: {
          root: ['cbx--primary-root bg-blue-500'],
          control: ['cbx--primary-control border-transparent hover:bg-blue-600'],
          label: ['cbx--primary-label text-white'],
        },
        secondary: {
          root: ['cbx--secondary-root bg-white'],
          control: ['cbx--secondary-control border-gray-400 hover:bg-gray-100'],
          label: ['cbx--secondary-label text-gray-800'],
        },
        warning: {
          root: ['cbx--warning-root bg-yellow-500'],
          control: ['cbx--warning-control border-transparent hover:bg-yellow-600'],
          label: ['cbx--warning-label text-white'],
        },
        danger: {
          root: ['cbx--danger-root bg-white'],
          control: ['cbx--danger-control', [1 && 'bg-red-500', { baz: false, bat: null }, [['border-transparent']]]],
          label: ['cbx--danger-label text-white'],
        },
      },
      disabled: {
        unset: {
          root: null,
          control: null,
          label: null,
        },
        true: {
          root: ['cbx--disabled opacity-050 cursor-not-allowed'],
        },
        false: {
          root: ['cbx--enabled cursor-pointer'],
        },
      },
      size: {
        small: {
          root: ['cbx--small'],
          control: ['w-2 h-2 py-1 px-2'],
          label: ['text-sm'],
        },
        medium: {
          root: ['cbx--medium'],
          control: ['w-2.5 h-2.5 py-2 px-4'],
          label: ['text-md'],
        },
        large: {
          root: ['cbx--large'],
          control: ['w-2.5 h-2.5 py-2.5 px-4'],
          label: ['text-lg'],
        },
      },
      m: {
        unset: {
          root: null,
          control: null,
          label: null,
        },
        0: {
          root: 'm-0',
        },
        1: {
          root: 'm-1',
        },
      },
    },
    compoundVariants: [
      {
        intent: 'primary',
        size: 'medium',
        class: {
          root: ['cbx--primary-medium'],
          label: ['uppercase'],
        },
      },
      {
        intent: 'warning',
        disabled: false,
        class: {
          root: ['cbx--warning-enabled'],
          label: ['text-gray-800'],
        },
      },
      {
        intent: 'warning',
        disabled: true,
        class: {
          root: ['cbx--warning-disabled'],
          label: [[1 && 'text-black', { baz: false, bat: null }]],
        },
      },
    ],
    defaultVariants: checkboxConfig.defaultVariants,
  };

  describe('without base', () => {
    describe('without anything', () => {
      test('empty', () => {
        const example = svb({ slots: [], variants: {} });
        expect(example()).toEqual({});
        expect(
          example({
            // @ts-expect-error: This is not a valid variant and should be ignored
            aCheekyInvalidProp: 'lol',
          })
        ).toEqual({});
        expect(example({ class: 'adhoc-class' })).toEqual({});
        expect(example({ className: 'adhoc-className' })).toEqual({});
        expect(
          example({
            class: 'adhoc-class',
            // @ts-expect-error: Only one of class or className is allowed, with class taking precedence
            className: 'adhoc-className',
          })
        ).toEqual({});
      });

      test('only with slots', () => {
        const example = svb({ slots: ['root', 'control'], variants: {} });
        expect(example()).toEqual({
          control: '',
          root: '',
        });
        expect(
          example({
            // @ts-expect-error: This is not a valid variant and should be ignored
            aCheekyInvalidProp: 'lol',
          })
        ).toEqual({
          control: '',
          root: '',
        });
        expect(example({ class: 'adhoc-class' })).toEqual({
          control: 'adhoc-class',
          root: 'adhoc-class',
        });
        expect(example({ className: 'adhoc-className' })).toEqual({
          control: 'adhoc-className',
          root: 'adhoc-className',
        });
        expect(
          example({
            class: 'adhoc-class',
            // @ts-expect-error: Only one of class or className is allowed, with class taking precedence
            className: 'adhoc-className',
          })
        ).toEqual({
          control: 'adhoc-class',
          root: 'adhoc-class',
        });
      });

      test('undefined', () => {
        // @ts-expect-error props is invalid
        const example = svb(undefined);
        expect(example()).toEqual({});
        expect(
          example({
            aCheekyInvalidProp: 'lol',
          })
        ).toEqual({});
        expect(example({ class: 'adhoc-class' })).toEqual({});
        expect(example({ className: 'adhoc-className' })).toEqual({});
        expect(
          example({
            className: 'adhoc-className',
          })
        ).toEqual({});
      });

      test('null', () => {
        // @ts-expect-error props is invalid
        const example = svb(null);
        expect(example()).toEqual({});
        expect(
          example({
            aCheekyInvalidProp: 'lol',
          })
        ).toEqual({});
        expect(example({ class: 'adhoc-class' })).toEqual({});
        expect(example({ className: 'adhoc-className' })).toEqual({});
        expect(
          example({
            class: 'adhoc-class',
            // @ts-expect-error: Only one of class or className is allowed, with class taking precedence
            className: 'adhoc-className',
          })
        ).toEqual({});
      });
    });

    describe('without defaults', () => {
      const checkboxWithoutBaseWithoutDefaultsString = svb({
        slots: checkboxConfig.slots,
        variants: checkboxConfig.variants,
        compoundVariants: checkboxConfig.compoundVariants,
      });

      const checkboxWithoutBaseWithoutDefaultsWithClassNameString = svb({
        slots: checkboxConfig.slots,
        variants: checkboxConfig.variants,
        compoundVariants: toCompoundVariantsWithClassName(checkboxConfig.compoundVariants),
      });

      const checkboxWithoutBaseWithoutDefaultsArray = svb({
        slots: checkboxConfigWithArray.slots,
        variants: checkboxConfigWithArray.variants,
        compoundVariants: checkboxConfigWithArray.compoundVariants,
      });

      const checkboxWithoutBaseWithoutDefaultsWithClassNameArray = svb({
        slots: checkboxConfigWithArray.slots,
        variants: checkboxConfigWithArray.variants,
        compoundVariants: toCompoundVariantsWithClassName(checkboxConfigWithArray.compoundVariants),
      });

      type CheckboxWithoutDefaultsWithoutBaseProps =
        | SlotVariantProps<typeof checkboxWithoutBaseWithoutDefaultsString>
        | SlotVariantProps<typeof checkboxWithoutBaseWithoutDefaultsWithClassNameString>
        | SlotVariantProps<typeof checkboxWithoutBaseWithoutDefaultsArray>
        | SlotVariantProps<typeof checkboxWithoutBaseWithoutDefaultsWithClassNameArray>;

      it.each<[number, CheckboxWithoutDefaultsWithoutBaseProps, Record<string, string>]>([
        [
          1,
          // @ts-expect-error Invalid variant
          undefined,
          {
            control: '',
            label: '',
            root: '',
          },
        ],
        [
          2,
          {},
          {
            control: '',
            label: '',
            root: '',
          },
        ],
        [
          3,
          {
            aCheekyInvalidProp: 'lol',
          } as CheckboxWithoutDefaultsWithoutBaseProps,
          {
            control: '',
            label: '',
            root: '',
          },
        ],
        [
          4,
          { intent: 'secondary' },
          {
            control: 'cbx--secondary-control border-gray-400 hover:bg-gray-100',
            label: 'cbx--secondary-label text-gray-800',
            root: 'cbx--secondary-root bg-white',
          },
        ],
        [
          5,
          { size: 'small' },
          {
            control: 'w-2 h-2 py-1 px-2',
            label: 'text-sm',
            root: 'cbx--small',
          },
        ],
        [
          6,
          { disabled: true },
          {
            control: '',
            label: '',
            root: 'cbx--disabled opacity-050 cursor-not-allowed',
          },
        ],
        [
          7,
          {
            intent: 'secondary',
            size: 'unset',
          },
          {
            control: 'cbx--secondary-control border-gray-400 hover:bg-gray-100',
            label: 'cbx--secondary-label text-gray-800',
            root: 'cbx--secondary-root bg-white',
          },
        ],
        [
          8,
          { intent: 'secondary', size: undefined },
          {
            control: 'cbx--secondary-control border-gray-400 hover:bg-gray-100',
            label: 'cbx--secondary-label text-gray-800',
            root: 'cbx--secondary-root bg-white',
          },
        ],
        [
          9,
          { intent: 'danger', size: 'medium' },
          {
            control: 'cbx--danger-control bg-red-500 border-transparent w-2.5 h-2.5 py-2 px-4',
            label: 'cbx--danger-label text-white text-md',
            root: 'cbx--danger-root bg-white cbx--medium',
          },
        ],
        [
          10,
          { intent: 'warning', size: 'large' },
          {
            control: 'cbx--warning-control border-transparent hover:bg-yellow-600 w-2.5 h-2.5 py-2.5 px-4',
            label: 'cbx--warning-label text-white text-lg',
            root: 'cbx--warning-root bg-yellow-500 cbx--large',
          },
        ],
        [
          11,
          { intent: 'warning', size: 'large', disabled: true },
          {
            control: 'cbx--warning-control border-transparent hover:bg-yellow-600 w-2.5 h-2.5 py-2.5 px-4',
            label: 'cbx--warning-label text-white text-lg text-black',
            root: 'cbx--warning-root bg-yellow-500 cbx--disabled opacity-050 cursor-not-allowed cbx--large cbx--warning-disabled',
          },
        ],
        [
          12,
          { intent: 'primary', m: 0 },
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600',
            label: 'cbx--primary-label text-white',
            root: 'cbx--primary-root bg-blue-500 m-0',
          },
        ],
        [
          13,
          { intent: 'primary', m: 1 },
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600',
            label: 'cbx--primary-label text-white',
            root: 'cbx--primary-root bg-blue-500 m-1',
          },
        ],
        [
          14,
          {
            intent: 'primary',
            m: 1,
            class: 'adhoc-class',
          },
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600 adhoc-class',
            label: 'cbx--primary-label text-white adhoc-class',
            root: 'cbx--primary-root bg-blue-500 m-1 adhoc-class',
          },
        ],
        [
          15,
          {
            intent: 'primary',
            m: 1,
            className: 'adhoc-classname',
          },
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600 adhoc-classname',
            label: 'cbx--primary-label text-white adhoc-classname',
            root: 'cbx--primary-root bg-blue-500 m-1 adhoc-classname',
          },
        ],
      ])('%d - checkbox(%o) return %o', (_, options, expected) => {
        expect(checkboxWithoutBaseWithoutDefaultsString(options)).toEqual(expected);
        expect(checkboxWithoutBaseWithoutDefaultsWithClassNameString(options)).toEqual(expected);
        expect(checkboxWithoutBaseWithoutDefaultsArray(options)).toEqual(expected);
        expect(checkboxWithoutBaseWithoutDefaultsWithClassNameArray(options)).toEqual(expected);
      });
    });

    describe('with defaults', () => {
      const checkboxWithoutBaseWithDefaultsString = svb({
        slots: checkboxConfig.slots,
        variants: checkboxConfig.variants,
        compoundVariants: [
          ...checkboxConfig.compoundVariants,
          {
            intent: ['warning', 'danger'],
            class: {
              control: 'button--warning-danger !border-red-500',
            },
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: { control: 'button--warning-danger-medium' },
          },
        ],
        defaultVariants: checkboxConfig.defaultVariants,
      });
      const checkboxWithoutBaseWithDefaultsWithClassNameString = svb({
        slots: checkboxConfig.slots,
        variants: checkboxConfig.variants,
        compoundVariants: toCompoundVariantsWithClassName([
          ...checkboxConfig.compoundVariants,
          {
            intent: ['warning', 'danger'],
            class: {
              control: 'button--warning-danger !border-red-500',
            },
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: { control: 'button--warning-danger-medium' },
          },
        ]),
        defaultVariants: checkboxConfig.defaultVariants,
      });
      const checkboxWithoutBaseWithDefaultsArray = svb({
        slots: checkboxConfigWithArray.slots,
        variants: checkboxConfigWithArray.variants,
        compoundVariants: [
          ...checkboxConfigWithArray.compoundVariants,
          {
            intent: ['warning', 'danger'],
            class: {
              control: ['button--warning-danger !border-red-500'],
            },
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: { control: ['button--warning-danger-medium'] },
          },
        ],
        defaultVariants: checkboxConfigWithArray.defaultVariants,
      });
      const checkboxWithoutBaseWithDefaultsWithClassNameArray = svb({
        slots: checkboxConfigWithArray.slots,
        variants: checkboxConfigWithArray.variants,
        compoundVariants: toCompoundVariantsWithClassName([
          ...checkboxConfigWithArray.compoundVariants,
          {
            intent: ['warning', 'danger'],
            class: {
              control: ['button--warning-danger !border-red-500'],
            },
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: { control: ['button--warning-danger-medium'] },
          },
        ]),
        defaultVariants: checkboxConfigWithArray.defaultVariants,
      });

      type CheckboxWithoutBaseWithDefaultsProps =
        | SlotVariantProps<typeof checkboxWithoutBaseWithDefaultsString>
        | SlotVariantProps<typeof checkboxWithoutBaseWithDefaultsWithClassNameString>
        | SlotVariantProps<typeof checkboxWithoutBaseWithDefaultsArray>
        | SlotVariantProps<typeof checkboxWithoutBaseWithDefaultsWithClassNameArray>;

      it.each<[number, CheckboxWithoutBaseWithDefaultsProps, Record<string, string>]>([
        [
          1,
          // @ts-expect-error Invalid variant
          undefined,
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4',
            label: 'cbx--primary-label text-white text-md uppercase',
            root: 'cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-0 cbx--primary-medium',
          },
        ],
        [
          2,
          {},
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4',
            label: 'cbx--primary-label text-white text-md uppercase',
            root: 'cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-0 cbx--primary-medium',
          },
        ],
        [
          3,
          {
            aCheekyInvalidProp: 'lol',
          } as CheckboxWithoutBaseWithDefaultsProps,
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4',
            label: 'cbx--primary-label text-white text-md uppercase',
            root: 'cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-0 cbx--primary-medium',
          },
        ],
        [
          4,
          { intent: 'secondary' },
          {
            control: 'cbx--secondary-control border-gray-400 hover:bg-gray-100 w-2.5 h-2.5 py-2 px-4',
            label: 'cbx--secondary-label text-gray-800 text-md',
            root: 'cbx--secondary-root bg-white cbx--enabled cursor-pointer cbx--medium m-0',
          },
        ],
        [
          5,
          { size: 'small' },
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600 w-2 h-2 py-1 px-2',
            label: 'cbx--primary-label text-white text-sm',
            root: 'cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--small m-0',
          },
        ],
        [
          6,
          { disabled: true },
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4',
            label: 'cbx--primary-label text-white text-md uppercase',
            root: 'cbx--primary-root bg-blue-500 cbx--disabled opacity-050 cursor-not-allowed cbx--medium m-0 cbx--primary-medium',
          },
        ],
        [
          7,
          {
            intent: 'secondary',
            size: 'unset',
          },
          {
            control: 'cbx--secondary-control border-gray-400 hover:bg-gray-100',
            label: 'cbx--secondary-label text-gray-800',
            root: 'cbx--secondary-root bg-white cbx--enabled cursor-pointer m-0',
          },
        ],
        [
          8,
          { intent: 'secondary', size: undefined },
          {
            control: 'cbx--secondary-control border-gray-400 hover:bg-gray-100 w-2.5 h-2.5 py-2 px-4',
            label: 'cbx--secondary-label text-gray-800 text-md',
            root: 'cbx--secondary-root bg-white cbx--enabled cursor-pointer cbx--medium m-0',
          },
        ],
        [
          9,
          { intent: 'danger', size: 'medium' },
          {
            control:
              'cbx--danger-control bg-red-500 border-transparent w-2.5 h-2.5 py-2 px-4 button--warning-danger !border-red-500 button--warning-danger-medium',
            label: 'cbx--danger-label text-white text-md',
            root: 'cbx--danger-root bg-white cbx--enabled cursor-pointer cbx--medium m-0',
          },
        ],
        [
          10,
          { intent: 'warning', size: 'large' },
          {
            control:
              'cbx--warning-control border-transparent hover:bg-yellow-600 w-2.5 h-2.5 py-2.5 px-4 button--warning-danger !border-red-500',
            label: 'cbx--warning-label text-white text-lg text-gray-800',
            root: 'cbx--warning-root bg-yellow-500 cbx--enabled cursor-pointer cbx--large m-0 cbx--warning-enabled',
          },
        ],
        [
          11,
          { intent: 'warning', size: 'large', disabled: true },
          {
            control:
              'cbx--warning-control border-transparent hover:bg-yellow-600 w-2.5 h-2.5 py-2.5 px-4 button--warning-danger !border-red-500',
            label: 'cbx--warning-label text-white text-lg text-black',
            root: 'cbx--warning-root bg-yellow-500 cbx--disabled opacity-050 cursor-not-allowed cbx--large m-0 cbx--warning-disabled',
          },
        ],
        [
          12,
          { intent: 'primary', m: 0 },
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4',
            label: 'cbx--primary-label text-white text-md uppercase',
            root: 'cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-0 cbx--primary-medium',
          },
        ],
        [
          13,
          { intent: 'primary', m: 1 },
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4',
            label: 'cbx--primary-label text-white text-md uppercase',
            root: 'cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-1 cbx--primary-medium',
          },
        ],
        [
          14,
          {
            intent: 'primary',
            m: 0,
            class: 'adhoc-class',
          },
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4 adhoc-class',
            label: 'cbx--primary-label text-white text-md uppercase adhoc-class',
            root: 'cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-0 cbx--primary-medium adhoc-class',
          },
        ],
        [
          15,
          {
            intent: 'primary',
            m: 1,
            className: 'adhoc-classname',
          },
          {
            control: 'cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4 adhoc-classname',
            label: 'cbx--primary-label text-white text-md uppercase adhoc-classname',
            root: 'cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-1 cbx--primary-medium adhoc-classname',
          },
        ],
      ])('checkbox(%o) returns %o', (_, options, expected) => {
        expect(checkboxWithoutBaseWithDefaultsString(options)).toEqual(expected);
        expect(checkboxWithoutBaseWithDefaultsWithClassNameString(options)).toEqual(expected);
        expect(checkboxWithoutBaseWithDefaultsArray(options)).toEqual(expected);
        expect(checkboxWithoutBaseWithDefaultsWithClassNameArray(options)).toEqual(expected);
      });
    });
  });

  describe('with base', () => {
    describe('without defaults', () => {
      const checkboxWithBaseWithoutDefaultsString = svb({
        slots: checkboxConfig.slots,
        base: checkboxConfig.base,
        variants: checkboxConfig.variants,
        compoundVariants: checkboxConfig.compoundVariants,
      });
      const checkboxWithBaseWithoutDefaultsWithClassNameString = svb({
        slots: checkboxConfig.slots,
        base: checkboxConfig.base,
        variants: checkboxConfig.variants,
        compoundVariants: toCompoundVariantsWithClassName(checkboxConfig.compoundVariants),
      });
      const checkboxWithBaseWithoutDefaultsArray = svb({
        slots: checkboxConfigWithArray.slots,
        base: checkboxConfigWithArray.base,
        variants: checkboxConfigWithArray.variants,
        compoundVariants: checkboxConfigWithArray.compoundVariants,
      });
      const checkboxWithBaseWithoutDefaultsWithClassNameArray = svb({
        slots: checkboxConfigWithArray.slots,
        base: checkboxConfigWithArray.base,
        variants: checkboxConfigWithArray.variants,
        compoundVariants: toCompoundVariantsWithClassName(checkboxConfigWithArray.compoundVariants),
      });

      type CheckboxWithBaseWithoutDefaultsProps =
        | VariantProps<typeof checkboxWithBaseWithoutDefaultsString>
        | VariantProps<typeof checkboxWithBaseWithoutDefaultsWithClassNameString>
        | VariantProps<typeof checkboxWithBaseWithoutDefaultsArray>
        | VariantProps<typeof checkboxWithBaseWithoutDefaultsWithClassNameArray>;

      it.each<[number, CheckboxWithBaseWithoutDefaultsProps, Record<string, string>]>([
        [
          1,
          // @ts-expect-error Invalid variant
          undefined,
          {
            control: 'border rounded',
            label: 'font-semibold',
            root: 'checkbox',
          },
        ],
        [
          2,
          {},
          {
            control: 'border rounded',
            label: 'font-semibold',
            root: 'checkbox',
          },
        ],
        [
          3,
          {
            aCheekyInvalidProp: 'lol',
          } as CheckboxWithBaseWithoutDefaultsProps,
          {
            control: 'border rounded',
            label: 'font-semibold',
            root: 'checkbox',
          },
        ],
        [
          4,
          { intent: 'secondary' },
          {
            control: 'border rounded cbx--secondary-control border-gray-400 hover:bg-gray-100',
            label: 'font-semibold cbx--secondary-label text-gray-800',
            root: 'checkbox cbx--secondary-root bg-white',
          },
        ],
        [
          5,
          { size: 'small' },
          {
            control: 'border rounded w-2 h-2 py-1 px-2',
            label: 'font-semibold text-sm',
            root: 'checkbox cbx--small',
          },
        ],
        [
          6,
          { disabled: true },
          {
            control: 'border rounded',
            label: 'font-semibold',
            root: 'checkbox cbx--disabled opacity-050 cursor-not-allowed',
          },
        ],
        [
          7,
          {
            intent: 'secondary',
            size: 'unset',
          },
          {
            control: 'border rounded cbx--secondary-control border-gray-400 hover:bg-gray-100',
            label: 'font-semibold cbx--secondary-label text-gray-800',
            root: 'checkbox cbx--secondary-root bg-white',
          },
        ],
        [
          8,
          { intent: 'secondary', size: undefined },
          {
            control: 'border rounded cbx--secondary-control border-gray-400 hover:bg-gray-100',
            label: 'font-semibold cbx--secondary-label text-gray-800',
            root: 'checkbox cbx--secondary-root bg-white',
          },
        ],
        [
          9,
          { intent: 'danger', size: 'medium' },
          {
            control: 'border rounded cbx--danger-control bg-red-500 border-transparent w-2.5 h-2.5 py-2 px-4',
            label: 'font-semibold cbx--danger-label text-white text-md',
            root: 'checkbox cbx--danger-root bg-white cbx--medium',
          },
        ],
        [
          10,
          { intent: 'warning', size: 'large' },
          {
            control:
              'border rounded cbx--warning-control border-transparent hover:bg-yellow-600 w-2.5 h-2.5 py-2.5 px-4',
            label: 'font-semibold cbx--warning-label text-white text-lg',
            root: 'checkbox cbx--warning-root bg-yellow-500 cbx--large',
          },
        ],
        [
          11,
          { intent: 'warning', size: 'large', disabled: true },
          {
            control:
              'border rounded cbx--warning-control border-transparent hover:bg-yellow-600 w-2.5 h-2.5 py-2.5 px-4',
            label: 'font-semibold cbx--warning-label text-white text-lg text-black',
            root: 'checkbox cbx--warning-root bg-yellow-500 cbx--disabled opacity-050 cursor-not-allowed cbx--large cbx--warning-disabled',
          },
        ],
        [
          12,
          { intent: 'primary', m: 0 },
          {
            control: 'border rounded cbx--primary-control border-transparent hover:bg-blue-600',
            label: 'font-semibold cbx--primary-label text-white',
            root: 'checkbox cbx--primary-root bg-blue-500 m-0',
          },
        ],
        [
          13,
          { intent: 'primary', m: 1 },
          {
            control: 'border rounded cbx--primary-control border-transparent hover:bg-blue-600',
            label: 'font-semibold cbx--primary-label text-white',
            root: 'checkbox cbx--primary-root bg-blue-500 m-1',
          },
        ],
        [
          14,
          {
            intent: 'primary',
            m: 1,
            class: 'adhoc-class',
          },
          {
            control: 'border rounded cbx--primary-control border-transparent hover:bg-blue-600 adhoc-class',
            label: 'font-semibold cbx--primary-label text-white adhoc-class',
            root: 'checkbox cbx--primary-root bg-blue-500 m-1 adhoc-class',
          },
        ],
        [
          15,
          {
            intent: 'primary',
            m: 1,
            className: 'adhoc-classname',
          },
          {
            control: 'border rounded cbx--primary-control border-transparent hover:bg-blue-600 adhoc-classname',
            label: 'font-semibold cbx--primary-label text-white adhoc-classname',
            root: 'checkbox cbx--primary-root bg-blue-500 m-1 adhoc-classname',
          },
        ],
      ])('%d - checkbox(%o) return %o', (_, options, expected) => {
        expect(checkboxWithBaseWithoutDefaultsString(options)).toEqual(expected);
        expect(checkboxWithBaseWithoutDefaultsWithClassNameString(options)).toEqual(expected);
        expect(checkboxWithBaseWithoutDefaultsArray(options)).toEqual(expected);
        expect(checkboxWithBaseWithoutDefaultsWithClassNameArray(options)).toEqual(expected);
      });
    });
    describe('with defaults', () => {
      const checkboxWithBaseWithDefaultsString = svb({
        slots: checkboxConfig.slots,
        base: checkboxConfig.base,
        variants: checkboxConfig.variants,
        compoundVariants: checkboxConfig.compoundVariants,
        defaultVariants: checkboxConfig.defaultVariants,
      });
      const checkboxWithBaseWithDefaultsWithClassNameString = svb({
        slots: checkboxConfig.slots,
        base: checkboxConfig.base,
        variants: checkboxConfig.variants,
        compoundVariants: toCompoundVariantsWithClassName(checkboxConfig.compoundVariants),
        defaultVariants: checkboxConfig.defaultVariants,
      });
      const checkboxWithBaseWithDefaultsArray = svb({
        slots: checkboxConfigWithArray.slots,
        base: checkboxConfigWithArray.base,
        variants: checkboxConfigWithArray.variants,
        compoundVariants: checkboxConfigWithArray.compoundVariants,
        defaultVariants: checkboxConfigWithArray.defaultVariants,
      });
      const checkboxWithBaseWithDefaultsWithClassNameArray = svb({
        slots: checkboxConfigWithArray.slots,
        base: checkboxConfigWithArray.base,
        variants: checkboxConfigWithArray.variants,
        compoundVariants: toCompoundVariantsWithClassName(checkboxConfigWithArray.compoundVariants),
        defaultVariants: checkboxConfigWithArray.defaultVariants,
      });

      type CheckboxWithBaseWithDefaultsProps =
        | VariantProps<typeof checkboxWithBaseWithDefaultsString>
        | VariantProps<typeof checkboxWithBaseWithDefaultsWithClassNameString>
        | VariantProps<typeof checkboxWithBaseWithDefaultsArray>
        | VariantProps<typeof checkboxWithBaseWithDefaultsWithClassNameArray>;

      it.each<[number, CheckboxWithBaseWithDefaultsProps, Record<string, string>]>([
        [
          1,
          // @ts-expect-error Invalid variant
          undefined,
          {
            control: 'border rounded cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4',
            label: 'font-semibold cbx--primary-label text-white text-md uppercase',
            root: 'checkbox cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-0 cbx--primary-medium',
          },
        ],
        [
          2,
          {},
          {
            control: 'border rounded cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4',
            label: 'font-semibold cbx--primary-label text-white text-md uppercase',
            root: 'checkbox cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-0 cbx--primary-medium',
          },
        ],
        [
          3,
          {
            aCheekyInvalidProp: 'lol',
          } as CheckboxWithBaseWithDefaultsProps,
          {
            control: 'border rounded cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4',
            label: 'font-semibold cbx--primary-label text-white text-md uppercase',
            root: 'checkbox cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-0 cbx--primary-medium',
          },
        ],
        [
          4,
          { intent: 'secondary' },
          {
            control: 'border rounded cbx--secondary-control border-gray-400 hover:bg-gray-100 w-2.5 h-2.5 py-2 px-4',
            label: 'font-semibold cbx--secondary-label text-gray-800 text-md',
            root: 'checkbox cbx--secondary-root bg-white cbx--enabled cursor-pointer cbx--medium m-0',
          },
        ],
        [
          5,
          { size: 'small' },
          {
            control: 'border rounded cbx--primary-control border-transparent hover:bg-blue-600 w-2 h-2 py-1 px-2',
            label: 'font-semibold cbx--primary-label text-white text-sm',
            root: 'checkbox cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--small m-0',
          },
        ],
        [
          6,
          { disabled: true },
          {
            control: 'border rounded cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4',
            label: 'font-semibold cbx--primary-label text-white text-md uppercase',
            root: 'checkbox cbx--primary-root bg-blue-500 cbx--disabled opacity-050 cursor-not-allowed cbx--medium m-0 cbx--primary-medium',
          },
        ],
        [
          7,
          {
            intent: 'secondary',
            size: 'unset',
          },
          {
            control: 'border rounded cbx--secondary-control border-gray-400 hover:bg-gray-100',
            label: 'font-semibold cbx--secondary-label text-gray-800',
            root: 'checkbox cbx--secondary-root bg-white cbx--enabled cursor-pointer m-0',
          },
        ],
        [
          8,
          { intent: 'secondary', size: undefined },
          {
            control: 'border rounded cbx--secondary-control border-gray-400 hover:bg-gray-100 w-2.5 h-2.5 py-2 px-4',
            label: 'font-semibold cbx--secondary-label text-gray-800 text-md',
            root: 'checkbox cbx--secondary-root bg-white cbx--enabled cursor-pointer cbx--medium m-0',
          },
        ],
        [
          9,
          { intent: 'danger', size: 'medium' },
          {
            control: 'border rounded cbx--danger-control bg-red-500 border-transparent w-2.5 h-2.5 py-2 px-4',
            label: 'font-semibold cbx--danger-label text-white text-md',
            root: 'checkbox cbx--danger-root bg-white cbx--enabled cursor-pointer cbx--medium m-0',
          },
        ],
        [
          10,
          { intent: 'warning', size: 'large' },
          {
            control:
              'border rounded cbx--warning-control border-transparent hover:bg-yellow-600 w-2.5 h-2.5 py-2.5 px-4',
            label: 'font-semibold cbx--warning-label text-white text-lg text-gray-800',
            root: 'checkbox cbx--warning-root bg-yellow-500 cbx--enabled cursor-pointer cbx--large m-0 cbx--warning-enabled',
          },
        ],
        [
          11,
          { intent: 'warning', size: 'large', disabled: true },
          {
            control:
              'border rounded cbx--warning-control border-transparent hover:bg-yellow-600 w-2.5 h-2.5 py-2.5 px-4',
            label: 'font-semibold cbx--warning-label text-white text-lg text-black',
            root: 'checkbox cbx--warning-root bg-yellow-500 cbx--disabled opacity-050 cursor-not-allowed cbx--large m-0 cbx--warning-disabled',
          },
        ],
        [
          12,
          { intent: 'primary', m: 0 },
          {
            control: 'border rounded cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4',
            label: 'font-semibold cbx--primary-label text-white text-md uppercase',
            root: 'checkbox cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-0 cbx--primary-medium',
          },
        ],
        [
          13,
          { intent: 'primary', m: 1 },
          {
            control: 'border rounded cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4',
            label: 'font-semibold cbx--primary-label text-white text-md uppercase',
            root: 'checkbox cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-1 cbx--primary-medium',
          },
        ],
        [
          14,
          {
            intent: 'primary',
            m: 1,
            class: 'adhoc-class',
          },
          {
            control:
              'border rounded cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4 adhoc-class',
            label: 'font-semibold cbx--primary-label text-white text-md uppercase adhoc-class',
            root: 'checkbox cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-1 cbx--primary-medium adhoc-class',
          },
        ],
        [
          15,
          {
            intent: 'primary',
            m: 1,
            className: 'adhoc-classname',
          },
          {
            control:
              'border rounded cbx--primary-control border-transparent hover:bg-blue-600 w-2.5 h-2.5 py-2 px-4 adhoc-classname',
            label: 'font-semibold cbx--primary-label text-white text-md uppercase adhoc-classname',
            root: 'checkbox cbx--primary-root bg-blue-500 cbx--enabled cursor-pointer cbx--medium m-1 cbx--primary-medium adhoc-classname',
          },
        ],
      ])('%d - checkbox(%o) return %o', (_, options, expected) => {
        expect(checkboxWithBaseWithDefaultsString(options)).toEqual(expected);
        expect(checkboxWithBaseWithDefaultsWithClassNameString(options)).toEqual(expected);
        expect(checkboxWithBaseWithDefaultsArray(options)).toEqual(expected);
        expect(checkboxWithBaseWithDefaultsWithClassNameArray(options)).toEqual(expected);
      });
    });
  });
});

describe('defineConfig', () => {
  describe('hooks', () => {
    describe('onComplete', () => {
      const PREFIX = 'never-gonna-give-you-up';
      const SUFFIX = 'never-gonna-let-you-down';

      const onCompleteHandler = (className: string) => [PREFIX, className, SUFFIX].join(' ');

      test('should extend compose', () => {
        const { compose: composeExtended } = defineConfig({
          hooks: {
            onComplete: onCompleteHandler,
          },
        });

        const box = cvb({
          variants: {
            shadow: {
              sm: 'shadow-sm',
              md: 'shadow-md',
            },
          },
          defaultVariants: {
            shadow: 'sm',
          },
        });
        const stack = cvb({
          variants: {
            gap: {
              unset: null,
              1: 'gap-1',
              2: 'gap-2',
              3: 'gap-3',
            },
          },
          defaultVariants: {
            gap: 'unset',
          },
        });
        const card = composeExtended(box, stack);

        expectTypeOf(card).toBeFunction();

        const cardClassList = card();
        const cardClassListSplit = cardClassList.split(' ');
        expect(cardClassListSplit[0]).toBe(PREFIX);
        expect(cardClassListSplit[cardClassListSplit.length - 1]).toBe(SUFFIX);

        const cardShadowGapClassList = card({ shadow: 'md', gap: 3 });
        const cardShadowGapClassListSplit = cardShadowGapClassList.split(' ');
        expect(cardShadowGapClassListSplit[0]).toBe(PREFIX);
        expect(cardShadowGapClassListSplit[cardShadowGapClassListSplit.length - 1]).toBe(SUFFIX);
      });

      test('should extend cvb', () => {
        const { cvb: cvbExtended } = defineConfig({
          hooks: {
            onComplete: onCompleteHandler,
          },
        });

        const component = cvbExtended({
          base: 'foo',
          variants: { intent: { primary: 'bar' } },
        });
        const componentClassList = component({ intent: 'primary' });
        const componentClassListSplit = componentClassList.split(' ');

        expectTypeOf(component).toBeFunction();
        expect(componentClassListSplit[0]).toBe(PREFIX);
        expect(componentClassListSplit[componentClassListSplit.length - 1]).toBe(SUFFIX);
      });

      test('should extend cx', () => {
        const { cx: cxExtended } = defineConfig({
          hooks: {
            onComplete: onCompleteHandler,
          },
        });

        const classList = cxExtended('foo', 'bar');
        const classListSplit = classList.split(' ');

        expectTypeOf(classList).toBeString();
        expect(classListSplit[0]).toBe(PREFIX);
        expect(classListSplit[classListSplit.length - 1]).toBe(SUFFIX);
      });
    });
  });
});
