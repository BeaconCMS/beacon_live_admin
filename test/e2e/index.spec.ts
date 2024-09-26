import { test, expect } from "@playwright/test";
const { syncLV, attributeMutations } = require("./utils");

test("renders", async ({ page }) => {
  await page.goto("/");
  await syncLV(page);

  await expect(page).toHaveTitle("Beacon LiveAdmin");
  await expect(page.locator("h1")).toHaveText("Welcome!");
});

test("shows the list of available sites", async ({ page }) => {
  const siteName = "site_a";

  await page.goto("/");
  await syncLV(page);

  await expect(page.locator("h2#admin-sites")).toHaveText("Sites");

  await expect(page.getByRole("heading", { name: siteName })).toBeVisible();
});

[
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
  const siteName = "site_a";

  test(`shows link for ${name}`, async ({ page, baseURL }) => {
    await page.goto("/");
    await syncLV(page);

    const link = page.getByRole("link").nth(index);

    await expect(link).toBeVisible();
    await expect(link).toHaveText(name);
    await expect(link).toHaveAttribute("href", `/${siteName}/${path}`);

    await link.click();
    await syncLV(page);

    await expect(page).toHaveURL(`${baseURL}/${siteName}/${path}`);
  });
});
