# End-to-End Tests

Based on [LiveView e2e tests](https://github.com/phoenixframework/phoenix_live_view/tree/main/test/e2e)

## Setup

```sh
npm install
npx playwright install --with-deps
```

## Run

Single test spec:

```sh
npx playwright test tests/index.spec.ts
```

Single test by line:

```sh
npx playwright test tests/index.spec.ts:6
```

Filter browser:

```sh
npx playwright test tests/index.spec.ts: --project chromium
```

UI:

```sh
npx playwright test --ui
```