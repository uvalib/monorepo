# Web Monorepo

This monorepo contains various UVA Library web packages.
See https://uvalib.github.io/monorepo/ for an overview of the packages and their usage.

## Lerna usage

This repo makes use of [Lerna](https://github.com/lerna/lerna) to aid with development and maintaince of multiple [npm.js](https://www.npmjs.com/settings/uvalib/packages) packages.

Some Global command usage
```
# Link local packages together and install remaining package dependencies
# Useful if yarn dependencies get a bit scrambled between packages
lerna bootstrap

# Publish packages in the current project.
# Publishes them to npm.js @uvalib org, can use --scope flag to only publish specific package
lerna publish

# Build css from @uvalib/web-styles scss in all packages using it
lerna run build:css --stream

# Build packages (including css build when used)
lerna run build --stream
```

## [Aeon Template](https://github.com/uvalib/monorepo/tree/master/packages/aeon-template)

This package is a build of [@uvalib/uvalib-page](https://github.com/uvalib/monorepo/tree/master/packages/wc-page) and [@uvalib/web-styles]() that serves as a template for externaly hosted Aeon content.

Some frequent commands
```
lerna run start --scope=@uvalib/aeon-template --stream
```

## [Web Styles](https://github.com/uvalib/monorepo/tree/master/packages/web-styles)

This package is where we are building the global UVA Library styles & theme.  All Library web projects should use this project for reference and/or as a dependency.