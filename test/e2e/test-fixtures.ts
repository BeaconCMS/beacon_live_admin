// https://mfeckie.dev/blog/testing-liveview-with-playwright

import { test as baseTest, expect, Page } from "@playwright/test"

interface TestMetadata {
  page: Page
  scenario: string
}

export const test = baseTest.extend<TestMetadata>({
  scenario: "",
  page: async ({ browser, scenario }, use) => {
    // This checks out the DB and gets the user agent string
    const resp = await fetch("http://localhost:4020/sandbox", {
      method: "POST",
    })

    const userAgentString = await resp.text()

    // We setup a new browser context with the user agent string
    // This allows the database to be sandboxed and provides isolation
    const context = await browser.newContext({
      baseURL: "http://localhost:4020",
      userAgent: userAgentString,
    })

    const page = await context.newPage()

    const r = await page.request.post(`http://localhost:4020/fixtures/${scenario}`, {
      headers: {
        "user-agent": userAgentString,
      },
    })

    await use(page)

    await fetch("http://localhost:4020/sandbox", {
      method: "DELETE",
      headers: {
        "user-agent": userAgentString,
      },
    })
  },
})
export { expect }
