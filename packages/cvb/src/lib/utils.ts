import type {
  ClassArray,
  ClassDictionary,
  ClassValue,
  CVBClassProp,
  Pretty,
  RecipeCompoundSelection,
  RecipeCompoundVariant,
  RecipeSelection,
  RecipeVariantRecord,
} from './types.js';

export const isEmpty = (obj: Record<PropertyKey, any>): boolean => Object.keys(obj).length === 0;

export const falsyToString = <T>(value: T) => (typeof value === 'boolean' ? `${value}` : value === 0 ? '0' : value);

/**
 * Merges two given objects, Props take precedence over Defaults
 * @param props
 * @param defaults
 * @returns
 */
export const mergeDefaultsAndProps = <
  T extends RecipeVariantRecord,
  P extends RecipeSelection<T> & CVBClassProp,
  D extends RecipeSelection<T>
>(
  props: P = {} as P,
  defaults: D
) => {
  const result: Record<PropertyKey, unknown> = { ...defaults };

  for (const key in props) {
    const value = props[key];
    if (typeof value !== 'undefined') {
      result[key] = value;
    }
  }

  return result as Record<keyof T, NonNullable<ClassValue>>;
};

/**
 * Returns a list of class variants based on the given Props and Defaults
 * @param props
 * @param variants
 * @param defaults
 * @returns
 */
export const getVariantClassNames = <
  V extends RecipeVariantRecord,
  P extends RecipeSelection<V> & CVBClassProp,
  D extends RecipeSelection<V>
>(
  props: P = {} as P,
  variants: V,
  defaults: D = {} as D
) => {
  const variantClassNames: ClassArray = [];

  for (const variant in variants) {
    const variantProp = props[variant] ?? defaults[variant];
    const variantKey = falsyToString(variantProp) as string;

    const className = variants[variant][variantKey];

    if (className) {
      variantClassNames.push(className);
    }
  }

  return variantClassNames;
};

/**
 * Returns selected compound className variants based on Props and Defaults
 * @param compoundVariants
 * @param defaultsAndProps
 * @returns
 */
export const getCompoundVariantClassNames = <V extends RecipeVariantRecord>(
  compoundVariants: Pretty<RecipeCompoundVariant<RecipeCompoundSelection<V>>>[],
  defaultsAndProps: ClassDictionary
) => {
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
};

export const getVariantClassNamesBySlot = (props: any = {}, slot: string, variants: any, defaults: any = {}) => {
  const variantClassNames: ClassValue[] = [];

  for (const variant in variants) {
    const variantProp = props[variant] ?? defaults[variant];
    const variantKey = falsyToString(variantProp);

    const className = variants[variant][variantKey]?.[slot];

    if (className) {
      variantClassNames.push(className);
    }
  }
  return variantClassNames;
};

export function getCompoundVariantClassNamesBySlot(slot: string, compoundVariants: any, defaultsAndProps: any) {
  const compoundClassNames: ClassValue[] = [];

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
    const className = compoundConfig.class?.[slot] ?? compoundConfig.className?.[slot];

    if (selectorMatches && className) {
      compoundClassNames.push(className);
    }
  }

  return compoundClassNames;
}
