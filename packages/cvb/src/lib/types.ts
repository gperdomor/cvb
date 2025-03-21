/* =============================================================================
 * Types
 * =============================================================================*/

/* -----------------------------------------
 * clsx
 * -----------------------------------------*/

export type ClassValue = string | boolean | null | undefined;
export type ClassDictionary = Record<string, any>;

/* -----------------------------------------
 * Utils
 * -----------------------------------------*/

export type Pretty<T> = { [K in keyof T]: T[K] } & {};
type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T;
type OneOrMore<T> = T | Array<T>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type OmitUndefined<T> = T extends undefined ? never : T;

/**
 * Extract the variant as optional props from a `cvb` or `svb` function.
 * Intended to be used with a JSX component.
 */
export type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  'class' | 'className'
>;

/* -----------------------------------------
 * compose
 * -----------------------------------------*/

export interface Compose {
  <T extends ReturnType<RecipeCreatorFn>[]>(...components: [...T]): (
    props?: (
      | UnionToIntersection<
          {
            [K in keyof T]: VariantProps<T[K]>;
          }[number]
        >
      | undefined
    ) &
      ClassProp
  ) => string;
}

/* -----------------------------------------
 * cx
 * -----------------------------------------*/

export interface CX {
  (...inputs: ClassValue[]): string;
}

export type CXOptions = Parameters<CX>;
export type CXReturn = ReturnType<CX>;

/* =============================================================================
 * cvb
 * =============================================================================*/

export type ClassProp =
  | {
      class?: ClassValue;
      className?: never;
    }
  | {
      class?: never;
      className?: ClassValue;
    };

export type RecipeVariantRecord = Record<any, Record<any, ClassValue>>;
export type RecipeSelection<T extends RecipeVariantRecord | SlotRecipeVariantRecord<string>> = {
  [K in keyof T]?: StringToBoolean<keyof T[K]> | undefined;
};

/* -----------------------------------------
 * Recipe / Standard
 * -----------------------------------------*/

export type RecipeVariantFn<T extends RecipeVariantRecord> = (props?: RecipeSelection<T> & ClassProp) => string;

export type RecipeCompoundSelection<T> = {
  [K in keyof T]?: OneOrMore<StringToBoolean<keyof T[K]>> | undefined;
};

export type RecipeCompoundVariant<T> = T & ClassProp;

export interface RecipeDefinition<T extends RecipeVariantRecord = RecipeVariantRecord> {
  /**
   * The base styles of the recipe.
   */
  base?: ClassValue;
  /**
   * The multi-variant styles of the recipe.
   */
  variants?: T;
  /**
   * The styles to apply when a combination of variants is selected.
   */
  compoundVariants?: Pretty<RecipeCompoundVariant<RecipeCompoundSelection<T>>>[];
  /**
   * The default variants of the recipe.
   */
  defaultVariants?: RecipeSelection<T>;
}

export type RecipeCreatorFn = <T extends RecipeVariantRecord>(config: RecipeDefinition<T>) => RecipeRuntimeFn<T>;

export interface RecipeRuntimeFn<T extends RecipeVariantRecord> extends RecipeVariantFn<T> {
  raw: RecipeDefinition<T>;
}
/* -----------------------------------------
 * Recipe / Slot
 * -----------------------------------------*/

export type SlotRecord<S extends string, T> = Partial<Record<S, T>>;

export type SlotRecipeVariantRecord<S extends string> = Record<any, Record<any, SlotRecord<S, ClassValue>>>;

export type SlotRecipeVariantFn<S extends string, T extends SlotRecipeVariantRecord<S>> = (
  props?: RecipeSelection<T> & SlotClassProp<S>
) => SlotRecord<S, string>;

export type SlotClassProp<S extends string> =
  | {
      class?: SlotRecord<S, ClassValue>;
      className?: never;
    }
  | {
      class?: never;
      className?: SlotRecord<S, ClassValue>;
    };

export type SlotRecipeCompoundVariant<S extends string, T> = T & SlotClassProp<S>;

export interface SlotRecipeDefinition<
  S extends string = string,
  T extends SlotRecipeVariantRecord<S> = SlotRecipeVariantRecord<S>
> {
  /**
   * The parts/slots of the recipe.
   */
  slots: S[] | Readonly<S[]>;
  /**
   * The base styles of the recipe.
   */
  base?: SlotRecord<S, ClassValue>;
  /**
   * The multi-variant styles of the recipe.
   */
  variants?: T;
  /**
   * The default variants of the recipe.
   */
  defaultVariants?: RecipeSelection<T>;
  /**
   * The styles to apply when a combination of variants is selected.
   */
  compoundVariants?: Pretty<SlotRecipeCompoundVariant<S, RecipeCompoundSelection<T>>>[];
}

export type SlotRecipeCreatorFn = <S extends string, T extends SlotRecipeVariantRecord<S>>(
  config: SlotRecipeDefinition<S, T>
) => SlotRecipeRuntimeFn<S, T>;

export interface SlotRecipeRuntimeFn<S extends string, T extends SlotRecipeVariantRecord<S>>
  extends SlotRecipeVariantFn<S, T> {
  raw: SlotRecipeDefinition<S, T>;
}

/* -----------------------------------------
 * defineConfig
 * -----------------------------------------*/

export interface DefineConfigOptions {
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
    cvb: RecipeCreatorFn;
    svb: SlotRecipeCreatorFn;
  };
}
