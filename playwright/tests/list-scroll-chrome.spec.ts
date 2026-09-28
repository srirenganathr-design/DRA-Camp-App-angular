import { test, expect } from '@playwright/test';
import { expectFigmaNode, getBox } from '../utils/figma-parity';

function isNavVisible(transform: string) {
  return transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)';
}

async function getNavTransform(page: import('@playwright/test').Page, rootNodeId: string) {
  const nav = await expectFigmaNode(page, rootNodeId);
  return nav.evaluate((element) => getComputedStyle(element).transform);
}

async function scrollContentBy(page: import('@playwright/test').Page, scrollTop: number) {
  const scrollContent = page.getByTestId('scroll-content');
  await scrollContent.evaluate((element, top) => {
    element.scrollTop = top;
    element.dispatchEvent(new Event('scroll'));
  }, scrollTop);
}

test.describe('List screen scroll chrome', () => {
  test.describe('Camps', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/camps');
      await page.setViewportSize({ width: 360, height: 800 });
    });

    test('unified scroll container overflows and bottom nav hides on scroll up', async ({ page }) => {
      const scrollContent = page.getByTestId('scroll-content');
      const scrollMetrics = await scrollContent.evaluate((element) => ({
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
      }));
      expect(scrollMetrics.scrollHeight).toBeGreaterThan(scrollMetrics.clientHeight);

      const initialTransform = await getNavTransform(page, '16:3042');
      expect(isNavVisible(initialTransform)).toBe(true);

      await scrollContentBy(page, 200);
      await page.waitForTimeout(300);

      const hiddenTransform = await getNavTransform(page, '16:3042');
      expect(isNavVisible(hiddenTransform)).toBe(false);
    });

    test('bottom nav reappears when scrolling down', async ({ page }) => {
      const scrollContent = page.getByTestId('scroll-content');

      await scrollContentBy(page, 250);
      await page.waitForTimeout(300);

      await scrollContentBy(page, 100);
      await page.waitForTimeout(300);

      const visibleTransform = await getNavTransform(page, '16:3042');
      expect(isNavVisible(visibleTransform)).toBe(true);
    });

    test('list controls stick to top after hero scrolls away', async ({ page }) => {
      const screen = await expectFigmaNode(page, '16:2857');
      const listControls = await expectFigmaNode(page, '16:2915');
      const scrollContent = page.getByTestId('scroll-content');

      await scrollContentBy(page, 400);
      await page.waitForTimeout(100);

      const screenBox = await getBox(screen);
      const controlsBox = await getBox(listControls);
      expect(Math.abs(controlsBox.y - screenBox.y)).toBeLessThanOrEqual(2);

      const heading = page.locator('#all-camps-heading');
      const headingBox = await getBox(heading);
      const headingOffset = headingBox.y - screenBox.y;
      expect(headingOffset).toBeGreaterThanOrEqual(14);
      expect(headingOffset).toBeLessThanOrEqual(56);
    });

    test('top chrome returns when scrolled back to top', async ({ page }) => {
      const statusBar = await expectFigmaNode(page, '16:2861');
      const scrollContent = page.getByTestId('scroll-content');

      await scrollContentBy(page, 400);
      await page.waitForTimeout(100);

      const hiddenBox = await getBox(statusBar);
      expect(hiddenBox.y).toBeLessThan(0);

      await scrollContentBy(page, 0);
      await page.waitForTimeout(100);

      const screen = await expectFigmaNode(page, '16:2857');
      const visibleBox = await getBox(statusBar);
      const screenBox = await getBox(screen);
      expect(Math.abs(visibleBox.y - screenBox.y)).toBeLessThanOrEqual(2);
    });
  });

  test.describe('Patients', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/patients');
      await page.setViewportSize({ width: 360, height: 800 });
    });

    test('bottom nav hides and list controls stick on scroll', async ({ page }) => {
      const scrollContent = page.getByTestId('scroll-content');
      const screen = await expectFigmaNode(page, '16:3054');
      const listControls = await expectFigmaNode(page, '16:3112');

      await scrollContentBy(page, 400);
      await page.waitForTimeout(300);

      const hiddenTransform = await getNavTransform(page, '16:3271');
      expect(isNavVisible(hiddenTransform)).toBe(false);

      const screenBox = await getBox(screen);
      const controlsBox = await getBox(listControls);
      expect(Math.abs(controlsBox.y - screenBox.y)).toBeLessThanOrEqual(2);

      const heading = page.locator('#all-patients-heading');
      const headingBox = await getBox(heading);
      const headingOffset = headingBox.y - screenBox.y;
      expect(headingOffset).toBeGreaterThanOrEqual(14);
      expect(headingOffset).toBeLessThanOrEqual(56);
    });
  });
});
