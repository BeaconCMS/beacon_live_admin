# End-to-End Tests

Based on [LiveView e2e tests](https://github.com/phoenixframework/phoenix_live_view/tree/main/test/e2e)

## Setup

```sh
npm run setup
```

## Run

Install deps and run the entire test suite:

```sh
npm run e2e:test
```

Or run a single test:

```sh
npm run e2e:test test_name.spec.js:10 --project chromium --debug
```

Or call `playwright` directly to skip installing dependencies and building assets
if that step has already been done or assets have not changed:

```sh
cd test/e2e
npx playwright test
```

```sh
cd test/e2e
npx playwright test --ui
```