import { test, expect } from '@playwright/test';
import { expectScrollStable } from '../utils/scroll-stability';
import { gotoPatientWizardStep4 } from '../utils/patient-wizard';

test.describe('Inline refraction field editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoPatientWizardStep4(page);
  });

  test('clicking Sph opens compact wheel picker below the field', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Sph' }).first().click();
    await expect(page.getByRole('group', { name: 'Column picker' })).toBeVisible();
    const input = page.getByRole('textbox', { name: 'Edit Sph' });
    await expect(input).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    const inputBox = await input.boundingBox();
    const pickerBox = await page.getByRole('group', { name: 'Column picker' }).boundingBox();
    expect(inputBox).not.toBeNull();
    expect(pickerBox).not.toBeNull();
    expect(pickerBox!.y).toBeGreaterThanOrEqual(inputBox!.y + inputBox!.height - 1);
    await expectScrollStable(page, '[data-wizard-scroll-body]');
  });

  test('keyboard entry updates Sph on Enter', async ({ page }) => {
    await page.locator('[data-figma-node-id="126:21520"]').click();
    const input = page.getByRole('textbox', { name: 'Edit Sph' });
    await input.fill('+3.50');
    await input.press('Enter');

    await expect(page.locator('[data-figma-node-id="126:21520"]')).toHaveText('+3.50');
    await expect(page.getByRole('group', { name: 'Column picker' })).toHaveCount(0);
  });

  test('wheel picker updates Sph live', async ({ page }) => {
    await page.locator('[data-figma-node-id="126:21520"]').click();
    await page.getByRole('button', { name: '+', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.getByRole('button', { name: '.50' }).click();

    await expect(page.getByRole('textbox', { name: 'Edit Sph' })).toHaveValue('+3.50');
  });

  test('clicking Cyl opens compact wheel picker below the field', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Cyl' }).first().click();
    await expect(page.getByRole('group', { name: 'Column picker' })).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
