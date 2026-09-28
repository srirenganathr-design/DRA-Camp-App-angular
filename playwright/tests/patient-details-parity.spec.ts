import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';

const REQUIRED_NODES = [
  '16:3821',
  '16:3822',
  '16:3823',
  '16:3824',
  '16:3825',
  '16:3826',
  '16:3827',
  '16:3828',
  '16:3829',
  '16:3830',
  '16:3831',
  '16:3832',
  '16:3836',
  '16:3837',
  '16:3839',
  '16:3847',
  '16:3863',
  '16:3838',
  '16:3843',
  '16:3845',
  '16:3865',
  '16:3866',
  '16:3869',
  '16:3871',
  '16:3873',
  '16:3874',
  '16:3881',
  '16:3884',
  '16:3904',
  '16:3964',
  '16:3967',
  '16:4073',
  '16:4075',
  '16:4076',
];

test.describe('Figma parity — Patient Details screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/patients/23');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('header title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '16:3826');
    await expectComputedStyles(title, {
      'font-size': '14px',
      'font-weight': '500',
    });
  });

  test('patient profile and medical history render correctly', async ({ page }) => {
    const profileCard = await expectFigmaNode(page, '16:3829');
    await expect(profileCard).toBeVisible();
    await expect(page.getByText('Rajkumar Periyasamy')).toBeVisible();
    await expect(page.locator('[data-figma-node-id="16:3843"]')).toHaveText('23');
    await expect(page.getByText('Screened')).toBeVisible();
    await expect(page.getByText('89706 35213')).toBeVisible();
    await expect(page.getByText('Dr. Agarwal\u2019s Eye Check-up camp')).toBeVisible();
    await expect(page.getByText('Diabetic')).toBeVisible();
    await expect(page.getByText('No').first()).toBeVisible();
    await expect(page.getByText('2-5 hrs')).toBeVisible();
  });

  test('profile card first fold matches Figma dimensions', async ({ page }) => {
    const profileHeader = await expectFigmaNode(page, '16:3830');
    await expectComputedStyles(profileHeader, { height: '202px' });
    await expect(page.locator('[data-figma-node-id="16:3831"]')).toBeVisible();
  });

  test('refraction sections render with correct labels and values', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Dry Refraction' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Dry Auto-Refraction' })).toBeVisible();
    await expect(page.getByText('R/OD')).toHaveCount(2);
    await expect(page.getByText('L/OS')).toHaveCount(2);
    await expect(page.locator('[data-figma-node-id="16:3904"]')).toHaveText('-25.25');
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Go back' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Schedule Appointment' })).toBeVisible();
  });

  test('back navigates to patients list', async ({ page }) => {
    await page.getByRole('link', { name: 'Go back' }).click();
    await expect(page).toHaveURL('/patients');
    await expect(page.getByRole('heading', { level: 1, name: 'Patients' })).toBeVisible();
  });
});
