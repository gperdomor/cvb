import { clsx } from 'clsx';
import { clsx as lclsx } from 'clsx/lite';

/* Types
  ============================================ */

/* clsx
  ---------------------------------- */

export type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];

/* Utils
  ---------------------------------- */

const isEmpty = (obj: Record<PropertyKey, any>): boolean => Object.keys(obj).length === 0;
type OmitUndefined<T> = T extends undefined ? never : T;
type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  'class' | 'className'
>;

/* compose
  ---------------------------------- */

export interface Compose {
  <T extends ReturnType<CVB>[]>(...components: [...T]): (
    props?: (
      | UnionToIntersection<
          {
            [K in keyof T]: VariantProps<T[K]>;
          }[number]
        >
      | undefined
    ) &
      CVBClassProp
  ) => string;
}

/* cx
  ---------------------------------- */

export interface CX {
  (...inputs: ClassValue[]): string;
}

export type CXOptions = Parameters<CX>;
export type CXReturn = ReturnType<CX>;

/* cvb
  ============================================ */

type CVBConfigBase = { base?: ClassValue };
type CVBVariantShape = Record<string, Record<string, ClassValue>>;
type CVBVariantSchema<V extends CVBVariantShape> = {
  [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | undefined;
};
type CVBClassProp =
  | {
      class?: ClassValue;
      className?: never;
    }
  | {
      class?: never;
      className?: ClassValue;
    };

type CVBCompoundVariants<V extends CVBVariantShape> = ((
  | CVBVariantSchema<V>
  | {
      [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | StringToBoolean<keyof V[Variant]>[] | undefined;
    }
) &
  CVBClassProp)[];

export interface CVB {
  <_ extends "cvb's generic parameters are restricted to internal use only.", V extends CVBVariantShape>(
    config: CVBConfigBase & {
      variants: V;
      compoundVariants?: CVBCompoundVariants<V>;
      defaultVariants?: CVBVariantSchema<V>;
    }
  ): (props?: CVBVariantSchema<V> & CVBClassProp) => string;
}

/* defineConfig
  ---------------------------------- */

export interface DefineConfigOptions {
  mode?: 'normal' | 'lite';
  hooks?: {
    /**
     * Returns the completed string of concatenated classes/classNames.
     */
    onComplete?: (className: string) => string;
  };
}

export interface DefineConfig {
  (options?: DefineConfigOptions): {
    compose: Compose;
    cx: CX;
    cvb: CVB;
  };
}

/* Internal helper functions
  ============================================ */

/**
 * Merges two given objects, Props take precedence over Defaults
 * */
function mergeDefaultsAndProps<
  V extends CVBVariantShape,
  P extends Record<PropertyKey, unknown>,
  D extends CVBVariantSchema<V>
>(props: P = {} as P, defaults: D) {
  const result: Record<PropertyKey, unknown> = { ...defaults };

  for (const key in props) {
    const value = props[key];
    if (typeof value !== 'undefined') {
      result[key] = value;
    }
  }

  return result as Record<keyof V, NonNullable<ClassValue>>;
}

/**
 * Returns a list of class variants based on the given Props and Defaults
 * */
function getVariantClassNames<
  P extends Record<PropertyKey, unknown> & CVBClassProp,
  V extends CVBVariantShape,
  D extends CVBVariantSchema<V>
>(props: P = {} as P, variants: V, defaults: D = {} as D) {
  const variantClassNames: ClassArray = [];

  for (const variant in variants) {
    const variantProp = props[variant] || defaults[variant];
    const variantKey = falsyToString(variantProp) as string;

    const className = variants[variant][variantKey];

    if (className) {
      variantClassNames.push(className);
    }
  }

  return variantClassNames;
}

/**
 * Returns selected compound className variants based on Props and Defaults
 * */
function getCompoundVariantClassNames<V extends CVBVariantShape>(
  compoundVariants: CVBCompoundVariants<V>,
  defaultsAndProps: ClassDictionary
) {
  const compoundClassNames: ClassArray = [];

  for (const compoundConfig of compoundVariants) {
    let selectorMatches = true;

    for (const cvKey in compoundConfig) {
      if (cvKey === 'class' || cvKey === 'className') continue;

      const cvSelector = compoundConfig[cvKey];
      const selector = defaultsAndProps[cvKey];

      const matches = Array.isArray(cvSelector) ? cvSelector.includes(selector) : selector === cvSelector;

      if (!matches) {
        selectorMatches = false;
        break;
      }
    }

    if (selectorMatches) {
      compoundClassNames.push(compoundConfig.class ?? compoundConfig.className);
    }
  }

  return compoundClassNames;
}

const falsyToString = <T>(value: T) => (typeof value === 'boolean' ? `${value}` : value === 0 ? '0' : value);

/* Exports
  ============================================ */

export const defineConfig: DefineConfig = (options) => {
  const cx: CX = (...inputs) => {
    const cn = options?.mode === 'lite' ? lclsx : clsx;
    if (typeof options?.hooks?.onComplete === 'function') {
      return options.hooks.onComplete(cn(inputs));
    }

    return cn(inputs);
  };

  const cvb: CVB = (config) => {
    const { variants = {}, defaultVariants = {}, base, compoundVariants = [] } = config ?? {};

    if (isEmpty(variants)) {
      return (props) => cx(base, props?.class ?? props?.className);
    }

    return (props) => {
      const variantClassNames = getVariantClassNames(props, variants, defaultVariants);
      const compoundVariantClassNames = getCompoundVariantClassNames(
        compoundVariants,
        mergeDefaultsAndProps(props, defaultVariants)
      );

      return cx(base, variantClassNames, compoundVariantClassNames, props?.class ?? props?.className);
    };
  };

  const compose: Compose =
    (...components) =>
    (props) => {
      const { class: _class, className, ...propsWithoutClass } = props ?? {};

      return cx(
        components.map((component) => component(propsWithoutClass)),
        props?.class ?? props?.className
      );
    };

  return {
    compose,
    cvb,
    cx,
  };
};

export const { compose, cvb, cx } = defineConfig();
