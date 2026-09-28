import { test, expect, type Page } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';

async function confirmDiscardDraft(page: Page) {
  await expect(page.getByRole('dialog', { name: 'Discard unsaved changes?' })).toBeVisible();
  await page.getByRole('button', { name: 'Discard changes' }).click();
}

const REQUIRED_NODES = [
  '126:21208',
  '16:3343',
  '16:3344',
  '16:3345',
  '16:3346',
  '126:21217',
  '126:21218',
  '126:21220',
  '126:21221',
  '126:21222',
  '126:21225',
  '126:21238',
  '126:21239',
  '126:21240',
  '126:21246',
  '126:21248',
  '126:21250',
];

test.describe('Figma parity — Create Patient screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/patients/create');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('header title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '16:3346');
    await expectComputedStyles(title, {
      'font-size': '14px',
      'font-weight': '500',
    });
  });

  test('step title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '126:21220');
    await expectComputedStyles(title, {
      'font-size': '20px',
      'font-weight': '600',
    });
  });

  test('form fields render empty by default', async ({ page }) => {
    await expect(page.locator('#patient-name')).toHaveValue('');
    await expect(page.locator('#patient-age')).toHaveValue('');
    await expect(page.locator('#patient-whatsapp')).toHaveValue('');
    await expect(page.getByRole('radio', { name: 'Male', checked: true })).toHaveCount(0);
    await expect(page.getByRole('radio', { name: 'Female', checked: true })).toHaveCount(0);
    await expect(page.getByRole('radio', { name: 'Others', checked: true })).toHaveCount(0);
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Basic Information' })).toBeVisible();
    await expect(page.getByRole('radiogroup', { name: 'Gender' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  test('back button navigates to patients list after confirming discard', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();
    await confirmDiscardDraft(page);
    await expect(page).toHaveURL('/patients');
  });

  test('shows inline validation errors without toast when Next is clicked with empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Name is required' })).toBeVisible();
    await expect(page.getByRole('alert').filter({ hasText: 'Age must be 1–120' })).toBeVisible();
    await expect(page.getByRole('alert').filter({ hasText: 'Gender is required' })).toBeVisible();
    await expect(page.getByRole('alert').filter({ hasText: 'Phone must be 10 digits' })).toBeVisible();
    await expect(page.locator('[data-sonner-toast]')).toHaveCount(0);
    await expect(page).toHaveURL('/patients/create');
  });

  test('focused empty numeric field shows no error before typing', async ({ page }) => {
    await page.locator('#patient-age').focus();
    await expect(page.getByRole('alert').filter({ hasText: 'Age must be 1–120' })).toHaveCount(0);
    await expect(page).toHaveURL('/patients/create');
  });

  test('shows inline error live when numeric field has invalid value', async ({ page }) => {
    await page.locator('#patient-age').fill('999');
    await expect(page.getByRole('alert').filter({ hasText: 'Age must be 1–120' })).toBeVisible();
    await expect(page.locator('[data-sonner-toast]')).toHaveCount(0);
  });

  test('numeric fields reject non-digit characters', async ({ page }) => {
    await page.locator('#patient-age').fill('abc12def');
    await expect(page.locator('#patient-age')).toHaveValue('12');
    await page.locator('#patient-whatsapp').fill('98ab76cd54');
    await expect(page.locator('#patient-whatsapp')).toHaveValue('987654');
  });

  test('clears inline error when field is corrected', async ({ page }) => {
    await page.locator('#patient-age').fill('999');
    await expect(page.getByRole('alert').filter({ hasText: 'Age must be 1–120' })).toBeVisible();
    await page.locator('#patient-age').fill('34');
    await expect(page.getByRole('alert').filter({ hasText: 'Age must be 1–120' })).toHaveCount(0);
  });
});
