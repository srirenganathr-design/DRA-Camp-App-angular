import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';
import { completePatientWizardStep1, completePatientWizardStep2 } from '../utils/patient-wizard';

const REQUIRED_NODES = [
  '126:21267',
  '16:3343',
  '16:3344',
  '16:3345',
  '16:3346',
  '126:21276',
  '126:21277',
  '126:21279',
  '126:21280',
  '126:21281',
  '126:21284',
  '126:21289',
  '126:21295',
  '126:21301',
  '16:3373',
  '16:3374',
  '16:3375',
  '16:3377',
  '16:3378',
];

test.describe('Figma parity — Create Patient Medical History screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/patients/create');
    await completePatientWizardStep1(page);
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('step title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '126:21279');
    await expectComputedStyles(title, {
      'font-size': '20px',
      'font-weight': '600',
    });
  });

  test('medical history questions render with no default selections', async ({ page }) => {
    await expect(page.getByText('Diabetic')).toBeVisible();
    await expect(page.getByText('Has Blood Pressure')).toBeVisible();
    await expect(page.getByText('Daily Digital Hours')).toBeVisible();
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Medical History' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Patient' })).toBeVisible();
  });

  test('create patient shows toast and continues to dry auto-refraction step', async ({ page }) => {
    await completePatientWizardStep2(page);
    await page.getByRole('button', { name: 'Create Patient' }).click();
    await expect(page.locator('[data-sonner-toast]')).toContainText('Patient created');
    await expect(page).toHaveURL('/patients/create/dry-auto-refraction');
    await expect(page.getByRole('heading', { level: 1, name: 'Dry Auto-Refraction' })).toBeVisible();
  });

  test('create patient blocked when medical history is incomplete', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Patient' }).click();
    await expect(page).toHaveURL('/patients/create/medical-history');
    await expect(page.locator('[data-sonner-toast]')).toHaveCount(0);
    await expect(page.getByText('Selection required').first()).toBeVisible();
  });

  test('previous navigates to basic information step', async ({ page }) => {
    await page.getByRole('link', { name: 'Previous' }).click();
    await expect(page).toHaveURL('/patients/create');
    await expect(page.getByRole('heading', { level: 1, name: 'Basic Information' })).toBeVisible();
  });
});
