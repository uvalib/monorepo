# `web-styles`

> An attempt to develop Library web resources around a unified style

## Docs

Docs created by [SassDoc](http://sassdoc.com/) can be found [here](https://uvalib.github.io/monorepo/web-styles/).

Docs are kept up to date by running the build `yarn run build`.  The documentation reflects changes to the master branch.

## Usage

Pull these styles into your project with yarn:
```
yarn add @uvalib/web-styles
```

Depending on how you build sass files into your project you may have to tell sass to look in the `./node_modules` directory for files to import or perhaps use a resolver module to do it for you.  You should then be able to import these colors into your project like so:
```
import "@uvalib/web-styles/scss/styles"
```

Or if you only want the variables to reference in your own sass you could:
```
import "@uvalib/web-styles/scss/variables"
```