import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const publicPages = ['/', '/apply', '/login', '/contact', '/alumni'];
const maybeAuthedPages = ['/admin/dashboard', '/admin/announcements', '/admin/documents', '/student/dashboard', '/student/courses', '/student/messages'];
const nonBlockingRules = ['color-contrast', 'heading-order', 'image-redundant-alt', 'region'];

function seriousViolations(results: Awaited<ReturnType<AxeBuilder['analyze']>>) {
  return results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
}

for (const path of publicPages) {
  test(`axe public ${path}`, async ({ page }) => {
    test.setTimeout(path === '/login' ? 180_000 : 90_000);
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const results = await new AxeBuilder({ page }).disableRules(nonBlockingRules).analyze();
    expect(seriousViolations(results)).toEqual([]);
  });
}

for (const path of maybeAuthedPages) {
  test(`axe route smoke ${path}`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const results = await new AxeBuilder({ page }).disableRules(nonBlockingRules).analyze();
    expect(seriousViolations(results)).toEqual([]);
  });
}
