import { test, expect, type Page } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';
import { confirmDiscardDraft } from '../utils/wizard-discard';

async function addTeamMember(
  page: Page,
  addButtonName: string,
  dialogName: string,
  memberName: string,
  options?: { singleSelect?: boolean },
) {
  await page.getByRole('button', { name: addButtonName }).click();
  await expect(page.getByRole('dialog', { name: dialogName })).toBeVisible();
  await page.getByRole('button', { name: memberName, exact: true }).click();
  if (!options?.singleSelect) {
    await page.getByRole('button', { name: 'Apply' }).click();
  }
  await expect(page.getByRole('dialog', { name: dialogName })).toHaveCount(0);
}

async function fillRequiredTeamSelections(page: Page) {
  await addTeamMember(page, 'Add Manager', 'Add Manager', 'Gowriwakkam', { singleSelect: true });
  await addTeamMember(page, 'Add Executive(s)', 'Add Executives', 'Janani Sridhar - 110850');
  await addTeamMember(page, 'Add Counsellor(s)', 'Add Counsellors', 'Janani Sridhar - 110850');
  await addTeamMember(page, 'Add Consultant(s)', 'Add Consultants', 'Janani Sridhar - 110850');
}

const REQUIRED_NODES = [
  '156:46325',
  '156:46328',
  '156:46329',
  '156:46330',
  '156:46334',
  '156:46335',
  '156:46337',
  '156:46338',
  '156:46339',
  '156:46341',
  '156:46343',
  '156:46344',
  '156:46346',
  '156:46347',
  '156:46348',
  '156:46349',
  '156:46350',
  '156:46352',
  '156:46353',
  '156:46354',
  '156:46355',
  '156:46356',
  '156:46357',
  '156:46358',
  '156:46359',
  '156:46361',
  '156:46362',
  '156:46363',
  '156:46364',
  '156:46365',
  '156:46366',
  '156:46367',
  '156:46368',
  '156:46370',
  '156:46371',
  '156:46372',
  '156:46373',
  '156:46374',
  '156:46375',
  '156:46376',
  '156:46377',
  '156:46379',
  '156:46381',
];

test.describe('Figma parity — Create Camp Team screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camps/create/team');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('step title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '156:46337');
    await expectComputedStyles(title, {
      'font-size': '20px',
      'font-weight': '600',
    });
  });

  test('team sections render with selections and empty state', async ({ page }) => {
    await expect(page.locator('[data-figma-node-id="156:46346"]')).toHaveText('Camp Manager');
    await expect(page.locator('[data-figma-node-id="156:46347"]')).toHaveText('One manager per camp');
    await expect(page.locator('[data-figma-node-id="156:46350"]')).toHaveText('Gowriwakkam');
    await expect(page.getByRole('button', { name: 'Add Manager' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Add Executive(s)' })).toBeEnabled();
    await expect(page.locator('[data-figma-node-id="156:46357"]')).toHaveText('Janani Sridhar - 110850');
    await expect(page.getByRole('button', { name: 'Add Counsellor(s)' })).toBeEnabled();
    await expect(page.locator('[data-figma-node-id="156:46376"]')).toHaveText('No Consultants Selected');
  });

  test('add manager enables after removing the current manager', async ({ page }) => {
    await page.getByRole('button', { name: 'Remove Gowriwakkam' }).click();
    await expect(page.getByRole('button', { name: 'Add Manager' })).toBeEnabled();
    await expect(page.getByText('No Manager Selected')).toBeVisible();
  });

  test('add buttons open the shared drawer with contextual titles', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Executive(s)' }).click();
    await expect(page.getByRole('dialog', { name: 'Add Executives' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();

    await page.getByRole('button', { name: 'Add Counsellor(s)' }).click();
    await expect(page.getByRole('dialog', { name: 'Add Counsellors' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();

    await page.getByRole('button', { name: 'Add Consultant(s)' }).click();
    await expect(page.getByRole('dialog', { name: 'Add Consultants' })).toBeVisible();
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Choose Team' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Previous' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create Camp' })).toBeVisible();
  });

  test('previous navigates to choose branches step', async ({ page }) => {
    await page.getByRole('link', { name: 'Previous' }).click();
    await expect(page).toHaveURL('/camps/create/branches');
    await expect(page.getByRole('heading', { level: 1, name: 'Choose Branches' })).toBeVisible();
  });

  test('back navigates to camps list after confirming discard', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();
    await confirmDiscardDraft(page);
    await expect(page).toHaveURL('/camps');
  });

  test('create camp navigates to new camp details', async ({ page }) => {
    await fillRequiredTeamSelections(page);
    await page.getByRole('button', { name: 'Create Camp' }).click();
    await expect(page).toHaveURL('/camps/6');
    await expect(page.locator('[data-figma-node-id="156:47943"]')).toHaveText('No Patients Created yet');
  });
});
