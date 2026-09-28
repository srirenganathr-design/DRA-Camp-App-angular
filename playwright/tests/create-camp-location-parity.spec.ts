import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles, getBox } from '../utils/figma-parity';
import { confirmDiscardDraft } from '../utils/wizard-discard';

const REQUIRED_NODES = [
  '156:46238',
  '156:46241',
  '156:46242',
  '156:46243',
  '156:46247',
  '156:46248',
  '156:46250',
  '156:46251',
  '156:46252',
  '156:46255',
  '156:46256',
  '156:46258',
  '156:46259',
  '156:46261',
  '156:46263',
];

test.describe('Figma parity — Create Camp Location screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camps/create/location');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('step title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '156:46250');
    await expectComputedStyles(title, {
      'font-size': '20px',
      'font-weight': '600',
    });
  });

  test('step progress bar matches Figma frame geometry', async ({ page }) => {
    const track = await expectFigmaNode(page, '156:46251');
    const fill = await expectFigmaNode(page, '156:46252');

    await expect(fill).toBeVisible();

    const trackBox = await getBox(track);
    const fillBox = await getBox(fill);

    expect(Math.abs(trackBox.height - 3.692)).toBeLessThanOrEqual(1);
    expect(Math.abs(trackBox.width - 323.077)).toBeLessThanOrEqual(2);
    expect(Math.abs(fillBox.width - trackBox.width * (107.683 / 323.077))).toBeLessThanOrEqual(2);
  });

  test('address field renders with placeholder', async ({ page }) => {
    await expect(page.locator('[data-figma-node-id="156:46256"]')).toHaveText('Address');
    await expect(page.locator('#camp-address')).toHaveAttribute(
      'placeholder',
      '24 & 26, Swathi, 29th St, Nanganallur, Chennai, TN 600061',
    );
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Location Details' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Previous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  });

  test('previous navigates to basic information step', async ({ page }) => {
    await page.getByRole('link', { name: 'Previous' }).click();
    await expect(page).toHaveURL('/camps/create');
    await expect(page.getByRole('heading', { level: 1, name: 'Basic Information' })).toBeVisible();
  });

  test('back navigates to camps list after confirming discard', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();
    await confirmDiscardDraft(page);
    await expect(page).toHaveURL('/camps');
  });

  test('back keeps user on location step when discard is cancelled', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();
    await expect(page.getByRole('dialog', { name: 'Discard unsaved changes?' })).toBeVisible();
    await page.getByRole('button', { name: 'Keep editing' }).click();
    await expect(page).toHaveURL('/camps/create/location');
  });

  test('next navigates to choose branches step', async ({ page }) => {
    await page.locator('#camp-address').fill('29th St, Nanganallur, Chennai, TN 600061');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page).toHaveURL('/camps/create/branches');
    await expect(page.getByRole('heading', { level: 1, name: 'Choose Branches' })).toBeVisible();
  });

  test('address autocomplete suggests and fills address on selection', async ({ page }) => {
    await page.locator('#camp-address').fill('Nanganallur');
    await expect(page.getByRole('listbox', { name: 'Address suggestions' })).toBeVisible();
    await page.getByRole('option').first().click();
    await expect(page.locator('#camp-address')).toHaveValue(/Nanganallur, Chennai/);
  });
});
