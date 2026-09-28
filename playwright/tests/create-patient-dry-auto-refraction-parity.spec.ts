import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';
import { completePatientWizardStep2, gotoPatientWizardStep3 } from '../utils/patient-wizard';

const REQUIRED_NODES = [
  '126:21324',
  '16:3396',
  '16:3397',
  '16:3398',
  '16:3399',
  '16:3400',
  '126:21333',
  '126:21334',
  '126:21336',
  '126:21337',
  '126:21338',
  '126:21344',
  '126:21348',
  '126:21402',
  '126:21407',
  '126:22778',
  '126:22780',
  '126:21411',
  '126:21465',
  '126:21466',
  '126:21468',
  '126:21470',
];

test.describe('Figma parity — Create Patient Dry Auto-Refraction screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoPatientWizardStep3(page);
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('step title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '126:21336');
    await expectComputedStyles(title, {
      'font-size': '20px',
      'font-weight': '600',
    });
  });

  test('refraction readings render with correct values', async ({ page }) => {
    await expect(page.getByText('Right Eye / Oculus Dexter')).toBeVisible();
    await expect(page.getByText('Left Eye / Oculus Sinister')).toBeVisible();
    await expect(page.getByText('Same as Right Eye')).toBeVisible();
    await expect(page.getByText('Reading 1')).toHaveCount(2);
    await expect(page.locator('[data-figma-node-id="126:21355"]')).toHaveText('-0.00');
    await expect(page.locator('[data-figma-node-id="126:21418"]')).toHaveText('-0.00');
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByText('Add Patient Details')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Dry Auto-Refraction' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Comment' })).toHaveCount(2);
    await expect(page.getByRole('link', { name: 'Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Preview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save & Next' })).toBeVisible();
  });

  test('preview navigates to patient details and returns to wizard', async ({ page }) => {
    await page.goto('/patients/create');
    await page.locator('#patient-name').fill('Preview Patient');
    await page.locator('#patient-age').fill('28');
    await page.getByRole('radio', { name: 'Male', exact: true }).click();
    await page.locator('#patient-whatsapp').fill('9000000001');
    await page.getByRole('heading', { level: 1, name: 'Basic Information' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await completePatientWizardStep2(page);
    await page.getByRole('button', { name: 'Create Patient' }).click();
    await page.getByRole('button', { name: 'Preview' }).click();
    await expect(page).toHaveURL(/\/patients\/\d+/);
    await expect(page.getByText('Preview Patient')).toBeVisible();
    await page.getByRole('link', { name: 'Go back' }).click();
    await expect(page).toHaveURL('/patients/create/dry-auto-refraction');
  });

  test('previous navigates to medical history step', async ({ page }) => {
    await page.getByRole('link', { name: 'Previous' }).click();
    await expect(page).toHaveURL('/patients/create/medical-history');
    await expect(page.getByRole('heading', { level: 1, name: 'Medical History' })).toBeVisible();
  });

  test('save and next navigates to dry refraction step', async ({ page }) => {
    await page.getByRole('button', { name: 'Save & Next' }).click();
    await expect(page).toHaveURL('/patients/create/dry-refraction');
    await expect(page.getByRole('heading', { level: 1, name: 'Dry Refraction' })).toBeVisible();
  });

  test('same as right eye copies right eye values to left eye', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Sph' }).first().click();
    await page.getByRole('button', { name: '+', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.getByRole('button', { name: '.50' }).click();
    await page.getByRole('checkbox', { name: 'Same as Right Eye' }).click();

    await expect(page.getByRole('button', { name: 'Edit Sph' }).first()).toHaveText('+3.50');
    await expect(page.getByRole('checkbox', { name: 'Same as Right Eye' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(page.locator('[data-figma-node-id="126:21418"]')).toHaveText('+3.50');
  });
});
