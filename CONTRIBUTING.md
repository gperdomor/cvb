# Contributing Guide

Thanks for showing interest to contribute to `cvb`. Before starting your contribution, please take a moment to read the following guidelines.

## Think you found a bug?

If you find a bug in the source code or a mistake in the documentation, you can help us by
[submitting an issue](https://github.com/gperdomor/cvb/blob/master/CONTRIBUTING.md#submit-issue)
to [the GitHub Repository](https://github.com/gperdomor/cvb). Even better, you can
[submit a Pull Request](https://github.com/gperdomor/cvb/blob/master/CONTRIBUTING.md#submit-pr) with a fix.

## Project Structure

Source code and documentation are included in the top-level folders listed below.

- `docs` - Markdown and configuration files for documentation including tutorials, guides for each supported platform,
  and API docs.
- `packages/cvb` - Source code for `cvb` package
- `scripts` - Miscellaneous scripts for project tasks such as building documentation, testing, and code formatting.

## Development Workstation Setup

If you are using `VSCode`, and provided you have [Docker](https://docker.com) installed on your machine, then you can leverage [Dev Containers](https://containers.dev) through this [VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers), to easily setup your development environment, with everything needed to contribute to Nx, already installed (namely `NodeJS`, `NPM`, plus some useful extensions like `Nx Console`).

To do so, simply:

- Checkout the repo
- Open it with VSCode
- Open the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) and select "Dev Containers: Open Folder in Container..."

The repo comes with a preconfigured `devcontainer.json` file (located in `.devcontainer/` folder at root), that `VSCode` will automatically use to install the aforementioned tools, inside a Docker image. It will even run `npm install` for you, so you can start contributing to Nx right after.

If you open the repo in [Github Codespace](https://github.com/features/codespaces), it will also leverage this config file, to setup the codespace, with the same required tools.

## Building the Project

> If you have `VSCode` + `Docker`, this can be automated for you, see [section](#development-workstation-setup) above

After cloning the project to your machine, to install the dependencies, run:

```bash
npm install
```

To build all the packages, run:

```bash
npm run build
```

## Publishing to a local registry

To test if your changes will actually work once the changes are published, it can be useful to publish to a local registry.

- Run `npm run local-registry` in Terminal 1 (keep it running)
- Run `npm adduser --registry http://localhost:4873` in Terminal 2 (real credentials are not required, you just need to be logged in. You can use test/test/test@test.io.)
- Run `npm nx-release 2.0.0 --local` in Terminal 2 - you can choose any nonexistent version number here, but it's recommended to use the next major
- Run `npm i @gperdomor/cvb@2.0.0` inside a node project where you want to try the new version. (this should be executed while Terminal 1 is running)

If you have problems publishing, make sure you use Node 22 and NPM 10+.

## Development

To improve our development process, we've set up tooling and systems. CVB uses a monorepo structure with the following structure:

| Package                 | Description                   |
| ----------------------- | ----------------------------- |
| [cvb](packages/cvb)     | Contains core features of CVB |
| [website](apps/website) | Contains code for docs        |

### Tooling

- [NPM](https://www.npmjs.com/) to manage packages and dependencies
- [Vitest](https://vite.dev/) to bundle code
- [Vitest](https://vitest.dev/) for testing
- [Nx](https://nx.dev) for workspace, changelog generation, and release management.

<!-- ### Commands

TODO -->

<!-- ## Proposing new or changed API?

Please provide thoughtful comments and some sample API code. Proposals that don't line up with our roadmap or don't have
a thoughtful explanation will be closed. You can check the existing proposals and our official roadmap here:
https://panda-css.canny.io/ -->

### Running the Documentation Site Locally

<!-- TODO -->

<!-- To run `website` locally, run the command:

```bash
npx nx serve-docs website
``` -->

You can then access the application locally at `localhost:4200`. Changes to markdown documentation files will be automatically applied to the site when you refresh the browser.

### PR Preview

When submitting a PR, this repo will automatically generate a preview of the `website` application based on the contents
of your pull request.

Once the preview site is launched, a comment will automatically be added to your PR with the link your PR's preview. To
check your docs changes, make sure to select `Preview` from the version selection box of the site.

## Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker. An issue for your problem may already exist and has been
resolved, or the discussion might inform you of workarounds readily available

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. Having a
reproducible scenario gives us wealth of important information without going back and forth with you requiring
additional information, such as:

- node version
- `yarn.lock` or `package-lock.json` or `pnpm-lock.yaml`
- and most importantly - a use-case that fails

A minimal reproduction allows us to quickly confirm a bug (or point out a coding problem) as well as confirm that we are
fixing the right problem.

We will be insisting on a minimal reproduction in order to save maintainers' time and ultimately be able to fix more
bugs. Interestingly, from our experience, users often find coding problems themselves while preparing a minimal
reproduction repository. We understand that sometimes it might be hard to extract essentials bits of code from a larger
codebase, but we really need to isolate the problem before we can fix it.

You can file new issues by filling out our [issue form](https://github.com/gperdomor/cvb/issues/new/choose).

### <a name="submit-pr"></a> Submitting a PR

Please follow the following guidelines:

- Make sure unit tests pass (`nx affected --target=test`)
  - Target a specific project with: `nx run proj:test` (i.e. `nx run cvb:test` to target `packages/cvb`)
  - Target a specific unit test file (i.e. `packages/cvb/src/lib/utils.spec.ts`)
    with `npx vitest packages/cvb/src/lib/utils`
  - For more options on running tests - check `npx vitest --help` or visit [vitest.dev](https://vitest.dev/)
  <!-- - Debug with `node --inspect-brk ./node_modules/jest/bin/jest.js packages/cvb/src/lib/utils.spec.ts` -->
- Make sure lint pass (`nx affected --target=lint`)
- Make sure you run `nx format`
<!-- - Update documentation with `pnpm documentation`. For documentation, check for spelling and grammatical errors. -->
- Update your commit message to follow the guidelines below (use `npm run commit` to automate compliance)
  - `npm run check-commit` will check to make sure your commit messages are formatted correctly

#### Commit Message Guidelines

The commit message should follow the following format:

```plain
type(scope): subject
BLANK LINE
body
```

##### Type

The type must be one of the following:

- feat - New or improved behavior being introduced (e.g. Updating to new versions of React or Jest which bring in new
  features)
- fix - Fixes the current unexpected behavior to match expected behavior (e.g. Fixing the library generator to create
  the proper named project)
- cleanup - Code Style changes that have little to no effect on the user (e.g. Refactoring some functions into a
  different file)
- docs - Changes to the documentation (e.g. Adding more details into the getting started guide)
- chore - Changes that have absolutely no effect on users (e.g. Updating the version of Nx used to build the repo)

##### Scope

The scope must be one of the following:

- cvb - anything cvb package specific
- bundling - anything bundling specific (e.g. rollup, webpack, etc.)
- websire - anything related to docs infrastructure
- repo - anything related to managing the cvb repo itself
- misc - misc stuff

##### Subject and Body

The subject must contain a description of the change, and the body of the message contains any additional details to
provide more context about the change.

Including the issue number that the PR relates to also helps with tracking.

#### Example

```plain
feat(cvb): add an option to include on complete hook

Closes #15
```

#### Commitizen

To simplify and automate the process of committing with this format, **cvb is a [Commitizen](https://github.com/commitizen/cz-cli) friendly repository**, just do `git add` and
execute `npm run commit`.

<!-- ## Want to help improve the docs?

Our docsite lives in the [monorepo](./website/pages/docs/). -->

<!-- ## Release
TODO
 -->

## License

By contributing your code to the `cvb` GitHub repository, you agree to license your contribution under the [MIT License](https://github.com/gperdomor/cvb/blob/main/LICENSE).
