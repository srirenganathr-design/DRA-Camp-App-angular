import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectBox, expectComputedStyles } from '../utils/figma-parity';

const REQUIRED_NODES = [
  '16:2857',
  '16:2858',
  '16:2861',
  '16:2877',
  '16:2901',
  '16:2908',
  '16:2910',
  '16:2912',
  '16:2913',
  '16:2917',
  '16:2918',
  '16:2919',
  '16:2920',
  '16:2921',
  '16:2922',
  '16:2923',
  '16:2924',
  '16:2970',
  '16:2993',
  '16:3018',
  '16:3042',
  '16:3043',
];

test.describe('Figma parity — Camps screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camps');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('root screen geometry matches Figma specification', async ({ page }) => {
    const root = await expectFigmaNode(page, '16:2857');
    await expectBox(root, { width: 360, height: 800 }, 2);
  });

  test('page title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '16:2908');
    await expectComputedStyles(title, {
      'font-size': '24px',
      'font-weight': '800',
      color: 'rgb(255, 255, 255)',
    });
  });

  test('section title typography matches Figma specification', async ({ page }) => {
    const sectionTitle = await expectFigmaNode(page, '16:2917');
    await expectComputedStyles(sectionTitle, {
      'font-size': '18px',
      'font-weight': '500',
    });
  });

  test('content panel hero-to-list gap matches Figma (64px)', async ({ page }) => {
    const panel = await expectFigmaNode(page, '16:2904');
    await expectComputedStyles(panel, {
      gap: '64px',
    });
  });

  test('first camp card shows Figma camp number', async ({ page }) => {
    const card = await expectFigmaNode(page, '16:2924');
    await expect(card.getByText('#1')).toBeVisible();
  });

  test('status filter chips render below section title', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Scheduled' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Active' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Completed' })).toBeVisible();
  });

  test('camp cards render with correct text content', async ({ page }) => {
    await expect(page.getByText('Cataract Screening Camp')).toBeVisible();
    await expect(page.getByText('Diabetic Retinopathy Check-up')).toBeVisible();
    await expect(page.getByText('Pediatric Vision Screening Camp')).toBeVisible();
    await expect(page.getByText('Corneal Health Awareness Camp')).toBeVisible();
  });

  test('camp card layout matches list-cards Figma structure', async ({ page }) => {
    const cataractCard = page.locator('[data-figma-node-id="16:2924"]');
    await expect(cataractCard.getByText('Dr. Kavitha Nair')).toBeVisible();
    await expect(cataractCard.getByText('CSC')).toBeVisible();
    await expect(cataractCard.getByText('14 Patients')).toBeVisible();
  });

  test('status badges render correct labels', async ({ page }) => {
    const list = await expectFigmaNode(page, '16:2923');
    await expect(list.getByText('Active', { exact: true })).toBeVisible();
    await expect(list.getByText('Cancelled', { exact: true })).toBeVisible();
    await expect(list.getByText('Delayed', { exact: true })).toBeVisible();
    await expect(list.getByText('Completed', { exact: true })).toBeVisible();
  });

  test('status badges use variant coloured text', async ({ page }) => {
    const activeBadge = await expectFigmaNode(page, '16:2933');
    await expectComputedStyles(activeBadge, {
      'background-color': 'rgb(223, 236, 255)',
    });
    await expectComputedStyles(activeBadge.locator('span'), {
      color: 'rgb(0, 92, 223)',
    });

    const delayedBadge = await expectFigmaNode(page, '16:3002');
    await expectComputedStyles(delayedBadge, {
      'background-color': 'rgb(255, 240, 230)',
    });
    await expectComputedStyles(delayedBadge.locator('span'), {
      color: 'rgb(208, 88, 7)',
    });

    const cancelledBadge = await expectFigmaNode(page, '16:2979');
    await expectComputedStyles(cancelledBadge, {
      'background-color': 'rgb(253, 232, 232)',
    });
    await expectComputedStyles(cancelledBadge.locator('span'), {
      color: 'rgb(183, 34, 34)',
    });
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Camps' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'All Camps' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: 'Search' })).toBeVisible();
  });

  test('active nav tab is Camps', async ({ page }) => {
    const campsTab = await expectFigmaNode(page, '16:3043');
    await expect(campsTab.getByText('Camps')).toBeVisible();
    await expectComputedStyles(campsTab.locator('span').last(), {
      color: 'rgb(0, 92, 223)',
      'font-weight': '600',
    });
  });

  test('zone dropdown filters camps by selected zone', async ({ page }) => {
    await expect(page.getByText('Cataract Screening Camp')).toBeVisible();
    await expect(page.getByText('Glaucoma Detection Drive')).not.toBeVisible();
    await page.getByRole('button', { name: 'Nanganallur' }).click();
    await page.getByRole('option', { name: 'T Nagar' }).click();
    await expect(page.getByText('Glaucoma Detection Drive')).toBeVisible();
    await expect(page.getByText('Cataract Screening Camp')).not.toBeVisible();
  });

  test('status filter chips filter the camp list', async ({ page }) => {
    await page.getByRole('button', { name: 'Active' }).click();
    await expect(page.getByText('Cataract Screening Camp')).toBeVisible();
    await expect(page.getByText('Pediatric Vision Screening Camp')).not.toBeVisible();
  });

  test('camp card arrow navigates to camp details', async ({ page }) => {
    await page.getByRole('link', { name: 'View Cataract Screening Camp' }).click();
    await expect(page).toHaveURL('/camps/1');
    await expect(page.getByText('Camp Details')).toBeVisible();
  });

  test('All Time chip opens time range bottom sheet', async ({ page }) => {
    await page.locator('[data-figma-node-id="16:2912"]').click();
    await expect(page.locator('[data-name="Select Time Range"]')).toBeVisible();
    await expect(page.getByRole('option', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Last 30 Days' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Custom Range' })).toBeVisible();
  });

  test('time range preset filters camps', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-09-15T12:00:00') });
    await page.reload();

    await page.locator('[data-figma-node-id="16:2912"]').click();
    await page.getByRole('option', { name: 'Last 30 Days' }).click();

    await expect(page.getByRole('button', { name: 'Last 30 Days' })).toBeVisible();
    await expect(page.getByText('Cataract Screening Camp')).toBeVisible();
    await expect(page.getByText('Corneal Health Awareness Camp')).toBeVisible();
    await expect(page.getByText('Pediatric Vision Screening Camp')).not.toBeVisible();
  });

  test('custom time range opens date range picker and filters camps', async ({ page }) => {
    await page.locator('[data-figma-node-id="16:2912"]').click();
    await page.getByRole('option', { name: 'Custom Range' }).click();
    await expect(page.locator('[data-name="Select Date Range"]')).toBeVisible();

    const calendar = page.locator('[data-name="Select Date Range"]');
    await calendar.locator('[data-day="9/1/2026"]').click({ force: true });
    await calendar.locator('[data-day="9/15/2026"]').click({ force: true });
    await expect(page.getByRole('button', { name: 'Apply' })).toBeEnabled();
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByText('Cataract Screening Camp')).toBeVisible();
    await expect(page.getByText('Corneal Health Awareness Camp')).not.toBeVisible();
  });

  test('All Types chip opens camp type bottom sheet', async ({ page }) => {
    await page.locator('[data-figma-node-id="16:2913"]').click();
    await expect(page.locator('[data-name="Select Camp Type"]')).toBeVisible();
    await expect(page.getByRole('radio', { name: 'All Types' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'DRT' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'CR' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Public Camp' })).toBeVisible();
  });

  test('camp type filter filters the camp list', async ({ page }) => {
    await page.locator('[data-figma-node-id="16:2913"]').click();
    await page.getByRole('radio', { name: 'CR' }).click();
    await expect(page.getByRole('button', { name: 'CR' })).toBeVisible();
    await expect(page.getByText('Cataract Screening Camp')).toBeVisible();
    await expect(page.getByText('Diabetic Retinopathy Check-up')).not.toBeVisible();
  });

  test('camp type filter resets when zone changes', async ({ page }) => {
    await page.locator('[data-figma-node-id="16:2913"]').click();
    await page.getByRole('radio', { name: 'Public Camp' }).click();
    await expect(page.getByRole('button', { name: 'Public Camp' })).toBeVisible();

    await page.getByRole('button', { name: 'Nanganallur' }).click();
    await page.getByRole('option', { name: 'T Nagar' }).click();
    await expect(page.getByRole('button', { name: 'All Types' })).toBeVisible();
  });
});

test.describe('Delayed camp cancel flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camps');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('delayed card shows cancel button and view link', async ({ page }) => {
    const pediatricCard = page.locator('[data-figma-node-id="16:2993"]');
    await expect(pediatricCard.locator('[data-figma-node-id="16:3016"]')).toBeVisible();
    await expect(
      pediatricCard.getByRole('link', { name: 'View Pediatric Vision Screening Camp' }),
    ).toBeVisible();
  });

  test('non-delayed card does not show cancel button', async ({ page }) => {
    const cataractCard = page.locator('[data-figma-node-id="16:2924"]');
    await expect(cataractCard.locator('[data-figma-node-id="16:3016"]')).toHaveCount(0);
  });

  test('cancel button opens confirmation sheet with camp name', async ({ page }) => {
    await page
      .getByRole('button', { name: 'Cancel Pediatric Vision Screening Camp' })
      .click();
    const sheet = page.getByRole('dialog');
    await expect(sheet.getByRole('heading', { name: 'Cancel camp?' })).toBeVisible();
    await expect(sheet.getByText('Pediatric Vision Screening Camp')).toBeVisible();
  });

  test('keep camp closes sheet and preserves delayed status', async ({ page }) => {
    await page
      .getByRole('button', { name: 'Cancel Pediatric Vision Screening Camp' })
      .click();
    await page.getByRole('button', { name: 'Keep camp' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    const pediatricCard = page.locator('[data-figma-node-id="16:2993"]');
    await expect(pediatricCard.getByText('Delayed', { exact: true })).toBeVisible();
    await expect(pediatricCard.locator('[data-figma-node-id="16:3016"]')).toBeVisible();
  });

  test('confirm cancel updates status and removes cancel button', async ({ page }) => {
    await page
      .getByRole('button', { name: 'Cancel Pediatric Vision Screening Camp' })
      .click();
    await page.getByRole('button', { name: 'Cancel camp' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    const pediatricCard = page.locator('[data-figma-node-id="16:2993"]');
    await expect(pediatricCard.getByText('Cancelled', { exact: true })).toBeVisible();
    await expect(pediatricCard.getByText('Delayed', { exact: true })).toHaveCount(0);
    await expect(pediatricCard.locator('[data-figma-node-id="16:3016"]')).toHaveCount(0);
  });

});
