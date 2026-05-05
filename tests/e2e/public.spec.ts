import { expect, test } from '@playwright/test';

test.describe('public workflows', () => {
  test('landing, navigation, apply, contact, and alumni pages render', async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('link', { name: /apply|ignite|contact/i }).first()).toBeVisible();

    await page.goto('/apply', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /apply|application|ignite/i }).first()).toBeVisible();

    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel(/first/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();

    await page.goto('/alumni', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /alumni/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /submit story/i })).toBeVisible();
  });
});
