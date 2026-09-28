import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';

const REQUIRED_NODES = [
  '16:4942',
  '16:4945',
  '16:4946',
  '16:4947',
  '16:4948',
  '16:4949',
  '16:4950',
  '16:4951',
  '16:4953',
  '16:4954',
  '16:4956',
  '16:4958',
  '16:4967',
  '16:4969',
  '16:4974',
  '16:4965',
  '16:4976',
  '16:4981',
  '16:4986',
  '16:4987',
  '16:4988',
  '16:4990',
  '16:5016',
  '16:5019',
  '16:5020',
  '16:5022',
  '16:5023',
  '16:5024',
  '16:5025',
  '16:5029',
  '16:5030',
  '16:5031',
  '16:5032',
  '16:5033',
  '16:5034',
  '16:5035',
  '16:5036',
  '16:5037',
  '16:5067',
  '16:5095',
  '16:5125',
  '16:5155',
  '16:5186',
];

test.describe('Figma parity — Camp Details w/ patients screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camps/1');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('camp name typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '16:4958');
    await expectComputedStyles(title, {
      'font-size': '18px',
      'font-weight': '600',
    });
  });

  test('camp profile, search, and patient list render correctly', async ({ page }) => {
    await expect(page.locator('[data-figma-node-id="16:4958"]')).toContainText('Eye Check-up camp');
    await expect(page.locator('[data-figma-node-id="16:4981"]')).toHaveText('12:30PM - 04:30PM, 09-Sep-2026');
    await expect(page.locator('[data-figma-node-id="16:5022"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'All Time' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'All Patients' })).toBeVisible();
    await expect(page.getByText('Anita Sharma')).toBeVisible();
    await expect(page.getByText('Suresh Kumar')).toBeVisible();
    await expect(page.getByText('Ravi Shankar')).toBeVisible();
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Patients' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create Patients' })).toBeVisible();
  });

  test('back navigates to camps list', async ({ page }) => {
    await page.getByRole('link', { name: 'Go back' }).click();
    await expect(page).toHaveURL('/camps');
    await expect(page.getByRole('heading', { level: 1, name: 'Camps' })).toBeVisible();
  });

  test('create patients navigates to create patient flow', async ({ page }) => {
    await page.getByRole('link', { name: 'Create Patients' }).click();
    await expect(page).toHaveURL('/patients/create');
    await expect(page.getByRole('heading', { level: 1, name: 'Basic Information' })).toBeVisible();
  });

  test('header edit navigates to edit camp flow', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page).toHaveURL('/camps/1/edit');
    await expect(page.getByRole('heading', { level: 1, name: 'Basic Information' })).toBeVisible();
  });
});
