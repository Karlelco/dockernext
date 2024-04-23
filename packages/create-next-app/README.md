# Create Next App

The easiest way to get started with Next.js is by using `create-next-app`. This CLI tool enables you to quickly start building a new Next.js application, with everything set up for you. You can create a new app using the default Next.js template, or by using one of the [official Next.js examples](https://github.com/vercel/next.js/tree/canary/examples). To get started, use the following command:

### Interactive

You can create a new project interactively by running:

```bash
npx create-next-app@latest
# or
yarn create next-app
# or
pnpm create next-app
# or
bunx create-next-app
```

You will be asked for the name of your project, and then whether you want to
create a TypeScript project:

```bash
✔ Would you like to use TypeScript? … No / Yes
```

Select **Yes** to install the necessary types/dependencies and create a new TS project.

### Non-interactive

You can also pass command line arguments to set up a new project
non-interactively. See `create-next-app --help`:

```bash
Usage: create-next-app [directory] [options]

Options:
  -v, --version                            Output the current version of create-next-app.
  --app                                    Initialize as an App Router project. (default)
  --ts, --typescript                       Initialize as a TypeScript project. (default)
  --js, --javascript                       Initialize as a JavaScript project.
  --eslint                                 Enable ESLint config. (default)
  --tailwind                               Enable Tailwind CSS config. (default)
  --src-dir                                Initialize inside a "src/" directory.
  --import-alias <prefix/*>                Specify import alias to use. (default: "@/*")
  --use <package-manager>                  Specify the package manager to use. (choices: "npm", "pnpm", "yarn", "bun")
  --reset, --reset-preferences             Reset the preferences saved for create-next-app.
  -e, --example <example-name|github-url>

    An example to bootstrap the app with. You can use an example name
    from the official Next.js repo or a public GitHub URL. The URL can use
    any branch and/or subdirectory.

  --example-path <path-to-example>

    In a rare case, your GitHub URL might contain a branch name with
    a slash (e.g. bug/fix-1) and the path to the example (e.g. foo/bar).
    In this case, you must specify the path to the example separately:
    --example-path foo/bar

  -h, --help                               Display this help message.
```

### Why use Create Next App?

`create-next-app` allows you to create a new Next.js app within seconds. It is officially maintained by the creators of Next.js, and includes a number of benefits:

- **Interactive Experience**: Running `npx create-next-app@latest` (with no arguments) launches an interactive experience that guides you through setting up a project.
- **Zero Dependencies**: Initializing a project is as quick as one second. Create Next App has zero dependencies.
- **Offline Support**: Create Next App will automatically detect if you're offline and bootstrap your project using your local package cache.
- **Support for Examples**: Create Next App can bootstrap your application using an example from the Next.js examples collection (e.g. `npx create-next-app --example api-routes`).
- **Tested**: The package is part of the Next.js monorepo and tested using the same integration test suite as Next.js itself, ensuring it works as expected with every release.
