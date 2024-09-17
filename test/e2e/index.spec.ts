import { test, expect } from '@playwright/test';

test('renders', async ({ page }) => {
  await page.goto('/admin');

  await expect(page).toHaveTitle('Beacon LiveAdmin');
  await expect(page.locator('h1')).toHaveText('Welcome!');
});
