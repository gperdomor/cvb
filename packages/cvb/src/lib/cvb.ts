import { clsx } from 'clsx';
import { clsx as lclsx } from 'clsx/lite';
import type { Compose, CX, DefineConfig, RecipeCreatorFn, SlotRecipeCreatorFn, SlotRecord } from './types.js';
import {
  getCompoundVariantClassNames,
  getCompoundVariantClassNamesBySlot,
  getVariantClassNames,
  getVariantClassNamesBySlot,
  isEmpty,
  mergeDefaultsAndProps,
} from './utils.js';

export const defineConfig: DefineConfig = (options) => {
  const cx: CX = (...inputs) => {
    const cn = options?.mode === 'lite' ? lclsx : clsx;
    if (typeof options?.hooks?.onComplete === 'function') {
      return options.hooks.onComplete(cn(inputs));
    }

    return cn(inputs);
  };

  const cvb: RecipeCreatorFn = (config) => {
    const { base, variants = {}, compoundVariants = [], defaultVariants = {} } = config ?? {};

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

  const svb: SlotRecipeCreatorFn = (config) => {
    const { slots = [], base, variants = {}, compoundVariants = [], defaultVariants = {} } = config ?? {};

    return (props) => {
      const obj: SlotRecord<string, string> = {};

      for (const slotKey of slots) {
        obj[slotKey] = cx(
          base?.[slotKey],
          getVariantClassNamesBySlot(props, slotKey, variants, defaultVariants),
          getCompoundVariantClassNamesBySlot(slotKey, compoundVariants, mergeDefaultsAndProps(props, defaultVariants)),
          props?.class ?? props?.className
        );
      }
      return obj;
    };
  };

  const compose: Compose =
    (...components) =>
    (props) => {
      const { class: _class, className, ...propsWithoutClass } = props ?? {};

      return cx(
        components.map((component) => component(propsWithoutClass)),
        _class ?? className
      );
    };

  return {
    compose,
    cvb,
    svb,
    cx,
  };
};

export const { compose, cvb, svb, cx } = defineConfig();
