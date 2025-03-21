import type {
  Compose,
  CX,
  DefineConfig,
  RecipeCreatorFn,
  RecipeDefinition,
  RecipeRuntimeFn,
  RecipeVariantFn,
  RecipeVariantRecord,
  SlotRecipeCreatorFn,
  SlotRecipeDefinition,
  SlotRecipeVariantFn,
  SlotRecipeVariantRecord,
  SlotRecord,
} from './types.js';
import {
  getCompoundVariantClassNames,
  getCompoundVariantClassNamesBySlot,
  getVariantClassNames,
  getVariantClassNamesBySlot,
  isEmpty,
  mergeDefaultsAndProps,
} from './utils.js';

const cxInternal: CX = (...inputs) => {
  let str = '',
    i = 0,
    arg: unknown;

  for (; i < inputs.length; ) {
    if ((arg = inputs[i++]) && typeof arg === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      str && (str += ' ');
      str += arg;
    }
  }
  return str;
};

export const defineConfig: DefineConfig = (options) => {
  const cx: CX = (...inputs) => {
    if (typeof options?.hooks?.onComplete === 'function') {
      return options.hooks.onComplete(cxInternal(...inputs));
    }

    return cxInternal(...inputs);
  };

  const cvb: RecipeCreatorFn = <T extends RecipeVariantRecord>(config: RecipeDefinition<T>): RecipeRuntimeFn<T> => {
    const { base, variants = {}, compoundVariants = [], defaultVariants = {} } = config ?? {};
    let cvbFn: RecipeVariantFn<T>;

    if (isEmpty(variants)) {
      cvbFn = (props) => cx(base, props?.class ?? props?.className);
    } else {
      cvbFn = (props) => {
        const variantClassNames = getVariantClassNames(props, variants, defaultVariants);
        const compoundVariantClassNames = getCompoundVariantClassNames(
          compoundVariants,
          mergeDefaultsAndProps(props, defaultVariants)
        );
        return cx(base, variantClassNames, compoundVariantClassNames, props?.class ?? props?.className);
      };
    }

    return Object.assign(cvbFn, {
      raw: config,
    });
  };

  const svb: SlotRecipeCreatorFn = <S extends string, T extends SlotRecipeVariantRecord<S>>(
    config: SlotRecipeDefinition<S, T>
  ) => {
    const { slots = [], base, variants = {}, compoundVariants = [], defaultVariants = {} } = config ?? {};

    const svbFn: SlotRecipeVariantFn<S, T> = (props) => {
      const obj: SlotRecord<string, string> = {};
      const { class: _class, className, ...propsWithoutClass } = props ?? {};

      for (const slotKey of slots) {
        obj[slotKey] = cx(
          base?.[slotKey],
          getVariantClassNamesBySlot(propsWithoutClass, slotKey, variants, defaultVariants),
          getCompoundVariantClassNamesBySlot(
            slotKey,
            compoundVariants,
            mergeDefaultsAndProps(propsWithoutClass, defaultVariants)
          ),
          _class?.[slotKey] ?? className?.[slotKey]
        );
      }
      return obj;
    };

    return Object.assign(svbFn, {
      raw: config,
    });
  };

  const compose: Compose =
    (...components) =>
    (props) => {
      const { class: _class, className, ...propsWithoutClass } = props ?? {};

      return cx(...components.map((component) => component(propsWithoutClass)), _class ?? className);
    };

  return {
    compose,
    cvb,
    svb,
    cx,
  };
};

export const { compose, cvb, svb, cx } = defineConfig();
