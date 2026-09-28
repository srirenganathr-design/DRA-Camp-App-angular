import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles, expectBox } from '../utils/figma-parity';

test.describe('Figma spacing — Schedule Appointment date row (126:22027)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/patients/23/schedule-appointment');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('date row dimensions match Figma specification', async ({ page }) => {
    const row = await expectFigmaNode(page, '126:22027');
    await expectBox(row, { width: 328, height: 68 }, 1);
    await expectComputedStyles(row, { gap: '8px' });
  });

  test('date chips match Figma specification', async ({ page }) => {
    for (const nodeId of ['126:22028', '126:22031', '126:22034', '126:22037', '126:22040']) {
      const chip = await expectFigmaNode(page, nodeId);
      await expectBox(chip, { height: 68 }, 1);
      await expectComputedStyles(chip, {
        padding: '12px',
        gap: '8px',
        'border-radius': '12px',
      });
    }
  });

  test('calendar chip matches Figma specification', async ({ page }) => {
    const chip = await expectFigmaNode(page, '126:22043');
    await expectBox(chip, { width: 64, height: 68 }, 1);
    await expectComputedStyles(chip, {
      padding: '12px 8px',
      gap: '8px',
      'border-radius': '12px',
    });
  });

  test('date chips have 8px gap between them', async ({ page }) => {
    const first = await expectFigmaNode(page, '126:22028');
    const second = await expectFigmaNode(page, '126:22031');
    const calendar = await expectFigmaNode(page, '126:22043');

    const firstBox = await first.boundingBox();
    const secondBox = await second.boundingBox();
    const calendarBox = await calendar.boundingBox();

    expect(firstBox).not.toBeNull();
    expect(secondBox).not.toBeNull();
    expect(calendarBox).not.toBeNull();

    const gap = secondBox!.x - (firstBox!.x + firstBox!.width);
    const calendarGap = calendarBox!.x - (firstBox!.x + firstBox!.width * 5 + gap * 4);
    expect(gap).toBeCloseTo(8, 0);
    expect(calendarGap).toBeCloseTo(8, 0);
  });

  test('date number typography matches Figma specification', async ({ page }) => {
    const day = await expectFigmaNode(page, '126:22029');
    await expectComputedStyles(day, {
      'font-size': '16px',
      'font-weight': '400',
      'line-height': '22px',
    });
  });
});
