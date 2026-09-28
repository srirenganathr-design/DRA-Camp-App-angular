import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';
import { confirmDiscardDraft } from '../utils/wizard-discard';

const REQUIRED_NODES = [
  '156:46280',
  '156:46283',
  '156:46284',
  '156:46285',
  '156:46289',
  '156:46290',
  '156:46292',
  '156:46293',
  '156:46294',
  '156:46297',
  '156:46298',
  '156:46299',
  '156:46300',
  '156:46301',
  '156:46302',
  '156:46303',
  '156:46304',
  '156:46306',
  '156:46308',
];

test.describe('Figma parity — Create Camp Branches screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camps/create/branches');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('step title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '156:46292');
    await expectComputedStyles(title, {
      'font-size': '20px',
      'font-weight': '600',
    });
  });

  test('branches section renders empty state', async ({ page }) => {
    await expect(page.locator('[data-figma-node-id="156:46299"]')).toHaveText('Branch(s)');
    await expect(page.getByRole('button', { name: 'Add Branch(s)' })).toBeVisible();
    await expect(page.locator('[data-figma-node-id="156:46303"]')).toHaveText('No Consultants Selected');
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Choose Branches' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  });

  test('previous navigates to location details step', async ({ page }) => {
    await page.getByRole('link', { name: 'Previous' }).click();
    await expect(page).toHaveURL('/camps/create/location');
    await expect(page.getByRole('heading', { level: 1, name: 'Location Details' })).toBeVisible();
  });

  test('back navigates to camps list after confirming discard', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();
    await confirmDiscardDraft(page);
    await expect(page).toHaveURL('/camps');
  });

  test('next navigates to choose team step', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Branch(s)' }).click();
    await expect(page.getByRole('dialog', { name: 'Select Branch' })).toBeVisible();
    await page.getByPlaceholder('Nanganallur').fill('Coimbatore');
    await page.getByRole('button', { name: /Coimbatore/ }).first().click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page).toHaveURL('/camps/create/team');
    await expect(page.getByRole('heading', { level: 1, name: 'Choose Team' })).toBeVisible();
  });

  test('add branch opens picker and adds selected branch to list', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Branch(s)' }).click();
    await expect(page.getByRole('dialog', { name: 'Select Branch' })).toBeVisible();
    await page.getByPlaceholder('Nanganallur').fill('Coimbatore');
    await page.getByRole('button', { name: /Coimbatore/ }).first().click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText(/Coimbatore —/)).toBeVisible();
  });

  test('picker supports selecting multiple branches in one session', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Branch(s)' }).click();
    await page.getByPlaceholder('Nanganallur').fill('Coimbatore');
    await page.getByRole('button', { name: /Coimbatore/ }).first().click();
    await page.getByPlaceholder('Nanganallur').fill('Salem');
    await page.getByRole('button', { name: /Salem/ }).first().click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText(/Coimbatore —/)).toBeVisible();
    await expect(page.getByText(/Salem —/)).toBeVisible();
  });

  test('branch code search returns matching clinic', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Branch(s)' }).click();
    await page.getByRole('button', { name: 'Code' }).click();
    await page.getByPlaceholder('BR-CHE-002').fill('BR-CHE-002');
    await page.getByRole('button', { name: /Velachery, Chennai/ }).first().click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText(/Velachery, Chennai —/)).toBeVisible();
  });
});
