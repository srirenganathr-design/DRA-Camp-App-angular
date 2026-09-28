import { test, expect } from '@playwright/test';
import { gotoPatientWizardStep4 } from '../utils/patient-wizard';

test.describe('Inline Add reading field editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoPatientWizardStep4(page);
  });

  test('Add Sph picker shows 0-4 without sign column', async ({ page }) => {
    await page.locator('[data-figma-node-id="126:21545"]').click();
    await expect(page.getByRole('group', { name: 'Column picker' })).toBeVisible();
    await expect(page.getByRole('button', { name: '+', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: '4', exact: true })).toBeVisible();
  });

  test('wheel picker updates Add Sph up to +4.00', async ({ page }) => {
    await page.locator('[data-figma-node-id="126:21545"]').click();
    await page.getByRole('button', { name: '4', exact: true }).click();

    await expect(page.getByRole('textbox', { name: 'Edit Sph' })).toHaveValue('+4.00');
  });

  test('Reset restores Add Sph default', async ({ page }) => {
    await page.locator('[data-figma-node-id="126:21545"]').click();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: '.50' }).click();
    await expect(page.getByRole('textbox', { name: 'Edit Sph' })).toHaveValue('+2.50');

    await page.getByRole('button', { name: 'Reset Sph' }).click();
    await expect(page.getByRole('textbox', { name: 'Edit Sph' })).toHaveValue('+0.00');
  });
});
