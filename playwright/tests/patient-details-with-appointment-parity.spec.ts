import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';

const REQUIRED_NODES = [
  '16:4092',
  '16:4093',
  '16:4094',
  '16:4095',
  '16:4096',
  '16:4097',
  '16:4098',
  '16:4099',
  '16:4100',
  '16:4101',
  '16:4102',
  '16:4103',
  '16:4107',
  '16:4108',
  '16:4110',
  '16:4118',
  '16:4134',
  '16:4109',
  '16:4114',
  '16:4116',
  '16:4136',
  '16:4137',
  '16:4140',
  '16:4143',
  '16:4148',
  '16:4153',
  '16:4154',
  '16:4155',
  '16:4158',
  '16:4160',
  '16:4162',
  '16:4163',
  '16:4170',
  '16:4173',
  '16:4178',
  '16:4193',
  '16:4255',
  '16:4258',
  '16:4263',
  '16:4364',
];

test.describe('Figma parity — Patient Details w/ Appointment screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/patients/23/appointment');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('header title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '16:4097');
    await expectComputedStyles(title, {
      'font-size': '14px',
      'font-weight': '500',
    });
  });

  test('profile card and appointment schedule render correctly', async ({ page }) => {
    await expect(page.getByText('Rajkumar Periyasamy')).toBeVisible();
    await expect(page.getByText('12:30PM, 09-Sep-2026')).toBeVisible();
    await expect(page.locator('[data-figma-node-id="16:4153"]')).toHaveText('Nanganallur, Chennai');
    await expect(page.locator('[data-figma-node-id="16:4154"]')).toHaveText(
      'No. 10, 1st Main Road, Tharun Villa Building, Nanganallur, Chennai.',
    );
    await expect(page.getByRole('heading', { level: 2, name: 'Appointment Schedule' })).toBeVisible();
  });

  test('appointment card styling matches Figma specification', async ({ page }) => {
    const card = await expectFigmaNode(page, '16:4143');
    await expectComputedStyles(card, {
      'background-color': 'rgb(244, 248, 255)',
      'border-radius': '16px',
      padding: '16px',
    });

    const time = await expectFigmaNode(page, '16:4148');
    await expectComputedStyles(time, {
      'font-size': '12px',
      'font-weight': '500',
    });
  });

  test('medical history and refraction sections render', async ({ page }) => {
    await expect(page.getByText('Diabetic')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Dry Refraction' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Dry Auto-Refraction' })).toBeVisible();
    await expect(page.locator('[data-figma-node-id="16:4193"]')).toHaveText('-25.25');
  });

  test('no schedule appointment footer is shown', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Schedule Appointment' })).toHaveCount(0);
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Go back' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Edit' })).toBeVisible();
  });

  test('appointment edit navigates to prefilled schedule page', async ({ page }) => {
    await page.locator('[data-figma-node-id="16:4141"]').click();
    await expect(page).toHaveURL('/patients/23/schedule-appointment');
    await expect(page.locator('[data-figma-node-id="126:22022"]')).toContainText('Nanganallur, Chennai');
    await expect(page.locator('[data-figma-node-id="126:22034"]')).toHaveClass(/dateChipSelected/);
    await expect(page.locator('[data-figma-node-id="126:22082"]')).toHaveClass(/timeSlotSelected/);
  });

  test('back navigates to patients list', async ({ page }) => {
    await page.getByRole('link', { name: 'Go back' }).click();
    await expect(page).toHaveURL('/patients');
  });
});
