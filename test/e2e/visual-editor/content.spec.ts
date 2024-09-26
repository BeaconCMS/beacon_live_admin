import { test, expect } from '@playwright/test';

const siteName = 'dockyard_com';
const pagePath = '/test-dnd';

/*
    Instead of all these steps, we could also go to the edit page directly,
    but it now works with id instead of path which makes it less user friendly
    or making sense whether we're editing the expected page. Path should be unique.
    => await page.goto(`/admin/${siteName}/pages/c10358fe-ba05-4f47-b1b7-d5e52d3c1571?editor=visual`);
*/
test.beforeEach(async ({ page }) => {
    await page.goto(`/admin/${siteName}/pages`);
    await page.getByRole('searchbox').fill('dnd');
    // note: it navigates when clicking the td's, not the tr
    await page.getByRole('cell', { name: pagePath, exact: true }).click();
    // Switch to visual editor
    await page.getByRole('button', { name: 'Visual Editor' }).click();
});

test('shows fake browser with rendered content', async ({ page }) => {
    const fakeBrowser = page.getByTestId('fake-browser');
    const addressBar = fakeBrowser.getByTestId('address-bar');
    const browserContent = fakeBrowser.getByTestId('browser-content');
    const firstItem = browserContent.getByTestId('margin-row-item-1');

    await expect(fakeBrowser).toBeVisible();
    await expect(addressBar).toBeVisible();
    await expect(addressBar.getByTestId('url-box')).toHaveText(pagePath);

    await expect(firstItem).toBeVisible();
});

test('selection states', async ({ page }) => {
    const browserContent = page.getByTestId('browser-content');
    const highlightedItems = page.locator('[data-highlighted="true"]');
    const selectedItems = page.locator('[data-selected="true"]');
    const firstItem = browserContent.getByTestId('margin-row-item-1');
    const secondItem = browserContent.getByTestId('margin-row-item-2');

    // No highlighted and selection state
    await expect(highlightedItems).toHaveCount(0);
    await expect(selectedItems).toHaveCount(0);

    // Highlight on hover
    await firstItem.hover();
    expect(firstItem).toHaveAttribute('data-highlighted', 'true');
    await expect(highlightedItems).toHaveCount(1);
    await expect(selectedItems).toHaveCount(0);

    // Select on click
    await firstItem.click();
    expect(firstItem).toHaveAttribute('data-selected', 'true');
    await expect(selectedItems).toHaveCount(1);

    // Interactive menu's visible for selected element
    await expect(page.getByTestId('right-sidebar')).toBeVisible();
    await expect(page.getByTestId('drag-button')).toBeVisible();
    await expect(page.getByTestId('element-delete-button')).toBeVisible();

    // Hover other items while in selection state
    /* TODO: improve selection and hover states while dragging.
    await secondItem.hover();
    expect(secondItem).toHaveAttribute('data-highlighted', 'true');
    await expect(highlightedItems).toHaveCount(1);
    */
});