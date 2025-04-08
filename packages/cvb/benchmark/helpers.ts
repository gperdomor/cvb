import { BenchOptions } from 'vitest';
import { SlotRecipeDefinition } from '../src';

export const benchOpts: BenchOptions = {
  time: 3000,
  setup: (_task, mode) => {
    // Run the garbage collector before warmup at each cycle
    if (mode === 'warmup' && typeof globalThis.gc === 'function') {
      globalThis.gc();
    }
  },
};

export const toTvConfig = (config: SlotRecipeDefinition) => {
  return {
    slots: { ...config.base },
    variants: config.variants,
    compoundVariants: config.compoundVariants,
    defaultVariants: config.defaultVariants,
  };
};
