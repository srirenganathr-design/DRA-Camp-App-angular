import { test, expect } from '@playwright/test';
import { gotoPatientWizardStep4 } from '../utils/patient-wizard';

test.describe('Inline axis field editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoPatientWizardStep4(page);
  });

  test('clicking Axis opens compact wheel picker below the field', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Axis' }).first().click();
    await expect(page.getByRole('group', { name: 'Axis picker' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Edit Axis' })).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('wheel picker updates Axis live', async ({ page }) => {
    await page.locator('[data-figma-node-id="126:21555"]').click();
    await page.getByRole('button', { name: '90', exact: true }).click();

    await expect(page.getByRole('textbox', { name: 'Edit Axis' })).toHaveValue('90');
  });

  test('keyboard entry updates Axis on Enter', async ({ page }) => {
    await page.locator('[data-figma-node-id="126:21555"]').click();
    const input = page.getByRole('textbox', { name: 'Edit Axis' });
    await input.fill('45');
    await input.press('Enter');

    await expect(page.locator('[data-figma-node-id="126:21555"]')).toHaveText('45');
    await expect(page.getByRole('group', { name: 'Axis picker' })).toHaveCount(0);
  });
});
