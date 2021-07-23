## Quickstart

To get started:

```bash
npm install -g lerna
# lerna commands should be run from the repo root (not package root)
lerna bootstrap
lerna run start:build --scope=@uvalib/uvalib-catalog-light --stream
```

## Scripts

- `start` runs your app for development, reloading on file changes
- `start:build` runs your app after it has been built using the build command
- `build` builds your app and outputs it in your `dist` directory
- `test` runs your test suite with Web Test Runner
- `lint` runs the linter for your project