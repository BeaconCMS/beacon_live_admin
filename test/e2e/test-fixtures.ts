import {
  test as baseTest,
  BrowserContext,
  expect,
  Page,
} from "@playwright/test";

interface TestMetadata {
  page: Page;
}

export const test = baseTest.extend<TestMetadata>({
  page: async ({ browser }, use) => {
    // This checks out the DB and gets the user agent string
    const resp = await fetch("http://localhost:4020/sandbox", {
      method: "POST",
    });

    const userAgentString = await resp.text();

    console.log("User agent string: ", userAgentString);

    // We setup a new browser context with the user agent string
    // This allows the database to be sandboxed and provides isolation
    const context = await browser.newContext({
      baseURL: "http://localhost:4020",
      userAgent: userAgentString,
    });

    const page = await context.newPage();

    await use(page);

    await fetch("http://localhost:4020/sandbox", {
      method: "DELETE",
      headers: {
        "user-agent": userAgentString,
      },
    });
  },
});
export { expect };
