import { test, expect } from '@playwright/test';
import { completePatientWizardStep2 } from '../utils/patient-wizard';

test.describe('Dynamic data flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('static patients list navigates to store-backed detail', async ({ page }) => {
    await page.goto('/patients');
    await expect(page.getByText('Anita Sharma')).toBeVisible();
    await page.getByRole('link', { name: 'View Anita Sharma' }).click();
    await expect(page).toHaveURL('/patients/23');
    await expect(page.getByText('Rajkumar Periyasamy')).toBeVisible();
  });

  test('create patient wizard persists to store detail', async ({ page }) => {
    await page.goto('/patients/create');
    await page.locator('#patient-name').fill('Test Patient Dynamic');
    await page.locator('#patient-age').fill('30');
    await page.getByRole('radio', { name: 'Male', exact: true }).click();
    await page.locator('#patient-whatsapp').fill('9123456789');
    await page.getByRole('heading', { level: 1, name: 'Basic Information' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page).toHaveURL('/patients/create/medical-history');
    await completePatientWizardStep2(page);
    await page.getByRole('button', { name: 'Create Patient' }).click();
    await page.getByRole('button', { name: 'Save & Next' }).click();
    await page.getByRole('button', { name: 'Save & Next' }).click();
    await page.getByRole('button', { name: 'Save & Next' }).click();
    await expect(page).toHaveURL(/\/patients\/\d+$/);
    await expect(page.getByText('Test Patient Dynamic')).toBeVisible();
    await page.getByRole('link', { name: 'Go back' }).click();
    await expect(page).toHaveURL('/patients');
    await expect(page.getByText('Anita Sharma')).toBeVisible();
  });

  test('static camp list navigates to store-backed camp detail', async ({ page }) => {
    await page.goto('/camps');
    await expect(page.getByText('Cataract Screening Camp')).toBeVisible();
    await page.getByRole('link', { name: 'View Cataract Screening Camp' }).click();
    await expect(page).toHaveURL('/camps/1');
    await expect(page.getByText('Anita Sharma')).toBeVisible();
  });

  test('schedule appointment saves to patient detail', async ({ page }) => {
    await page.goto('/patients/23/schedule-appointment');
    await page.locator('[data-figma-node-id="126:22022"]').click();
    await page.getByPlaceholder('Nanganallur').fill('Nanganallur');
    await page.getByRole('button', { name: /Nanganallur, Chennai/ }).click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.locator('[data-figma-node-id="126:22034"]').click();
    await page.getByRole('button', { name: 'Afternoon' }).click();
    await page.getByRole('button', { name: '12:30 PM' }).click();
    await page.getByRole('button', { name: 'Schedule' }).click();
    await expect(page).toHaveURL('/patients/23/appointment');
    await expect(page.getByText('12:30PM, 09-Sep-2026')).toBeVisible();
  });
});
