import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles } from '../utils/figma-parity';

const REQUIRED_NODES = [
  '126:22007',
  '126:22075',
  '126:22008',
  '126:22009',
  '126:22010',
  '126:22011',
  '126:22012',
  '126:22014',
  '126:22015',
  '126:22016',
  '126:22017',
  '126:22018',
  '126:22019',
  '126:22020',
  '126:22021',
  '126:22022',
  '126:22023',
  '126:22024',
  '126:22025',
  '126:22026',
  '126:22027',
  '126:22028',
  '126:22029',
  '126:22030',
  '126:22031',
  '126:22032',
  '126:22033',
  '126:22034',
  '126:22035',
  '126:22036',
  '126:22037',
  '126:22038',
  '126:22039',
  '126:22040',
  '126:22041',
  '126:22042',
  '126:22043',
  '126:22044',
  '126:22045',
  '126:22046',
  '126:22047',
  '126:22048',
  '126:22049',
  '126:22050',
  '126:22051',
  '126:22052',
  '126:22053',
  '126:22054',
  '126:22055',
  '126:22056',
  '126:22057',
  '126:22058',
  '126:22059',
  '126:22060',
  '126:22061',
  '126:22062',
  '126:22063',
  '126:22064',
  '126:22065',
  '126:22066',
  '126:22067',
  '126:22068',
  '126:22069',
  '126:22070',
  '126:22071',
  '126:22072',
  '126:22073',
  '126:22074',
];

test.describe('Figma parity — Schedule Appointment screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/patients/23/schedule-appointment');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('header title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '126:22012');
    await expectComputedStyles(title, {
      'font-size': '14px',
      'font-weight': '500',
    });
  });

  test('step title typography matches Figma specification', async ({ page }) => {
    const title = await expectFigmaNode(page, '126:22016');
    await expectComputedStyles(title, {
      'font-size': '20px',
      'font-weight': '600',
    });
  });

  test('branch picker styling matches Figma specification', async ({ page }) => {
    const picker = await expectFigmaNode(page, '126:22022');
    await expectComputedStyles(picker, {
      'background-color': 'rgb(244, 248, 255)',
      'border-radius': '16px',
    });
    await expect(page.getByText('Click to choose the Branch')).toBeVisible();
  });

  test('second row morning time slots are clickable', async ({ page }) => {
    const slot1100 = page.locator('[data-figma-node-id="126:22065"]');
    const slot1130 = page.locator('[data-figma-node-id="126:22067"]');

    await slot1100.click();
    await expect(slot1100).toHaveClass(/timeSlotSelected/);

    await slot1130.click();
    await expect(slot1130).toHaveClass(/timeSlotSelected/);
  });

  test('date chips and time slots render correctly', async ({ page }) => {
    await expect(page.locator('[data-figma-node-id="126:22029"]')).toHaveText('7');
    await expect(page.locator('[data-figma-node-id="126:22030"]')).toHaveText('Today');
    await expect(page.locator('[data-figma-node-id="126:22057"]')).toHaveText('9:00 AM');
    await expect(page.locator('[data-figma-node-id="126:22068"]')).toHaveText('11:30 AM');
    await expect(page.getByText('Morning')).toBeVisible();
    await expect(page.getByText('Afternoon')).toBeVisible();
  });

  test('footer actions render with correct labels', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Schedule' })).toBeVisible();
  });

  test('accessible structure remains valid', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Schedule Appointment' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go back' })).toBeVisible();
  });

  test('back navigates to patient details', async ({ page }) => {
    await page.getByRole('link', { name: 'Go back' }).click();
    await expect(page).toHaveURL('/patients/23');
  });

  test('schedule navigates to patient details with appointment', async ({ page }) => {
    await page.locator('[data-figma-node-id="126:22022"]').click();
    await page.getByPlaceholder('Nanganallur').fill('Nanganallur');
    await page.getByRole('button', { name: /Nanganallur, Chennai/ }).click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.locator('[data-figma-node-id="126:22034"]').click();
    await page.getByRole('button', { name: 'Afternoon' }).click();
    await page.getByRole('button', { name: '12:30 PM' }).click();
    await page.getByRole('button', { name: 'Schedule' }).click();
    await expect(page).toHaveURL('/patients/23/appointment');
    await expect(page.getByRole('heading', { level: 2, name: 'Appointment Schedule' })).toBeVisible();
    await expect(page.getByText('12:30PM, 09-Sep-2026')).toBeVisible();
  });

  test('shows inline validation errors without toast when Schedule is clicked with empty form', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Schedule' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Branch is required' })).toBeVisible();
    await expect(page.getByRole('alert').filter({ hasText: 'Date is required' })).toBeVisible();
    await expect(page.getByRole('alert').filter({ hasText: 'Time slot is required' })).toBeVisible();
    await expect(page.locator('[data-sonner-toast]')).toHaveCount(0);
    await expect(page).toHaveURL('/patients/23/schedule-appointment');
  });

  test('prefilled schedule opens from appointment edit', async ({ page }) => {
    await page.goto('/patients/23/appointment');
    await page.locator('[data-figma-node-id="126:24198"]').click();
    await expect(page).toHaveURL('/patients/23/schedule-appointment');
    await expect(page.locator('[data-figma-node-id="126:22022"]')).toContainText('Nanganallur, Chennai');
    await expect(page.locator('[data-figma-node-id="126:22083"]')).toHaveText('12:30 PM');
  });
});
