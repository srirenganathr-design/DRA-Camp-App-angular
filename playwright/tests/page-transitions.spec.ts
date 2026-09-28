import { test, expect } from '@playwright/test';

test.describe('Directional page transitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('tab switch from camps to patients uses forward direction', async ({ page }) => {
    await page.goto('/camps');
    await page.getByRole('link', { name: 'Patients' }).click();
    await expect(page).toHaveURL('/patients');
    await expect(page.locator('[data-page-direction="forward"]')).toBeVisible();
  });

  test('tab switch from patients to camps uses back direction', async ({ page }) => {
    await page.goto('/patients');
    await page.getByRole('link', { name: 'Camps' }).click();
    await expect(page).toHaveURL('/camps');
    await expect(page.locator('[data-page-direction="back"]')).toBeVisible();
  });

  test('camp list to details uses forward direction', async ({ page }) => {
    await page.goto('/camps');
    await page.getByRole('link', { name: /View Cataract Screening Camp/i }).click();
    await expect(page).toHaveURL('/camps/1');
    await expect(page.locator('[data-page-direction="forward"]')).toBeVisible();
  });

  test('camp details back uses back direction', async ({ page }) => {
    await page.goto('/camps/1');
    await page.getByRole('link', { name: 'Go back' }).click();
    await expect(page).toHaveURL('/camps');
    await expect(page.locator('[data-page-direction="back"]')).toBeVisible();
  });

  test('persistent bottom nav stays mounted during tab switch', async ({ page }) => {
    await page.goto('/camps');
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();
    await page.getByRole('link', { name: 'Patients' }).click();
    await expect(nav).toBeVisible();
    await expect(page.locator('[data-figma-node-id="16:3277"]')).toBeVisible();
  });
});
