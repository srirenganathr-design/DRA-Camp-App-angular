import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles, expectBox, getBox } from '../utils/figma-parity';
import { gotoPatientWizardStep4 } from '../utils/patient-wizard';

test.describe('Figma spacing — Create Patient Dry Refraction screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoPatientWizardStep4(page);
  });

  test('header uses compact vertical padding', async ({ page }) => {
    const header = await expectFigmaNode(page, '126:21489');
    await expectComputedStyles(header, { padding: '4px 16px' });
  });

  test('step section padding and gap match Figma', async ({ page }) => {
    const stepSection = await expectFigmaNode(page, '126:21494');
    await expectComputedStyles(stepSection, {
      padding: '24px 16px',
      gap: '16px',
    });
  });

  test('step badge uses white background', async ({ page }) => {
    const badge = await expectFigmaNode(page, '126:21496');
    await expectComputedStyles(badge, {
      padding: '4px 8px',
      'background-color': 'rgb(255, 255, 255)',
    });
  });

  test('content area uses horizontal padding only', async ({ page }) => {
    const content = await expectFigmaNode(page, '126:21502');
    await expectComputedStyles(content, { padding: '0px 16px' });
  });

  test('right eye section has bottom spacing before left eye', async ({ page }) => {
    const rightSection = await expectFigmaNode(page, '126:21503');
    const leftSection = await expectFigmaNode(page, '126:21587');
    await expectComputedStyles(rightSection, { 'padding-bottom': '16px' });
    const rightBox = await getBox(rightSection);
    const leftBox = await getBox(leftSection);
    const gap = leftBox.y - (rightBox.y + rightBox.height);
    expect(gap).toBeCloseTo(0, 0);
  });

  test('eye section blocks use 8px vertical gap', async ({ page }) => {
    for (const nodeId of ['126:21504', '126:21588']) {
      const block = await expectFigmaNode(page, nodeId);
      await expectComputedStyles(block, {
        gap: '8px',
        'flex-direction': 'column',
      });
    }
  });

  test('reading cards list uses 8px gap', async ({ page }) => {
    const list = await expectFigmaNode(page, '126:21510');
    await expectComputedStyles(list, { gap: '8px' });
  });

  test('reading card internal spacing matches Figma', async ({ page }) => {
    const card = await expectFigmaNode(page, '126:21511');
    await expectComputedStyles(card, {
      padding: '12px',
      gap: '16px',
    });
    const row = page.locator('[data-figma-node-id="126:21511"] [data-figma-node-id="126:21515"]');
    await expect(row).toHaveCount(1);
    await expectComputedStyles(row, { gap: '8px' });
  });

  test('narrow field columns match Figma width', async ({ page }) => {
    const sphCol = page.locator('[data-figma-node-id="126:21515"] > div').first();
    await expectBox(sphCol, { width: 68.846 }, 1);
  });

  test('vision field column matches Figma width', async ({ page }) => {
    const visionCol = page.locator('[data-figma-node-id="126:21515"] > div').last();
    await expectBox(visionCol, { width: 59.846 }, 1);
  });

  test('field value boxes match Figma min height', async ({ page }) => {
    const value = await expectFigmaNode(page, '126:21520');
    await expectBox(value, { height: 19 }, 2);
  });

  test('add comment button dimensions match Figma', async ({ page }) => {
    const btn = await expectFigmaNode(page, '126:21586');
    await expectBox(btn, { width: 328, height: 42 }, 1);
  });

  test('footer padding and button gap match Figma', async ({ page }) => {
    const footer = await expectFigmaNode(page, '126:21671');
    const footerRow = await expectFigmaNode(page, '126:21672');
    await expectComputedStyles(footer, { padding: '16px' });
    await expectComputedStyles(footerRow, { gap: '16px' });
  });
});

test.describe('Figma parity — Add card row (126:21540)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoPatientWizardStep4(page);
    await page.locator('[data-figma-node-id="126:21540"]').scrollIntoViewIfNeeded();
  });

  test('row geometry and layout match Figma', async ({ page }) => {
    const row = await expectFigmaNode(page, '126:21540');
    await expectComputedStyles(row, { gap: '8px' });
    await expectBox(row, { width: 304, height: 62 }, 1);

    const rowBox = await getBox(row);
    expect(rowBox.x).toBeGreaterThanOrEqual(16);
    expect(rowBox.x + rowBox.width).toBeLessThanOrEqual(360);
  });

  test('Sph field is active with white bordered container', async ({ page }) => {
    const container = await expectFigmaNode(page, '126:21544');
    await expectComputedStyles(container, {
      'background-color': 'rgb(255, 255, 255)',
      padding: '8px',
      'border-top-width': '1px',
    });
    await expect(page.locator('[data-figma-node-id="126:21545"]')).toHaveText('+0.00');
  });

  test('Cyl, Axis, and Vision fields use muted grey containers', async ({ page }) => {
    for (const nodeId of ['126:21549', '126:21554', '126:21559']) {
      const container = await expectFigmaNode(page, nodeId);
      await expectComputedStyles(container, {
        'background-color': 'rgb(250, 250, 250)',
        padding: '8px',
      });
    }
  });

  test('Add row field values are fully visible without truncation', async ({ page }) => {
    const truncated = await page.evaluate(() => {
      const row = document.querySelector('[data-figma-node-id="126:21540"]');
      if (!row) return true;

      return Array.from(row.querySelectorAll('[data-figma-node-id]')).some((el) => {
        if (el.childElementCount > 0) return false;
        const text = el.textContent?.trim() ?? '';
        if (!/^[-\d./]+$/.test(text)) return false;
        return el.scrollWidth > el.clientWidth + 0.5;
      });
    });

    expect(truncated).toBe(false);
  });
});

test.describe('Create Patient Dry Refraction — field text visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoPatientWizardStep4(page);
  });

  test('all field values render without horizontal truncation', async ({ page }) => {
    const hasTruncatedValues = await page.evaluate(() => {
      const screen = document.querySelector('[data-figma-node-id="126:21487"]');
      if (!screen) return true;

      const cards = screen.querySelectorAll('[data-name="TextField"]');
      for (const card of cards) {
        for (const el of card.querySelectorAll('[data-figma-node-id]')) {
          if (el.childElementCount > 0) continue;
          const text = el.textContent?.trim() ?? '';
          if (!/^[-\d./]+$/.test(text)) continue;
          if (el.scrollWidth > el.clientWidth + 0.5) return true;
        }
      }
      return false;
    });

    expect(hasTruncatedValues).toBe(false);
  });

  test('field value text renders empty draft defaults', async ({ page }) => {
    const expectations: Array<[string, string]> = [
      ['126:21520', '-0.00'],
      ['126:21525', '-0.00'],
      ['126:21530', '180'],
      ['126:21535', '20/20'],
      ['126:21545', '+0.00'],
      ['126:21604', '-0.00'],
      ['126:21619', '20/20'],
    ];

    for (const [nodeId, text] of expectations) {
      await expect(page.locator(`[data-figma-node-id="${nodeId}"]`)).toHaveText(text);
      await expect(page.locator(`[data-figma-node-id="${nodeId}"]`)).toBeVisible();
    }
  });
});
