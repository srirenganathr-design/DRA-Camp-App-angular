import { test, expect } from '@playwright/test';
import { expectFigmaNode, getBox } from '../utils/figma-parity';

async function scrollWizardBodyBy(page: import('@playwright/test').Page, scrollTop: number) {
  const scrollBody = page.locator('[data-wizard-scroll-body]');
  await scrollBody.evaluate((element, top) => {
    element.scrollTop = top;
    element.dispatchEvent(new Event('scroll'));
  }, scrollTop);
}

function isFooterVisible(transform: string) {
  return transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)';
}

test.describe('Detail screen scroll chrome', () => {
  test.describe('Patient Details', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/patients/23');
      await page.setViewportSize({ width: 360, height: 800 });
    });

    test('scroll body overflows and header collapses on scroll', async ({ page }) => {
      const scrollBody = page.locator('[data-wizard-scroll-body]');
      const scrollMetrics = await scrollBody.evaluate((element) => ({
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
      }));
      expect(scrollMetrics.scrollHeight).toBeGreaterThan(scrollMetrics.clientHeight);

      const header = page.locator('[data-figma-node-id="16:3823"]');
      const headerSlot = header.locator('xpath=..');
      await expect(headerSlot).toHaveCSS('max-height', '80px');

      await scrollWizardBodyBy(page, 120);
      await page.waitForTimeout(300);

      await expect(headerSlot).toHaveCSS('max-height', '0px');
    });

    test('header collapses and compact sticky patient title appears on scroll', async ({ page }) => {
      const header = page.locator('[data-figma-node-id="16:3823"]');
      const headerSlot = header.locator('xpath=..');
      const compactSticky = page.locator('[data-wizard-compact-sticky]');
      const pinnedHero = page.locator('[data-figma-node-id="16:3829"]').locator('xpath=..');

      await expect(compactSticky).toHaveCount(0);

      await scrollWizardBodyBy(page, 200);
      await page.waitForTimeout(300);

      await expect(headerSlot).toHaveCSS('max-height', '0px');
      await expect(compactSticky).toHaveCount(1);
      await expect(pinnedHero).not.toHaveClass(/stepSectionSticky/);
      await expectFigmaNode(page, '18:20752');
      await expectFigmaNode(page, '18:20757');
      await expectFigmaNode(page, '18:20759');
    });

    test('hero scrolls away when compact sticky is visible', async ({ page }) => {
      const scrollBody = page.locator('[data-wizard-scroll-body]');
      const patientName = await expectFigmaNode(page, '16:3838');

      await scrollWizardBodyBy(page, 700);
      await page.waitForTimeout(300);

      const scrollBodyBox = await getBox(scrollBody);
      const patientNameBox = await getBox(patientName);
      expect(patientNameBox.y).toBeLessThan(scrollBodyBox.y);
    });

    test('footer hides on scroll down and returns at top', async ({ page }) => {
      const footer = page.locator('[data-figma-node-id="16:4073"]');
      const footerInner = footer.locator('xpath=..');

      const initialTransform = await footerInner.evaluate((element) => getComputedStyle(element).transform);
      expect(isFooterVisible(initialTransform)).toBe(true);

      await scrollWizardBodyBy(page, 200);
      await page.waitForTimeout(300);

      const hiddenTransform = await footerInner.evaluate((element) => getComputedStyle(element).transform);
      expect(isFooterVisible(hiddenTransform)).toBe(false);

      await scrollWizardBodyBy(page, 0);
      await page.waitForTimeout(300);

      const visibleTransform = await footerInner.evaluate((element) => getComputedStyle(element).transform);
      expect(isFooterVisible(visibleTransform)).toBe(true);
    });
  });

  test.describe('Patient Details w/ Appointment', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/patients/23/appointment');
      await page.setViewportSize({ width: 360, height: 800 });
    });

    test('header collapses and compact sticky patient title appears on scroll', async ({ page }) => {
      const header = page.locator('[data-figma-node-id="16:4094"]');
      const headerSlot = header.locator('xpath=..');
      const compactSticky = page.locator('[data-wizard-compact-sticky]');

      await expect(compactSticky).toHaveCount(0);

      await scrollWizardBodyBy(page, 200);
      await page.waitForTimeout(300);

      await expect(headerSlot).toHaveCSS('max-height', '0px');
      await expect(compactSticky).toHaveCount(1);
      await expectFigmaNode(page, '18:20752');
      await expectFigmaNode(page, '18:20757');
      await expectFigmaNode(page, '18:20759');
    });

    test('hero scrolls away when compact sticky is visible', async ({ page }) => {
      const scrollBody = page.locator('[data-wizard-scroll-body]');
      const patientName = await expectFigmaNode(page, '16:4109');

      await scrollWizardBodyBy(page, 700);
      await page.waitForTimeout(300);

      const scrollBodyBox = await getBox(scrollBody);
      const patientNameBox = await getBox(patientName);
      expect(patientNameBox.y).toBeLessThan(scrollBodyBox.y);
    });
  });

  test.describe('Camp Details', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/camps/1');
      await page.setViewportSize({ width: 360, height: 800 });
    });

    test('header collapses and compact sticky camp title appears on scroll', async ({ page }) => {
      const header = page.locator('[data-figma-node-id="16:4944"]');
      const headerSlot = header.locator('xpath=..');
      const compactSticky = page.locator('[data-wizard-compact-sticky]');

      await expect(compactSticky).toHaveCount(0);

      await scrollWizardBodyBy(page, 200);
      await page.waitForTimeout(300);

      await expect(headerSlot).toHaveCSS('max-height', '0px');
      await expect(compactSticky).toHaveCount(1);
      await expectFigmaNode(page, '18:21711');
      await expectFigmaNode(page, '18:21716');
      await expectFigmaNode(page, '18:21718');
    });

    test('hero scrolls away when compact sticky is visible', async ({ page }) => {
      const scrollBody = page.locator('[data-wizard-scroll-body]');
      const campName = await expectFigmaNode(page, '16:4958');

      await scrollWizardBodyBy(page, 700);
      await page.waitForTimeout(300);

      const scrollBodyBox = await getBox(scrollBody);
      const campNameBox = await getBox(campName);
      expect(campNameBox.y).toBeLessThan(scrollBodyBox.y);
    });

    test('does not render a docked footer on with-patients variant', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Start Camp' })).not.toBeVisible();
      await expect(page.locator('[data-figma-node-id="16:4073"]')).toHaveCount(0);
    });
  });
});
