import { test, expect } from "../test-fixtures"
import { syncLV } from "../utils"

test.use({ scenario: "basic" })

test("renders", async ({ page }) => {
  await page.goto("/admin")
  await syncLV(page)

  await expect(page).toHaveTitle("Beacon LiveAdmin")
  await expect(page.locator("h1")).toHaveText("Welcome!")
})

test("shows the list of available sites", async ({ page }) => {
  const siteName = "site_a"

  await page.goto("/admin")
  await syncLV(page)

  await expect(page.locator("h2#admin-sites")).toHaveText("Sites")

  await expect(page.getByRole("heading", { name: siteName })).toBeVisible()
})

test("shows the list of available pages", async ({ page }) => {
  await page.goto("/admin/site_a/pages")
  await syncLV(page)

  // FIXME: write a proper assert
  await expect(page.locator("span").filter({ hasText: "/home" })).toHaveCount(1)
})
;[
  { name: "Media Library", path: "media_library" },
  { name: "Components", path: "components" },
  { name: "Layouts", path: "layouts" },
  { name: "Pages", path: "pages" },
  { name: "Live Data", path: "live_data" },
  { name: "Event Handlers", path: "events" },
  { name: "Info Handlers", path: "info_handlers" },
  { name: "Error Pages", path: "error_pages" },
].forEach(({ name, path }, index) => {
  // TODO: Update for using a test site
  const siteName = "site_a"

  test(`shows link for ${name}`, async ({ page, baseURL }) => {
    await page.goto("/admin")
    await syncLV(page)

    const link = page.getByRole("link").nth(index)

    await expect(link).toBeVisible()
    await expect(link).toHaveText(name)
    await expect(link).toHaveAttribute("href", `/admin/${siteName}/${path}`)

    await link.click()
    await syncLV(page)

    await expect(page).toHaveURL(`${baseURL}/${siteName}/${path}`)
  })
})
