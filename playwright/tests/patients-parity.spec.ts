import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';

const REQUIRED_NODES = [
  '16:3054',
  '16:3056',
  '16:3058',
  '16:3074',
  '16:3098',
  '16:3105',
  '16:3107',
  '16:3109',
  '16:3110',
  '16:3114',
  '16:3115',
  '16:3116',
  '16:3117',
  '16:3118',
  '16:3119',
  '16:3120',
  '20:22317',
  '20:22318',
  '20:22348',
  '16:3271',
  '16:3275',
];

test.describe('Figma parity — Patients screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/patients');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('page title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '16:3105');
    await expectComputedStyles(title, {
      'font-size': '24px',
      'font-weight': '800',
      color: 'rgb(255, 255, 255)',
    });
  });

  test('patient cards render with correct text content', async ({ page }) => {
    await expect(page.getByText('Anita Sharma')).toBeVisible();
    await expect(page.getByText('Suresh Kumar')).toBeVisible();
    await expect(page.getByText('Eye Screening Camp')).toBeVisible();
    await expect(page.getByText('Community Eye Health Camp')).toBeVisible();
  });

  test('patient card layout matches list-cards Figma structure', async ({ page }) => {
    const anitaCard = page.locator('[data-figma-node-id="20:22318"]');
    await expect(anitaCard.getByText('#7')).toBeVisible();
    await expect(anitaCard.getByText('Eye Screening Camp')).toBeVisible();
    await expect(anitaCard.getByText('20 yrs')).toBeVisible();
    await expect(anitaCard.getByText('Male')).toBeVisible();
    await expect(anitaCard.getByText('20M')).not.toBeVisible();

    const sureshCard = page.locator('[data-figma-node-id="20:22348"]');
    await expect(sureshCard.getByText('10 yrs')).toBeVisible();
    await expect(sureshCard.getByText('Female')).toBeVisible();
  });

  test('phone verification controls reflect verified state', async ({ page }) => {
    const anitaCard = page.locator('[data-figma-node-id="20:22318"]');
    await expect(anitaCard.getByRole('button', { name: 'Verify Now' })).toBeVisible();

    const sureshCard = page.locator('[data-figma-node-id="20:22348"]');
    await expect(sureshCard.getByRole('button', { name: 'Verify Now' })).not.toBeVisible();
    await expect(sureshCard.getByLabel('Phone verified')).toBeVisible();
  });

  test('verify now flow completes with OTP entry', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('dra-phone-verified');
    });
    await page.goto('/patients');
    await page.setViewportSize({ width: 360, height: 800 });

    const anitaCard = page.locator('[data-figma-node-id="20:22318"]');
    await anitaCard.getByRole('button', { name: 'Verify Now' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Verify Mobile number' })).toBeVisible();
    await expect(dialog).toHaveAttribute('data-figma-node-id', '16:5407');
    await dialog.getByRole('button', { name: 'Yes, Verify' }).click();

    await expect(dialog).toHaveAttribute('data-figma-node-id', '16:5426');
    const otpInput = dialog.getByLabel('One-time password');
    await otpInput.fill('1234');
    await otpInput.blur();
    await dialog.getByRole('button', { name: 'Verify OTP' }).click();

    await expect(anitaCard.getByLabel('Phone verified')).toBeVisible();
    await expect(anitaCard.getByRole('button', { name: 'Verify Now' })).not.toBeVisible();
  });

  test('status badges and filter chips render correct labels', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Screened' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Referred' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Treated' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Visited' })).toBeVisible();
  });

  test('status badges use variant coloured text', async ({ page }) => {
    const screenedBadge = await expectFigmaNode(page, '20:22330');
    await expectComputedStyles(screenedBadge, {
      'background-color': 'rgb(223, 236, 255)',
    });
    await expectComputedStyles(screenedBadge.locator('span'), {
      color: 'rgb(0, 92, 223)',
    });

    const referredBadge = await expectFigmaNode(page, '20:22360');
    await expectComputedStyles(referredBadge.locator('span'), {
      color: 'rgb(170, 133, 0)',
    });

    const treatedBadge = await expectFigmaNode(page, '20:22388');
    await expectComputedStyles(treatedBadge, {
      'background-color': 'rgb(255, 240, 230)',
    });
    await expectComputedStyles(treatedBadge.locator('span'), {
      color: 'rgb(208, 88, 7)',
    });

    const visitedBadge = await expectFigmaNode(page, '20:22418');
    await expectComputedStyles(visitedBadge, {
      'background-color': 'rgb(229, 245, 224)',
    });
    await expectComputedStyles(visitedBadge.locator('span'), {
      color: 'rgb(27, 136, 0)',
    });
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Patients' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'All Patients' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: 'Search' })).toBeVisible();
  });

  test('active nav tab is Patients', async ({ page }) => {
    const patientsTab = await expectFigmaNode(page, '16:3275');
    await expect(patientsTab.getByText('Patients')).toBeVisible();
    await expectComputedStyles(patientsTab.locator('span').last(), {
      color: 'rgb(0, 92, 223)',
      'font-weight': '600',
    });
  });

  test('hero chips show All Time and All Camps', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All Time' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'All Camps' })).toBeVisible();
  });

  test('status filter chips filter the patient list', async ({ page }) => {
    await page.getByRole('button', { name: 'Referred' }).click();
    await expect(page.getByText('Suresh Kumar')).toBeVisible();
    await expect(page.getByText('Anita Sharma')).not.toBeVisible();
  });

  test('All Time chip opens time range bottom sheet', async ({ page }) => {
    await page.getByRole('button', { name: 'All Time' }).click();
    await expect(page.getByRole('dialog', { name: 'Select Time Range' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Last 30 Days' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Custom Range' })).toBeVisible();
  });

  test('time range preset filters patients', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-09-15T12:00:00') });
    await page.reload();

    await page.getByRole('button', { name: 'All Time' }).click();
    await page.getByRole('option', { name: 'Last 30 Days' }).click();

    await expect(page.getByRole('button', { name: 'Last 30 Days' })).toBeVisible();
    await expect(page.getByText('Anita Sharma')).toBeVisible();
    await expect(page.getByText('Suresh Kumar')).toBeVisible();
    await expect(page.getByText('Meera Nair')).not.toBeVisible();
  });

  test('custom time range opens date range picker and filters patients', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-09-15T12:00:00') });
    await page.reload();

    await page.getByRole('button', { name: 'All Time' }).click();
    await page.getByRole('option', { name: 'Custom Range' }).click();
    await expect(page.getByRole('dialog', { name: 'Select Date Range' })).toBeVisible();

    const calendar = page.locator('[data-name="Select Date Range"]');
    await calendar.locator('[data-day="9/1/2026"]').click({ force: true });
    await calendar.locator('[data-day="9/10/2026"]').click({ force: true });
    await expect(page.getByRole('button', { name: 'Apply' })).toBeEnabled();
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByText('Anita Sharma')).toBeVisible();
    await expect(page.getByText('Suresh Kumar')).not.toBeVisible();
  });

  test('All Camps chip opens camp picker bottom sheet', async ({ page }) => {
    await page.getByRole('button', { name: 'All Camps' }).click();
    await expect(page.getByRole('dialog', { name: 'Select Camp' })).toBeVisible();
    await expect(page.getByText('No Camp Selected')).toBeVisible();
  });

  test('camp picker filters patients when a camp is applied', async ({ page }) => {
    await page.getByRole('button', { name: 'All Camps' }).click();
    await page.locator('[data-name="Select Camp"] input').fill('Cataract');
    await page.getByRole('button', { name: 'Cataract Screening Camp' }).click();
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByRole('button', { name: 'Cataract Screening Camp' })).toBeVisible();
    await expect(page.getByText('Anita Sharma')).toBeVisible();
    await expect(page.getByText('Suresh Kumar')).toBeVisible();
    await expect(page.getByText('Meera Nair')).not.toBeVisible();
  });

  test('camp picker reset clears camp filter', async ({ page }) => {
    await page.getByRole('button', { name: 'All Camps' }).click();
    await page.locator('[data-name="Select Camp"] input').fill('Cataract');
    await page.getByRole('button', { name: 'Cataract Screening Camp' }).click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText('Meera Nair')).not.toBeVisible();

    await page.getByRole('button', { name: 'Cataract Screening Camp' }).click();
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByRole('button', { name: 'All Camps' })).toBeVisible();
    await expect(page.getByText('Meera Nair')).toBeVisible();
  });

  test('patient card arrow navigates to patient details', async ({ page }) => {
    await page.getByRole('link', { name: 'View Anita Sharma' }).click();
    await expect(page).toHaveURL('/patients/23');
    await expect(page.getByText('Patient Details')).toBeVisible();
  });

  test('patient card calendar navigates to schedule appointment', async ({ page }) => {
    await page.getByRole('link', { name: 'Schedule for Anita Sharma' }).click();
    await expect(page).toHaveURL('/patients/23/schedule-appointment');
  });
});
