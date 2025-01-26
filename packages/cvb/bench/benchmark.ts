import { cva } from 'cva';
import { Bench } from 'tinybench';
import { cvb, svb } from '../src/';
import { RecipeDefinition, SlotRecipeDefinition } from '../src/lib/types';

const button: RecipeDefinition = {
  base: 'button font-semibold border rounded',
  variants: {
    intent: {
      unset: null,
      primary: 'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600',
      secondary: 'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
      warning: 'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600',
      danger: 'button--danger hover:bg-red-600',
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
      class: 'button--warning-disabled text-black',
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
};

const checkbox: SlotRecipeDefinition = {
  slots: ['root', 'control', 'label'],
  base: {
    root: 'flex items-center gap-2',
    control: 'border rounded-sm',
    label: 'ms-2',
  },
  variants: {
    variant: {
      success: {
        control: 'bg-green-500',
      },
      warning: {
        control: 'bg-yellow-500',
      },
      danger: {
        control: 'bg-red-500',
        label: 'font-bold',
      },
    },
    size: {
      sm: {
        control: 'w-2 h-2',
        label: 'text-sm',
      },
      md: {
        control: 'w-2.5 h-2.5',
        label: 'text-md',
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
};

async function run() {
  const benchmark = new Bench({ name: 'Becnhmark', time: 5000 });

  benchmark.add('cva', () => {
    const buttonVariants = cva(button);
    buttonVariants({});
    buttonVariants({ intent: 'primary', disabled: true });
    buttonVariants({ intent: 'primary', size: 'medium' });
    buttonVariants({ intent: 'warning', size: 'medium', disabled: true });
    buttonVariants({ size: 'small' });
    buttonVariants({ size: 'large', intent: 'unset' });
  });

  benchmark.add('cvb', () => {
    const buttonVariants = cvb(button);
    buttonVariants({});
    buttonVariants({ intent: 'primary', disabled: true });
    buttonVariants({ intent: 'primary', size: 'medium' });
    buttonVariants({ intent: 'warning', size: 'medium', disabled: true });
    buttonVariants({ size: 'small' });
    buttonVariants({ size: 'large', intent: 'unset' });
  });

  benchmark.add('svb (Slots)', () => {
    const alertVariants = svb(checkbox);
    alertVariants({});
    alertVariants({ variant: 'success', disabled: true });
    alertVariants({ variant: 'success', size: 'md' });
    alertVariants({ variant: 'warning', size: 'md', disabled: true });
    alertVariants({ size: 'sm' });
    alertVariants({ size: 'lg' });
  });

  await benchmark.run();

  console.log(benchmark.name);
  console.table(benchmark.table());

  process.exit();
}

run();
