# UVA Library (Web) Monorepo

A repository of mainly front end web projects/packages/components scattered with some backend node projects that may share code.

## Description

Ditto what I said above.

## Getting Started

### Dependencies

* You need to have [Node](https://nodejs.org/en/) installed.

* You will also need [pnpm](https://pnpm.io/installation)

* You will want to have [git](https://git-scm.com/downloads) if you plan to contribute to this project.

### Installing

Clone this project to your local workspace and `cd` into it.
```
git clone -b mainTurbo https://github.com/uvalib/monorepo.git
cd monorepo
```

Install dependencies using pnpm.

```
pnpm install
```
* hopefully you didn't get any errors :|

ToDo: say something about setting up a .env file
ToDo: say something about Docker requirements for some projects

### Executing scripts/commands

You should be able to execute scripts/commands as you normally would on individual packages (calling on scripts defined in the package.json for the individual package/project/app).
```
cd packages/bento-box
pnpm run start
```

If the project depends on other projects in the monorepo then you will want to use TurboRepo to run your commands as it will handle building the dependencies.
```
cd ../..
pnpm turbo start --filter=site-mock
```

## Apps

### [Modern Library Bibliography](https://github.com/uvalib/monorepo/tree/main/apps/modern-library-biblio)

Start with
```pnpm turbo start --filter=modern-library-biblio```

## Packages

### [`<bento-box>` Bento Box Search](https://github.com/uvalib/monorepo/tree/main/packages/bento-box)

Start with
```pnpm turbo start --filter=@uvalib/bento-box```

### [`<site-button>` Button & FAB](https://github.com/uvalib/monorepo/tree/main/packages/site-button)

Start with
```pnpm turbo start --filter=@uvalib/site-button```

## Help

Have an idea for a new project but don't know how to add it.  If it is something frontend web related why not make a [Web Component](https://open-wc.org/) project!

Make a package (something to be used, reused, and abused by other things):
```
pnpm run mkPkg
```

Make an application (something to be built and deployed):
```
pnpm run mkApp
```

* If your project is meant to be published and consumed via npm you will want to prepend '@uvalib/' to the name in it's package.json file.

To add a dependency across the monorepo you simply cd into the dependent package and install the dependency `pnpm add [package name]`.