import { expect, test } from '@playwright/test';

const adminReady = Boolean(process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD);
const studentReady = Boolean(process.env.E2E_STUDENT_EMAIL && process.env.E2E_STUDENT_PASSWORD);

async function signIn(page: import('@playwright/test').Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in|continue|login/i }).click();
}

test.describe('admin workflows', () => {
  test.skip(!adminReady, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run authenticated admin workflows.');

  test('core admin pages are reachable', async ({ page }) => {
    await signIn(page, process.env.E2E_ADMIN_EMAIL!, process.env.E2E_ADMIN_PASSWORD!);
    await page.goto('/admin/dashboard');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    for (const path of ['/admin/announcements', '/admin/applications', '/admin/students', '/admin/courses', '/admin/documents', '/admin/assignments', '/admin/messages', '/admin/users', '/admin/settings']) {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
    }
  });
});

test.describe('student workflows', () => {
  test.skip(!studentReady, 'Set E2E_STUDENT_EMAIL and E2E_STUDENT_PASSWORD to run authenticated student workflows.');

  test('core student pages are reachable', async ({ page }) => {
    await signIn(page, process.env.E2E_STUDENT_EMAIL!, process.env.E2E_STUDENT_PASSWORD!);
    for (const path of ['/student/dashboard', '/student/courses', '/student/assignments', '/student/messages', '/student/profile']) {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
    }
  });
});
