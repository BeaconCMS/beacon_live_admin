import { test, expect } from '@playwright/test';

test('renders', async ({ page }) => {
    await page.goto('/admin');

    await expect(page).toHaveTitle('Beacon LiveAdmin');
    await expect(page.locator('h1')).toHaveText('Welcome!');
});

test('shows the list of available sites', async({ page }) => {
    const siteName = 'dockyard_com';

    await page.goto('/admin');

    await expect(page.locator('h2#admin-sites')).toHaveText('Sites');

    await expect(page.getByRole('heading', { name: siteName })).toBeVisible();
});

[
    { name: 'Layouts', path: 'layouts' },
    { name: 'Components', path: 'components' },
    { name: 'Pages', path: 'pages' },
    { name: 'Live Data', path: 'live_data' },
    { name: 'Error Pages', path: 'error_pages' },
    { name: 'Media Library', path: 'media_library' },
    { name: 'Event Handlers', path: 'events' },
].forEach(({ name, path }, index) => {
    // TODO: Update for using a test site
    const siteName = 'dockyard_com';

    test(`shows link for ${name}`, async ({ page, baseURL }) => {
        await page.goto('/admin');

        const link = page.getByRole('link').nth(index);

        await expect(link).toBeVisible();
        await expect(link).toHaveText(name);
        await expect(link).toHaveAttribute('href', `/admin/${siteName}/${path}`);

        await link.click();

        await expect(page).toHaveURL(`${baseURL}/admin/${siteName}/${path}`);
    });
});
