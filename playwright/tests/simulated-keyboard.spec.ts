import { test, expect, type Locator, type Page } from '@playwright/test';
import { expectScrollStable } from '../utils/scroll-stability';
import { gotoPatientWizardStep4 } from '../utils/patient-wizard';

const keyboardPanel = '[data-simulated-keyboard-panel="true"]';

async function expectInputAboveKeyboard(page: Page, input: Locator) {
  await expect.poll(async () => {
    const inputBox = await input.boundingBox();
    const keyboardBox = await page.locator(keyboardPanel).boundingBox();
    if (!inputBox || !keyboardBox) return false;
    return inputBox.y + inputBox.height <= keyboardBox.y - 4;
  }).toBe(true);
}

async function expectSheetAboveKeyboard(page: Page, sheet: Locator) {
  await expect.poll(async () => {
    const sheetBox = await sheet.boundingBox();
    const keyboardBox = await page.locator(keyboardPanel).boundingBox();
    if (!sheetBox || !keyboardBox) return false;
    return sheetBox.y + sheetBox.height <= keyboardBox.y + 4;
  }).toBe(true);
}

test.describe('Simulated desktop keyboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoPatientWizardStep4(page);
  });

  test('shows keyboard when refraction input is focused on desktop', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Sph' }).first().click();
    await expect(page.locator(keyboardPanel)).toBeVisible();
    await expect(page.locator('body')).toHaveAttribute('data-simulated-keyboard', 'open');
    await expectScrollStable(page, '[data-wizard-scroll-body]');
  });

  test('highlights matching key while physical key is held', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Sph' }).first().click();
    await expect(page.locator(keyboardPanel)).toBeVisible();

    await page.keyboard.down('3');
    await expect(page.locator(`${keyboardPanel} [data-key="3"]`)).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.keyboard.up('3');
    await expect(page.locator(`${keyboardPanel} [data-key="3"]`)).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('hides keyboard when input loses focus', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Sph' }).first().click();
    await expect(page.locator(keyboardPanel)).toBeVisible();

    await page.locator('h1').click();
    await expect(page.locator(keyboardPanel)).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveAttribute('data-simulated-keyboard', 'open');
  });

  test('shows qwerty layout for patient name input', async ({ page }) => {
    await page.goto('/patients/create');
    await page.setViewportSize({ width: 360, height: 800 });

    await page.locator('#patient-name').click();
    await expect(page.locator(keyboardPanel)).toBeVisible();
    await expect(page.locator(`${keyboardPanel} [data-key="q"]`)).toBeVisible();
  });

  test('refraction picker stays usable with keyboard open', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Sph' }).first().click();
    await expect(page.locator(keyboardPanel)).toBeVisible();
    await expect(page.getByRole('group', { name: 'Column picker' })).toBeVisible();

    await page.getByRole('button', { name: '+', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Edit Sph' })).toHaveValue('+3.00');
  });

  test('keeps whatsapp field visible above keyboard on create patient', async ({ page }) => {
    await page.goto('/patients/create');
    await page.setViewportSize({ width: 360, height: 800 });

    const whatsappInput = page.locator('#patient-whatsapp');
    await whatsappInput.click();
    await expect(page.locator(keyboardPanel)).toBeVisible();
    await expectInputAboveKeyboard(page, whatsappInput);
  });

  test('keeps branch search visible above keyboard in bottom sheet', async ({ page }) => {
    await page.goto('/camps/create/branches');
    await page.setViewportSize({ width: 360, height: 800 });

    await page.getByRole('button', { name: 'Add Branch(s)' }).click();
    const searchInput = page.getByRole('dialog').locator('[data-name="Search Input"]');
    await searchInput.click();
    await expect(page.locator(keyboardPanel)).toBeVisible();
    await expectInputAboveKeyboard(page, searchInput);
  });

  test('branch bottom sheet uses 60% height by default', async ({ page }) => {
    await page.goto('/camps/create/branches');
    await page.setViewportSize({ width: 360, height: 800 });

    await page.getByRole('button', { name: 'Add Branch(s)' }).click();
    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();

    const sheetBox = await sheet.boundingBox();
    expect(sheetBox).not.toBeNull();
    expect(sheetBox!.height).toBeGreaterThanOrEqual(450);
    expect(sheetBox!.height).toBeLessThanOrEqual(510);
  });

  test('branch bottom sheet expands when keyboard is open', async ({ page }) => {
    await page.goto('/camps/create/branches');
    await page.setViewportSize({ width: 360, height: 800 });

    await page.getByRole('button', { name: 'Add Branch(s)' }).click();
    const sheet = page.getByRole('dialog');
    const searchInput = sheet.locator('[data-name="Search Input"]');
    await searchInput.click();
    await expect(page.locator(keyboardPanel)).toBeVisible();

    await expect.poll(async () => {
      const sheetBox = await sheet.boundingBox();
      return sheetBox?.height ?? 0;
    }).toBeGreaterThanOrEqual(450);

    await expectInputAboveKeyboard(page, searchInput);
    await expectSheetAboveKeyboard(page, sheet);
    await expect(page.getByRole('button', { name: 'Next' })).toBeHidden();
    await expect(sheet.getByRole('button', { name: 'Apply' })).toBeHidden();
    await expect(sheet.getByRole('button', { name: 'Close' })).toBeHidden();
  });
});
