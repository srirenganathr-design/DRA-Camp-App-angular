import { test, expect, type Page } from '@playwright/test';
import { expectFigmaNode } from '../utils/figma-parity';

const EMPTY_SHEET_NODES = [
  '156:31293',
  '156:31294',
  '156:31295',
  '156:31296',
  '156:31297',
  '185:48261',
  '185:48262',
  '185:48264',
  '185:48267',
  '185:48270',
  '156:31308',
  '156:31309',
  '156:31310',
  '156:31312',
  '156:31313',
  '156:31314',
  '156:31315',
  '156:31316',
  '156:31317',
];

const FILLED_SHEET_NODES = [
  '156:31378',
  '156:31379',
  '156:31380',
  '156:31381',
  '156:31382',
  '185:48245',
  '185:48246',
  '185:48248',
  '185:48251',
  '185:48254',
  '156:31393',
  '156:31394',
  '156:31399',
  '156:31400',
  '156:31401',
  '156:31402',
  '156:31441',
  '156:31561',
];

test.describe('Figma parity — Choose Consultants bottom sheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camps/create/team');
    await page.setViewportSize({ width: 360, height: 800 });
    await expect(page.getByRole('heading', { level: 1, name: 'Choose Team' })).toBeVisible();
  });

  async function openConsultantPicker(page: Page) {
    const addBtn = page.getByRole('button', { name: 'Add Consultant(s)' });
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.click();
  }

  test('sheet nodes are absent until Add Consultant(s) is clicked', async ({ page }) => {
    for (const nodeId of [...EMPTY_SHEET_NODES, ...FILLED_SHEET_NODES]) {
      await expect(page.locator(`[data-figma-node-id="${nodeId}"]`)).toHaveCount(0);
    }
  });

  test('clicking Add Consultant(s) opens the empty-state bottom sheet', async ({ page }) => {
    await openConsultantPicker(page);
    await expect(page.getByRole('dialog', { name: 'Add Consultants' })).toBeVisible();
    await expect(page.locator('#add-team-members-title-add-consultants')).toHaveText('Add Consultants');

    for (const nodeId of EMPTY_SHEET_NODES) {
      await expectFigmaNode(page, nodeId);
    }

    await expect(page.locator('[data-figma-node-id="156:31312"]')).toHaveText('No User Selected');
    await expect(page.locator('[data-figma-node-id="156:31313"]')).toHaveText(
      'The selected users will appear here.',
    );
  });

  test('Close dismisses the sheet without applying selections', async ({ page }) => {
    await openConsultantPicker(page);
    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('dialog', { name: 'Add Consultants' })).toHaveCount(0);
    await expect(page.locator('[data-figma-node-id="156:46376"]')).toHaveText('No Consultants Selected');
  });

  test('Apply adds selected consultants to the team section', async ({ page }) => {
    await openConsultantPicker(page);
    await page.getByPlaceholder('Janani Sridhar').fill('Janani');
    await page.getByRole('button', { name: 'Janani Sridhar - 110850', exact: true }).click();
    await page.getByPlaceholder('Janani Sridhar').fill('Srikrishna');
    await page.getByRole('button', { name: 'Srikrishna Gururao Nadgouda - 900339', exact: true }).click();

    for (const nodeId of FILLED_SHEET_NODES) {
      await expectFigmaNode(page, nodeId);
    }

    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByRole('dialog', { name: 'Add Consultants' })).toHaveCount(0);
    await expect(page.locator('[data-figma-node-id="156:46376"]')).toHaveCount(0);
    await expect(page.locator('[data-figma-node-id="consultant-110850"]')).toHaveText('Janani Sridhar - 110850');
    await expect(page.locator('[data-figma-node-id="consultant-900339"]')).toHaveText(
      'Srikrishna Gururao Nadgouda - 900339',
    );
  });

  test('Reset clears selected chips and returns to empty state', async ({ page }) => {
    await openConsultantPicker(page);
    await page.getByPlaceholder('Janani Sridhar').fill('Janani');
    await page.getByRole('button', { name: 'Janani Sridhar - 110850', exact: true }).click();
    await page.getByRole('button', { name: 'Reset' }).click();

    await expect(page.locator('[data-figma-node-id="156:31441"]')).toHaveCount(0);
    await expect(page.locator('[data-figma-node-id="156:31312"]')).toHaveText('No User Selected');
  });

  test('email search finds staff by email address', async ({ page }) => {
    await openConsultantPicker(page);
    await page.getByRole('button', { name: 'Email' }).click();
    await page.getByPlaceholder('janani.sridhar@dragarwals.com').fill('harish.chandran@dragarwals.com');
    await expect(page.getByRole('button', { name: 'Harish Chandran - 124456', exact: true })).toBeVisible();
  });
});
