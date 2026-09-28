import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';
import { completePatientWizardFoundation } from '../utils/patient-wizard';

const REQUIRED_NODES = [
  '126:21487',
  '16:3396',
  '16:3397',
  '16:3398',
  '16:3399',
  '16:3400',
  '126:21496',
  '126:21497',
  '126:21499',
  '126:21500',
  '126:21501',
  '126:21507',
  '126:21511',
  '126:21586',
  '126:21591',
  '185:48330',
  '185:48333',
  '126:21595',
  '126:21670',
  '126:21671',
  '126:21673',
  '126:21675',
];

test.describe('Figma parity — Create Patient Dry Refraction screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await completePatientWizardFoundation(page);
    await page.getByRole('button', { name: 'Create Patient' }).click();
    await page.getByRole('button', { name: 'Save & Next' }).click();
    await expect(page).toHaveURL('/patients/create/dry-refraction');
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('step title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '126:21499');
    await expectComputedStyles(title, {
      'font-size': '20px',
      'font-weight': '600',
    });
  });

  test('dry refraction readings render with correct values', async ({ page }) => {
    await expect(page.getByText('Right Eye / Oculus Dexter')).toBeVisible();
    await expect(page.getByText('Left Eye / Oculus Sinister')).toBeVisible();
    await expect(page.getByText('Same as Right Eye')).toBeVisible();
    await expect(page.getByText('Distant', { exact: true })).toHaveCount(2);
    await expect(page.getByText('Add', { exact: true })).toHaveCount(2);
    await expect(page.getByText('Near', { exact: true })).toHaveCount(2);
    await expect(page.locator('[data-figma-node-id="126:21520"]')).toHaveText('-0.00');
    await expect(page.locator('[data-figma-node-id="126:21604"]')).toHaveText('-0.00');
    await expect(page.locator('[data-figma-node-id="126:21535"]')).toHaveText('20/20');
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Dry Refraction' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Comment' })).toHaveCount(2);
    await expect(page.getByRole('link', { name: 'Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save & Next' })).toBeVisible();
  });

  test('next navigates to diagnosis step', async ({ page }) => {
    await page.getByRole('button', { name: 'Save & Next' }).click();
    await expect(page).toHaveURL('/patients/create/diagnosis');
    await expect(page.getByRole('heading', { level: 1, name: 'Diagnosis' })).toBeVisible();
  });

  test('previous navigates to dry auto-refraction step', async ({ page }) => {
    await page.getByRole('link', { name: 'Previous' }).click();
    await expect(page).toHaveURL('/patients/create/dry-auto-refraction');
    await expect(page.getByRole('heading', { level: 1, name: 'Dry Auto-Refraction' })).toBeVisible();
  });

  test('same as right eye copies right eye values to left eye', async ({ page }) => {
    await page.locator('[data-figma-node-id="126:21520"]').click();
    await page.getByRole('button', { name: '+', exact: true }).click();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.getByRole('button', { name: '.50' }).click();
    await page.getByRole('checkbox', { name: 'Same as Right Eye' }).click();

    await expect(page.locator('[data-figma-node-id="126:21520"]')).toHaveText('+3.50');
    await expect(page.getByRole('checkbox', { name: 'Same as Right Eye' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(page.locator('[data-figma-node-id="126:21604"]')).toHaveText('+3.50');
  });
});
