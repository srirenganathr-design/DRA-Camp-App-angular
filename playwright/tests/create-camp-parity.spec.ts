import { test, expect, type Page } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';
import { expectScrollStable } from '../utils/scroll-stability';
import { confirmDiscardDraft } from '../utils/wizard-discard';

async function dismissSimulatedKeyboard(page: Page) {
  await page.getByRole('heading', { level: 1, name: 'Basic Information' }).click();
  await expect(page.locator('body')).not.toHaveAttribute('data-simulated-keyboard', 'open');
}

async function selectCampDate(page: Page, iso: string) {
  await dismissSimulatedKeyboard(page);
  const [year, month, day] = iso.split('-').map(Number);
  await page.locator('#camp-date-trigger').click();
  await expect(page.getByRole('dialog', { name: 'Select Date' })).toBeVisible();
  const dataDay = new Date(year, month - 1, day).toLocaleDateString('en-US');
  await page.locator(`button[data-day="${dataDay}"]`).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.locator('#camp-date-trigger')).toContainText(
    `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
  );
}

async function forceTimePickerBottomSheet(page: Page) {
  await page.addInitScript(() => {
    const originalMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query: string) => {
      if (query.includes('pointer') || query.includes('hover')) {
        return {
          matches: false,
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        } as MediaQueryList;
      }
      return originalMatchMedia(query);
    };
    delete (HTMLInputElement.prototype as { showPicker?: () => void }).showPicker;
  });
}

async function selectCampTimes(page: Page) {
  await page.locator('#start-time-trigger').click();
  await expect(page.getByRole('dialog', { name: 'Select Start Time' })).toBeVisible();
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.locator('#end-time-trigger').click();
  await expect(page.getByRole('dialog', { name: 'Select End Time' })).toBeVisible();
  await page.getByRole('button', { name: 'Apply' }).click();
}

async function fillRequiredBasicFields(page: Page) {
  await page.locator('#camp-name').fill('Next Step Test Camp');
  await page.locator('#camp-type').selectOption('DRT');
  await selectCampDate(page, '2026-09-09');
  await selectCampTimes(page);
  await dismissSimulatedKeyboard(page);
}


const REQUIRED_NODES = [
  '156:46180',
  '156:46183',
  '156:46184',
  '156:46185',
  '156:46189',
  '156:46190',
  '156:46192',
  '156:46193',
  '156:46194',
  '156:46197',
  '156:46198',
  '156:46199',
  '156:46200',
  '156:46201',
  '156:46202',
  '156:46203',
  '156:46204',
  '156:46206',
  '156:46207',
  '156:46208',
  '156:46209',
  '156:46211',
  '156:46212',
  '156:46213',
  '156:46215',
  '156:46216',
  '156:46217',
  '156:46219',
  '156:46221',
];

test.describe('Figma parity — Create Camp screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camps/create');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('header title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '156:46185');
    await expectComputedStyles(title, {
      'font-size': '14px',
      'font-weight': '500',
    });
  });

  test('step title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '156:46192');
    await expectComputedStyles(title, {
      'font-size': '20px',
      'font-weight': '600',
    });
  });

  test('scroll stabilizes after focusing camp name input', async ({ page }) => {
    await page.locator('#camp-name').click();
    await expect(page.locator('body')).toHaveAttribute('data-simulated-keyboard', 'open');
    await expectScrollStable(page, '[data-wizard-scroll-body]');
  });

  test('form fields render with correct default content', async ({ page }) => {
    await expect(page.getByText('Choose camp type')).toBeVisible();
    await expect(page.locator('[data-figma-node-id="156:46203"]')).toHaveValue('Karthick Kumar');
    await expect(page.getByText('DD/MM/YYYY')).toBeVisible();
    await expect(page.locator('#start-time-trigger')).toContainText('hh:mm AM');
    await expect(page.locator('#end-time-trigger')).toContainText('hh:mm AM');
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Basic Information' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  test('back button navigates to camps list after confirming discard', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();
    await confirmDiscardDraft(page);
    await expect(page).toHaveURL('/camps');
  });

  test('back button returns to origin after navigating through wizard steps', async ({ page }) => {
    await page.goto('/camps');
    await page.getByRole('link', { name: 'Create Camp' }).click();
    await expect(page).toHaveURL('/camps/create');
    await forceTimePickerBottomSheet(page);
    await page.reload();
    await page.locator('#camp-name').fill('Origin Back Test Camp');
    await page.locator('#camp-type').selectOption('DRT');
    await selectCampDate(page, '2026-09-09');
    await selectCampTimes(page);
    await dismissSimulatedKeyboard(page);
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page).toHaveURL('/camps/create/location');
    await page.getByRole('link', { name: 'Previous' }).click();
    await page.getByRole('button', { name: 'Go back' }).click();
    await confirmDiscardDraft(page);
    await expect(page).toHaveURL('/camps');
  });

  test('next navigates to location details step', async ({ page }) => {
    await forceTimePickerBottomSheet(page);
    await page.reload();
    await fillRequiredBasicFields(page);
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page).toHaveURL('/camps/create/location');
    await expect(page.getByRole('heading', { level: 1, name: 'Location Details' })).toBeVisible();
  });

  test('time picker fallback sheet applies default start time', async ({ page }) => {
    await forceTimePickerBottomSheet(page);
    await page.goto('/camps/create');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
    await dismissSimulatedKeyboard(page);
    await page.locator('#start-time-trigger').click();
    await expect(page.getByRole('dialog', { name: 'Select Start Time' })).toBeVisible();
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.locator('#start-time-trigger')).toContainText('09:00 AM');
  });

  test('shows inline validation errors without toast when Next is clicked with empty required fields', async ({
    page,
  }) => {
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto('/camps/create');
    await page.locator('#camp-name').fill('');
    await dismissSimulatedKeyboard(page);
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Camp name is required' })).toBeVisible();
    await expect(page.getByRole('alert').filter({ hasText: 'Date is required' })).toBeVisible();
    await expect(page.locator('[data-sonner-toast]')).toHaveCount(0);
    await expect(page).toHaveURL('/camps/create');
  });
});
