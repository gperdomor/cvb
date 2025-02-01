<p align="center">
  <strong>C</strong>lass <strong>V</strong>ariance <strong>B</strong>uilder
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/cvb">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/cvb">
  </a>
  <a href="https://www.npmjs.com/package/cvb">
    <img alt="NPM Type Definitions" src="https://img.shields.io/npm/types/cvb">
  </a>
  <a href="https://bundlephobia.com/package/cvb">
    <img alt="Minizipped Size" src="https://img.shields.io/bundlephobia/minzip/cvb" />
  </a>
  <a href="https://github.com/gperdomor/cvb/blob/main/LICENSE">
    <img alt="GitHub License" src="https://img.shields.io/github/license/gperdomor/cvb">
  </a>
  <a href="https://www.npmjs.com/package/class-variance-authority">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/cvb">
  </a>
</p>

## Features

- ✨ First-class variant API
- 🚀 Slots support
- 🧬 Composition support
- 💪 Type-safe styles and autocomplete
- 🦄 Framework agnostic
- 0️⃣ Zero dependencies

## Documentation

Visit our [official documentation](https://class-variance-builder.vercel.app).

## Install

The **recommended** way to install the latest version of Class Variance Builder is by running the command below:

```bash
npm i cvb
```

Simple component:

```jsx
import { cvb } from 'cvb';

const button = cvb({
  base: 'font-semibold text-white text-sm py-1 px-4 rounded-full active:opacity-80',
  variants: {
    color: {
      primary: 'bg-blue-500 hover:bg-blue-700',
      secondary: 'bg-purple-500 hover:bg-purple-700',
      success: 'bg-green-500 hover:bg-green-700',
    },
  },
});

function Example() {
  return <button className={button({ color: 'secondary' })}>Click me</button>;
}
```

Multi part (Slots) component:

```jsx
import { svb } from 'cvb';

const progressBar = svb({
  slots: ['root', 'track'],
  base: {
    root: 'w-full bg-gray-200 rounded-full',
    track: 'rounded-full',
  },
  variants: {
    color: {
      blue: {
        track: 'bg-blue-600',
      },
      red: {
        track: 'bg-red-600',
      },
    },
    size: {
      small: {
        root: 'h-1.5',
        track: 'h-1.5',
      },
      medium: {
        root: 'h-2.5',
        track: 'h-2.5',
      },
      large: {
        root: 'h-4',
        track: 'h-4',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
    color: 'blue',
  },
});

function Example() {
  const { root, track } = progressBar({ color, size });
  return (
    <div className={root}>
      <div className={track} style={{ width: '45%' }}></div>
    </div>
  );
}
```

## Acknowledgement

The development of **Class Variance Builder** was only possible due to the inspiration and ideas from these amazing projects

- [CVA](https://cva.style/) - a great tool for generating variants for a single element.
- [Tailwind Variants](tailwind-variants.org/) - The power of Tailwind combined with a first-class variant API
- [PandaCSS](https://panda-css.com/) - CSS-in-JS with build time generated styles

Special thanks to [Renato Ribeiro](https://github.com/renatorib) who kindly transferred me the original `cvb` package to publish this new package.

> [!IMPORTANT]
> Version `cvb@0.1.0` was published by Renato Ribeiro and is not related to Class Variance Builder or the source code in this repository.

## Contributing

Contributions are always welcome!

Please follow our [contributing guidelines](https://github.com/gperdomor/cvb/blob/main/CONTRIBUTING.md).

Please adhere to this project's [CODE_OF_CONDUCT](https://github.com/gperdomor/cvb/blob/main/CODE_OF_CONDUCT.md).

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/) © [Gustavo Perdomo](https://github.com/gperdomor)
