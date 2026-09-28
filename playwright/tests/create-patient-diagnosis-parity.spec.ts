import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';
import {
  completePatientWizardFoundation,
  completePatientWizardStep2,
} from '../utils/patient-wizard';

const REQUIRED_NODES = [
  '126:21692',
  '126:21693',
  '16:3396',
  '16:3397',
  '16:3398',
  '16:3399',
  '16:3400',
  '126:21699',
  '126:21700',
  '126:21701',
  '126:21702',
  '126:21703',
  '126:21704',
  '126:21705',
  '126:21706',
  '126:21707',
  '126:21708',
  '126:21709',
  '126:21710',
  '126:21711',
  '126:21719',
  '126:21720',
  '126:21721',
  '206:48353',
  '206:48354',
  '126:21724',
  '126:21726',
];

test.describe('Figma parity — Create Patient Diagnosis screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await completePatientWizardFoundation(page);
    await page.getByRole('button', { name: 'Create Patient' }).click();
    await page.getByRole('button', { name: 'Save & Next' }).click();
    await page.getByRole('button', { name: 'Save & Next' }).click();
    await expect(page).toHaveURL('/patients/create/diagnosis');
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('step title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '126:21704');
    await expectComputedStyles(title, {
      'font-size': '20px',
      'font-weight': '600',
    });
  });

  test('diagnosis options render with no default selection', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: 'No Abnormality Detected' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    await expect(page.getByRole('checkbox', { name: 'Cataract' })).toHaveAttribute('aria-checked', 'false');
    await expect(page.getByRole('checkbox', { name: 'Presbyopia' })).toHaveAttribute('aria-checked', 'false');
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByText('Add Patient Details')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Diagnosis' })).toBeVisible();
    await expect(page.getByText('Step 5 of 5')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Preview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save & Next' })).toBeVisible();
  });

  test('previous navigates to dry refraction step', async ({ page }) => {
    await page.getByRole('link', { name: 'Previous' }).click();
    await expect(page).toHaveURL('/patients/create/dry-refraction');
    await expect(page.getByRole('heading', { level: 1, name: 'Dry Refraction' })).toBeVisible();
  });

  test('create patient navigates to patient details', async ({ page }) => {
    await page.goto('/patients/create');
    await page.locator('#patient-name').fill('Rajkumar Periyasamy');
    await page.locator('#patient-age').fill('12');
    await page.getByRole('radio', { name: 'Female', exact: true }).click();
    await page.locator('#patient-whatsapp').fill('8970635213');
    await page.getByRole('heading', { level: 1, name: 'Basic Information' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await completePatientWizardStep2(page);
    await page.getByRole('button', { name: 'Create Patient' }).click();
    await page.getByRole('button', { name: 'Save & Next' }).click();
    await page.getByRole('button', { name: 'Save & Next' }).click();
    await page.getByRole('button', { name: 'Save & Next' }).click();
    await expect(page.locator('[data-sonner-toast]')).toContainText('Patient created');
    await expect(page).toHaveURL(/\/patients\/\d+/);
    await expect(page.getByText('Rajkumar Periyasamy')).toBeVisible();
  });
});
