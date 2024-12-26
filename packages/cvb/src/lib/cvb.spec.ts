/* eslint-disable no-constant-binary-expression */
import type * as CVB from './cvb.js';
import { compose, cvb, cx, defineConfig } from './cvb.js';

describe('cx', () => {
  describe.each<CVB.CXOptions>([
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

describe('cvb', () => {
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
      });
      const buttonWithoutBaseWithoutDefaultsWithClassNameString = cvb({
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
            className: 'button--primary-medium uppercase',
          },
          {
            intent: 'warning',
            disabled: false,
            className: 'button--warning-enabled text-gray-800',
          },
          {
            intent: 'warning',
            disabled: true,
            className: ['button--warning-disabled', [1 && 'text-black', { baz: false, bat: null }]],
          },
        ],
      });

      const buttonWithoutBaseWithoutDefaultsArray = cvb({
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
      });
      const buttonWithoutBaseWithoutDefaultsWithClassNameArray = cvb({
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
            className: ['button--primary-medium', 'uppercase'],
          },
          {
            intent: 'warning',
            disabled: false,
            className: ['button--warning-enabled', 'text-gray-800'],
          },
          {
            intent: 'warning',
            disabled: true,
            className: ['button--warning-disabled', [1 && 'text-black', { baz: false, bat: null }]],
          },
        ],
      });

      type ButtonWithoutDefaultsWithoutBaseProps =
        | CVB.VariantProps<typeof buttonWithoutBaseWithoutDefaultsString>
        | CVB.VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameString>
        | CVB.VariantProps<typeof buttonWithoutBaseWithoutDefaultsArray>
        | CVB.VariantProps<typeof buttonWithoutBaseWithoutDefaultsWithClassNameArray>;

      describe.each<[ButtonWithoutDefaultsWithoutBaseProps, string]>([
        // @ts-expect-error Invalid variant
        [undefined, ''],
        [{}, ''],
        [
          {
            aCheekyInvalidProp: 'lol',
          } as ButtonWithoutDefaultsWithoutBaseProps,
          '',
        ],
        [{ intent: 'secondary' }, 'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100'],
        [{ size: 'small' }, 'button--small text-sm py-1 px-2'],
        [{ disabled: true }, 'button--disabled opacity-050 cursor-not-allowed'],
        [
          {
            intent: 'secondary',
            size: 'unset',
          },
          'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
        ],
        [
          { intent: 'secondary', size: undefined },
          'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
        ],
        [
          { intent: 'danger', size: 'medium' },
          'button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--medium text-base py-2 px-4',
        ],
        [
          { intent: 'warning', size: 'large' },
          'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4',
        ],
        [
          { intent: 'warning', size: 'large', disabled: true },
          'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black',
        ],
        [
          { intent: 'primary', m: 0 },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-0',
        ],
        [
          { intent: 'primary', m: 1 },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1',
        ],
        // !@TODO Add type "extractor" including class prop
        [
          {
            intent: 'primary',
            m: 1,
            class: 'adhoc-class',
          } as ButtonWithoutDefaultsWithoutBaseProps,
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1 adhoc-class',
        ],
        [
          {
            intent: 'primary',
            m: 1,
            className: 'adhoc-classname',
          } as ButtonWithoutDefaultsWithoutBaseProps,
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 m-1 adhoc-classname',
        ],
        // typings needed
      ])('button(%o)', (options, expected) => {
        test(`returns ${expected}`, () => {
          expect(buttonWithoutBaseWithoutDefaultsString(options)).toBe(expected);
          expect(buttonWithoutBaseWithoutDefaultsWithClassNameString(options)).toBe(expected);
          expect(buttonWithoutBaseWithoutDefaultsArray(options)).toBe(expected);
          expect(buttonWithoutBaseWithoutDefaultsWithClassNameArray(options)).toBe(expected);
        });
      });
    });

    describe('with defaults', () => {
      const buttonWithoutBaseWithDefaultsString = cvb({
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
          m: 0,
          disabled: false,
          intent: 'primary',
          size: 'medium',
        },
      });
      const buttonWithoutBaseWithDefaultsWithClassNameString = cvb({
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
            className: 'button--primary-medium uppercase',
          },
          {
            intent: 'warning',
            disabled: false,
            className: 'button--warning-enabled text-gray-800',
          },
          {
            intent: 'warning',
            disabled: true,
            className: ['button--warning-disabled', [1 && 'text-black', { baz: false, bat: null }]],
          },
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
        defaultVariants: {
          m: 0,
          disabled: false,
          intent: 'primary',
          size: 'medium',
        },
      });

      const buttonWithoutBaseWithDefaultsArray = cvb({
        base: ['button', 'font-semibold', 'border', 'rounded'],
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
          {
            intent: ['warning', 'danger'],
            class: ['button--warning-danger', '!border-red-500'],
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: ['button--warning-danger-medium'],
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: false,
          intent: 'primary',
          size: 'medium',
        },
      });
      const buttonWithoutBaseWithDefaultsWithClassNameArray = cvb({
        base: ['button', 'font-semibold', 'border', 'rounded'],
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
            className: ['button--primary-medium', 'uppercase'],
          },
          {
            intent: 'warning',
            disabled: false,
            className: ['button--warning-enabled', 'text-gray-800'],
          },
          {
            intent: 'warning',
            disabled: true,
            className: ['button--warning-disabled', [1 && 'text-black', { baz: false, bat: null }]],
          },
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
        defaultVariants: {
          m: 0,
          disabled: false,
          intent: 'primary',
          size: 'medium',
        },
      });

      type ButtonWithoutBaseWithDefaultsProps =
        | CVB.VariantProps<typeof buttonWithoutBaseWithDefaultsString>
        | CVB.VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameString>
        | CVB.VariantProps<typeof buttonWithoutBaseWithDefaultsArray>
        | CVB.VariantProps<typeof buttonWithoutBaseWithDefaultsWithClassNameArray>;

      describe.each<[ButtonWithoutBaseWithDefaultsProps, string]>([
        [
          // @ts-expect-error Invalid variant
          undefined,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          {},
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          {
            aCheekyInvalidProp: 'lol',
          } as ButtonWithoutBaseWithDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          { intent: 'secondary' },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0',
        ],

        [
          { size: 'small' },
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--small text-sm py-1 px-2 m-0',
        ],
        [
          { disabled: true },
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          {
            intent: 'secondary',
            size: 'unset',
          },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer m-0',
        ],
        [
          { intent: 'secondary', size: undefined },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0',
        ],
        [
          { intent: 'danger', size: 'medium' },
          'button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--warning-danger !border-red-500 button--warning-danger-medium',
        ],
        [
          { intent: 'warning', size: 'large' },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 m-0 button--warning-enabled text-gray-800 button--warning-danger !border-red-500',
        ],
        [
          { intent: 'warning', size: 'large', disabled: true },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 m-0 button--warning-disabled text-black button--warning-danger !border-red-500',
        ],
        [
          { intent: 'primary', m: 0 },
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          { intent: 'primary', m: 1 },
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-1 button--primary-medium uppercase',
        ],
        // !@TODO Add type "extractor" including class prop
        [
          {
            intent: 'primary',
            m: 0,
            class: 'adhoc-class',
          } as ButtonWithoutBaseWithDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase adhoc-class',
        ],
        [
          {
            intent: 'primary',
            m: 1,
            className: 'adhoc-classname',
          } as ButtonWithoutBaseWithDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-1 button--primary-medium uppercase adhoc-classname',
        ],
      ])('button(%o)', (options, expected) => {
        test(`returns ${expected}`, () => {
          expect(buttonWithoutBaseWithDefaultsString(options)).toBe(expected);
          expect(buttonWithoutBaseWithDefaultsWithClassNameString(options)).toBe(expected);
          expect(buttonWithoutBaseWithDefaultsArray(options)).toBe(expected);
          expect(buttonWithoutBaseWithDefaultsWithClassNameArray(options)).toBe(expected);
        });
      });
    });
  });

  describe('with base', () => {
    describe('without defaults', () => {
      const buttonWithBaseWithoutDefaultsString = cvb({
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
        },
        compoundVariants: [
          {
            intent: 'primary',
            size: 'medium',
            className: 'button--primary-medium uppercase',
          },
          {
            intent: 'warning',
            disabled: false,
            className: 'button--warning-enabled text-gray-800',
          },
          {
            intent: 'warning',
            disabled: true,
            className: ['button--warning-disabled', [1 && 'text-black', { baz: false, bat: null }]],
          },
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
      });

      const buttonWithBaseWithoutDefaultsArray = cvb({
        base: ['button', 'font-semibold', 'border', 'rounded'],
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
          {
            intent: ['warning', 'danger'],
            class: ['button--warning-danger', '!border-red-500'],
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: ['button--warning-danger-medium'],
          },
        ],
      });
      const buttonWithBaseWithoutDefaultsWithClassNameArray = cvb({
        base: ['button', 'font-semibold', 'border', 'rounded'],
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
        },
        compoundVariants: [
          {
            intent: 'primary',
            size: 'medium',
            className: ['button--primary-medium', 'uppercase'],
          },
          {
            intent: 'warning',
            disabled: false,
            className: ['button--warning-enabled', 'text-gray-800'],
          },
          {
            intent: 'warning',
            disabled: true,
            className: ['button--warning-disabled', [1 && 'text-black', { baz: false, bat: null }]],
          },
          {
            intent: ['warning', 'danger'],
            className: ['button--warning-danger', '!border-red-500'],
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            className: ['button--warning-danger-medium'],
          },
        ],
      });

      type ButtonWithBaseWithoutDefaultsProps =
        | CVB.VariantProps<typeof buttonWithBaseWithoutDefaultsString>
        | CVB.VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameString>
        | CVB.VariantProps<typeof buttonWithBaseWithoutDefaultsArray>
        | CVB.VariantProps<typeof buttonWithBaseWithoutDefaultsWithClassNameArray>;

      describe.each<[ButtonWithBaseWithoutDefaultsProps, string]>([
        [undefined as unknown as ButtonWithBaseWithoutDefaultsProps, 'button font-semibold border rounded'],
        [{}, 'button font-semibold border rounded'],
        [
          {
            // @ts-expect-error Invalid variant
            aCheekyInvalidProp: 'lol',
          },
          'button font-semibold border rounded',
        ],
        [
          { intent: 'secondary' },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
        ],

        [{ size: 'small' }, 'button font-semibold border rounded button--small text-sm py-1 px-2'],
        [{ disabled: false }, 'button font-semibold border rounded button--enabled cursor-pointer'],
        [{ disabled: true }, 'button font-semibold border rounded button--disabled opacity-050 cursor-not-allowed'],
        [
          { intent: 'secondary', size: 'unset' },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
        ],
        [
          { intent: 'secondary', size: undefined },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
        ],
        [
          { intent: 'danger', size: 'medium' },
          'button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--medium text-base py-2 px-4 button--warning-danger !border-red-500 button--warning-danger-medium',
        ],
        [
          { intent: 'warning', size: 'large' },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500',
        ],
        [
          { intent: 'warning', size: 'large', disabled: 'unset' },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500',
        ],
        [
          { intent: 'warning', size: 'large', disabled: true },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black button--warning-danger !border-red-500',
        ],
        [
          { intent: 'warning', size: 'large', disabled: false },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500',
        ],
        // !@TODO Add type "extractor" including class prop
        [
          {
            intent: 'primary',
            class: 'adhoc-class',
          } as ButtonWithBaseWithoutDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 adhoc-class',
        ],
        [
          {
            intent: 'primary',
            className: 'adhoc-className',
          } as ButtonWithBaseWithoutDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 adhoc-className',
        ],
      ])('button(%o)', (options, expected) => {
        test(`returns ${expected}`, () => {
          expect(buttonWithBaseWithoutDefaultsString(options)).toBe(expected);
          expect(buttonWithBaseWithoutDefaultsWithClassNameString(options)).toBe(expected);
          expect(buttonWithBaseWithoutDefaultsArray(options)).toBe(expected);
          expect(buttonWithBaseWithoutDefaultsWithClassNameArray(options)).toBe(expected);
        });
      });
    });

    describe('with defaults', () => {
      const buttonWithBaseWithDefaultsString = cvb({
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
          disabled: false,
          intent: 'primary',
          size: 'medium',
        },
      });
      const buttonWithBaseWithDefaultsWithClassNameString = cvb({
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
        },
        compoundVariants: [
          {
            intent: 'primary',
            size: 'medium',
            className: 'button--primary-medium uppercase',
          },
          {
            intent: 'warning',
            disabled: false,
            className: 'button--warning-enabled text-gray-800',
          },
          {
            intent: 'warning',
            disabled: true,
            className: ['button--warning-disabled', [1 && 'text-black', { baz: false, bat: null }]],
          },
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
        defaultVariants: {
          disabled: false,
          intent: 'primary',
          size: 'medium',
        },
      });

      const buttonWithBaseWithDefaultsArray = cvb({
        base: ['button', 'font-semibold', 'border', 'rounded'],
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
          {
            intent: ['warning', 'danger'],
            class: ['button--warning-danger', '!border-red-500'],
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            class: ['button--warning-danger-medium'],
          },
        ],
        defaultVariants: {
          disabled: false,
          intent: 'primary',
          size: 'medium',
        },
      });
      const buttonWithBaseWithDefaultsWithClassNameArray = cvb({
        base: ['button', 'font-semibold', 'border', 'rounded'],
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
        },
        compoundVariants: [
          {
            intent: 'primary',
            size: 'medium',
            className: ['button--primary-medium', 'uppercase'],
          },
          {
            intent: 'warning',
            disabled: false,
            className: ['button--warning-enabled', 'text-gray-800'],
          },
          {
            intent: 'warning',
            disabled: true,
            className: ['button--warning-disabled', [1 && 'text-black', { baz: false, bat: null }]],
          },
          {
            intent: ['warning', 'danger'],
            className: ['button--warning-danger', '!border-red-500'],
          },
          {
            intent: ['warning', 'danger'],
            size: 'medium',
            className: ['button--warning-danger-medium'],
          },
        ],
        defaultVariants: {
          disabled: false,
          intent: 'primary',
          size: 'medium',
        },
      });

      type ButtonWithBaseWithDefaultsProps =
        | CVB.VariantProps<typeof buttonWithBaseWithDefaultsString>
        | CVB.VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameString>
        | CVB.VariantProps<typeof buttonWithBaseWithDefaultsArray>
        | CVB.VariantProps<typeof buttonWithBaseWithDefaultsWithClassNameArray>;

      describe.each<[ButtonWithBaseWithDefaultsProps, string]>([
        [
          // @ts-expect-error Invalid variant
          undefined,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase',
        ],
        [
          {},
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase',
        ],
        [
          {
            aCheekyInvalidProp: 'lol',
          } as ButtonWithBaseWithDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase',
        ],
        [
          { intent: 'secondary' },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4',
        ],

        [
          { size: 'small' },
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--small text-sm py-1 px-2',
        ],
        [
          { disabled: 'unset' },
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--medium text-base py-2 px-4 button--primary-medium uppercase',
        ],
        [
          { disabled: false },
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase',
        ],
        [
          { disabled: true },
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 button--primary-medium uppercase',
        ],
        [
          { intent: 'secondary', size: 'unset' },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer',
        ],
        [
          { intent: 'secondary', size: undefined },
          'button font-semibold border rounded button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer button--medium text-base py-2 px-4',
        ],
        [
          { intent: 'danger', size: 'medium' },
          'button font-semibold border rounded button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--warning-danger !border-red-500 button--warning-danger-medium',
        ],
        [
          { intent: 'warning', size: 'large' },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500',
        ],
        [
          {
            intent: 'warning',
            size: 'large',
            disabled: 'unset',
          },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--large text-lg py-2.5 px-4 button--warning-danger !border-red-500',
        ],
        [
          { intent: 'warning', size: 'large', disabled: true },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black button--warning-danger !border-red-500',
        ],
        [
          { intent: 'warning', size: 'large', disabled: false },
          'button font-semibold border rounded button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800 button--warning-danger !border-red-500',
        ],
        // !@TODO Add type "extractor" including class prop
        [
          {
            intent: 'primary',
            class: 'adhoc-class',
          } as ButtonWithBaseWithDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase adhoc-class',
        ],
        [
          {
            intent: 'primary',
            className: 'adhoc-classname',
          } as ButtonWithBaseWithDefaultsProps,
          'button font-semibold border rounded button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 button--primary-medium uppercase adhoc-classname',
        ],
      ])('button(%o)', (options, expected) => {
        test(`returns ${expected}`, () => {
          expect(buttonWithBaseWithDefaultsString(options)).toBe(expected);
          expect(buttonWithBaseWithDefaultsWithClassNameString(options)).toBe(expected);
          expect(buttonWithBaseWithDefaultsArray(options)).toBe(expected);
          expect(buttonWithBaseWithDefaultsWithClassNameArray(options)).toBe(expected);
        });
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
