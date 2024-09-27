import { test, expect } from '@playwright/test';
import { dragTo, startDragging, verifyOrder } from './helpers';

const siteName = 'dockyard_com';

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
    await page.getByRole('cell', { name: '/test-dnd', exact: true }).click();
    // Switch to visual editor
    await page.getByRole('button', { name: 'Visual Editor' }).click();
});

// Note: while dragging, only the element clones are visible.
// On drop, the clones get removed and the original elements will be visible again
test('It shows clones and placeholder for initiated drop location', async ({ page }) => {
    const firstItem = page.getByTestId('margin-row-item-1');
    const dragButton = page.getByTestId('drag-button');

    await firstItem.click();
    await expect(firstItem).toHaveAttribute('data-selected', "true");
    await expect(dragButton).toBeVisible();

    await startDragging(page);

    // Verify that it hides origin elements and shows clones
    await expect(page.getByTestId('margin-row-item-1').and(page.locator(':not([data-is-clone="true"])'))).toBeHidden();
    await expect(page.getByTestId('margin-row-item-2').and(page.locator(':not([data-is-clone="true"])'))).toBeHidden();
    await expect(page.getByTestId('margin-row-item-3').and(page.locator(':not([data-is-clone="true"])'))).toBeHidden();
    await expect(page.getByTestId('margin-row-item-4').and(page.locator(':not([data-is-clone="true"])'))).toBeHidden();
    await expect(page.getByTestId('margin-row-item-5').and(page.locator(':not([data-is-clone="true"])'))).toBeHidden();
    await expect(page.locator('[data-is-clone="true"]')).toHaveCount(5);

    // Move mouse for dragging before it shows placeholder
    await dragTo(page, 'margin-row-item-2');

    // Shows placeholder for the currently dragged element
    await expect(page.getByTestId('drag-placeholder')).toBeVisible();

    await page.mouse.up();
});

test('Reordering', async ({ page }) => {
    const source = page.getByTestId('margin-row-item-1');
    const dragButton = page.getByTestId('drag-button');

    await verifyOrder(
        page,
        '[data-test-id^=margin-row-item-]',
        [
            'margin-row-item-1',
            'margin-row-item-2',
            'margin-row-item-3',
            'margin-row-item-4',
            'margin-row-item-5',
        ]
    );

    await source.click();
    await expect(source).toHaveAttribute('data-selected', "true");
    await expect(dragButton).toBeVisible();

    await startDragging(page);
    await dragTo(page, 'margin-row-item-3');
    await page.mouse.up();

    await verifyOrder(
        page,
        '[data-test-id^=margin-row-item-]',
        [
            'margin-row-item-2',
            'margin-row-item-3',
            'margin-row-item-1',
            'margin-row-item-4',
            'margin-row-item-5',
        ]
    );
});

/* TODO: Need to reset test data after each test, because otherwise it will be pertained in database on saving changes */
test.skip('Persistence on save', async ({ page }) => {
    const source = page.getByTestId('margin-row-item-1');
    const dragButton = page.getByTestId('drag-button');

    await verifyOrder(
        page,
        '[data-test-id^=margin-row-item-]',
        [
            'margin-row-item-1',
            'margin-row-item-2',
            'margin-row-item-3',
            'margin-row-item-4',
            'margin-row-item-5',
        ]
    );

    await source.click();
    await expect(source).toHaveAttribute('data-selected', "true");
    await expect(dragButton).toBeVisible();

    await startDragging(page);
    await dragTo(page, 'margin-row-item-3');
    await page.mouse.up();

    const newOrder = [
        'margin-row-item-2',
        'margin-row-item-3',
        'margin-row-item-1',
        'margin-row-item-4',
        'margin-row-item-5',
    ];

    await verifyOrder(page, '[data-test-id^=margin-row-item-]', newOrder);

    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.locator('[id="flash"]')).toContainText('Page updated successfully');
    await page.reload();

    await verifyOrder(page, '[data-test-id^=margin-row-item-]', newOrder);
});