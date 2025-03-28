<p align="center">
  <img alt="logo" max-width="100%" src="./artboard.svg"/>
  </br>
  <strong>C</strong>lass <strong>V</strong>ariance <strong>B</strong>uilder
</p>

<p align="center">
  Universal, lightweight and performant styling solution with a focus on component architecture for the modern web.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/cvb">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/cvb"/>
  </a>
  <a href="https://www.npmjs.com/package/cvb">
    <img alt="NPM Type Definitions" src="https://img.shields.io/npm/types/cvb"/>
  </a>
  <a href="https://bundlephobia.com/package/cvb">
    <img alt="Minizipped Size" src="https://img.shields.io/bundlephobia/minzip/cvb" />
  </a>
  <a href="https://github.com/gperdomor/cvb/blob/main/LICENSE">
    <img alt="GitHub License" src="https://img.shields.io/github/license/gperdomor/cvb"/>
  </a>
  <a href="https://www.npmjs.com/package/cvb">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/cvb"/>
  </a>
</p>

## Features

- ✨ First-class variant API
- 🚀 Multi-part / Slots support
- 🧬 Composition support
- 🎨 Override styles support
- 💪 Type-safe styles and autocomplete
- 🦄 Framework agnostic
- 0️⃣ Zero dependencies

## Documentation

For comprehensive guides, examples, and API references, visit our [official documentation](https://class-variance-builder.vercel.app).

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

The development of **Class Variance Builder** stands on the shoulders of giants. We're deeply grateful for these exceptional projects that provided inspiration, ideas, and patterns:

- [CVA (Class Variance Authority)](https://cva.style/) - Pioneered the variant-based approach to styling components
- [Tailwind Variants](https://tailwind-variants.org/) - The power of Tailwind combined with a first-class variant API
- [PandaCSS](https://panda-css.com/) - CSS-in-JS with build time generated styles

### Special Thanks

A heartfelt thank you to [Renato Ribeiro](https://github.com/renatorib) who generously transferred the original `cvb` package name, allowing us to build this project with a clear and consistent identity.

> [!IMPORTANT]
> Please note that version `cvb@0.1.0` was previously published by Renato Ribeiro as an unrelated package. All versions `1.0.0-beta.2` and above represent the official Class Variance Builder library as described in this repository.

## Community

Join the growing CVB community! We believe in building together and welcome contributors of all experience levels.

### Get Involved

- **Report Issues**: Found a bug or have a suggestion? [Open an issue](https://github.com/gperdomor/cvb/issues/new/choose) on GitHub
- **Ask Questions**: Need help or clarification? Start a conversation in [GitHub Discussions](https://github.com/gperdomor/cvb/discussions)
- **Contribute Code**: Pull requests are welcome! Check our [contribution guidelines](https://github.com/gperdomor/cvb/blob/main/CONTRIBUTING.md) to get started
- **Share Your Work**: Built something with CVB? Share it with the community in the [Showcase discussion](https://github.com/gperdomor/cvb/discussions/categories/show-and-tell)
- **Spread the Word**: Star the [repository](https://github.com/gperdomor/cvb), share on social media, or write about your experience

### Resources

- [GitHub Repository](https://github.com/gperdomor/cvb) - Source code, issues, and project management
- [GitHub Discussions](https://github.com/gperdomor/cvb/discussions) - Community conversations and support
- [NPM Package](https://www.npmjs.com/package/cvb) - Latest releases and installation information
- [Documentation](https://class-variance-builder.vercel.app) - Comprehensive guides and API reference
- [Code of Conduct](https://github.com/gperdomor/cvb/blob/main/CODE_OF_CONDUCT.md) - Our community standards and expectations

Your feedback and contributions help make CVB better for everyone!

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/) © [Gustavo Perdomo](https://github.com/gperdomor)
