import { withCodSpeed } from '@codspeed/tinybench-plugin';
import { Bench } from 'tinybench';
import { registerCompositionBenchmarks } from './compose-usage.bench';
import { registerRecipeCreationBenchmarks } from './recipe-creation.bench';
import { registerRecipeUsageBenchmarks } from './recipe-usage.bench';
import { registerSlotRecipeCreationBenchmarks } from './slot-recipe-creation.bench';
import { registerSlotRecipeUsageBenchmarks } from './slot-recipe-usage.bench';

export const bench = withCodSpeed(
  new Bench({
    time: 1000,
    setup: (_task, mode) => {
      // Run the garbage collector before warmup at each cycle
      if (mode === 'warmup' && typeof globalThis.gc === 'function') {
        globalThis.gc();
      }
    },
  })
);

(async () => {
  registerRecipeCreationBenchmarks(bench);
  registerRecipeUsageBenchmarks(bench);
  registerCompositionBenchmarks(bench);
  registerSlotRecipeCreationBenchmarks(bench);
  registerSlotRecipeUsageBenchmarks(bench);

  await bench.run();
  console.table(bench.table());
})();
