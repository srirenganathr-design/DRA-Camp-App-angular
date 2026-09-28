import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles, expectBox } from '../utils/figma-parity';

test.describe('Figma spacing — Create Patient gender row', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/patients/create');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('gender row dimensions match Figma specification', async ({ page }) => {
    const row = await expectFigmaNode(page, '126:21237');
    await expectBox(row, { width: 328, height: 42 });
    await expectComputedStyles(row, { gap: '12px' });
  });

  test('gender option buttons match Figma specification', async ({ page }) => {
    for (const nodeId of ['126:21238', '126:21239', '126:21240']) {
      const option = await expectFigmaNode(page, nodeId);
      await expectBox(option, { width: 101.33, height: 42 }, 1);
      await expectComputedStyles(option, {
        padding: '0px 8px',
        gap: '4px',
        'border-radius': '12px',
        height: '42px',
      });
    }
  });

  test('gender options show visible radio icons', async ({ page }) => {
    for (const nodeId of ['126:21238', '126:21239', '126:21240']) {
      const option = await expectFigmaNode(page, nodeId);
      const icon = option.locator('img').first();
      await expect(icon).toBeVisible();
      await expectBox(icon, { width: 20, height: 20 }, 1);
    }

    for (const nodeId of ['126:21238', '126:21239', '126:21240']) {
      const option = await expectFigmaNode(page, nodeId);
      await expect(option.locator('img').first()).toHaveAttribute('src', /radio-unselected/);
    }
  });

  test('gender options have 12px gap between them', async ({ page }) => {
    const male = await expectFigmaNode(page, '126:21238');
    const female = await expectFigmaNode(page, '126:21239');
    const others = await expectFigmaNode(page, '126:21240');

    const maleBox = await male.boundingBox();
    const femaleBox = await female.boundingBox();
    const othersBox = await others.boundingBox();

    expect(maleBox).not.toBeNull();
    expect(femaleBox).not.toBeNull();
    expect(othersBox).not.toBeNull();

    const gap1 = femaleBox!.x - (maleBox!.x + maleBox!.width);
    const gap2 = othersBox!.x - (femaleBox!.x + femaleBox!.width);
    expect(gap1).toBeCloseTo(12, 0);
    expect(gap2).toBeCloseTo(12, 0);
  });
});
