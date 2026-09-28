import { test, expect } from '@playwright/test';
import {
  expectFigmaNode,
  expectComputedStyles,
  expectBox,
  getBox,
  expectImgSvgFill,
} from '../utils/figma-parity';

test.describe('Figma spacing, padding & radius — Camps screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camps');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('hero ellipse geometry matches Figma specification', async ({ page }) => {
    const screen = await expectFigmaNode(page, '16:2857');
    const ellipse = await expectFigmaNode(page, '16:2858');

    await expectComputedStyles(ellipse, {
      'max-width': 'none',
      width: '1094px',
      height: '324px',
    });

    const screenBox = await getBox(screen);
    const ellipseBox = await getBox(ellipse);

    expect(Math.abs(ellipseBox.width - 1094)).toBeLessThanOrEqual(2);
    expect(Math.abs(ellipseBox.height - 324)).toBeLessThanOrEqual(2);
    expect(Math.abs(ellipseBox.x - screenBox.x - -367)).toBeLessThanOrEqual(2);
    expect(Math.abs(ellipseBox.y - screenBox.y - -12)).toBeLessThanOrEqual(2);
  });

  test('screen and content panel spacing', async ({ page }) => {
    const screen = await expectFigmaNode(page, '16:2857');
    await expectComputedStyles(screen, { 'border-radius': '16px' });

    const contentPanel = await expectFigmaNode(page, '16:2904');
    await expectComputedStyles(contentPanel, {
      padding: '24px 16px 20px',
      gap: '64px',
      'border-bottom-left-radius': '0px',
      'border-bottom-right-radius': '0px',
    });
  });

  test('blue hero backdrop clips ellipse arc', async ({ page }) => {
    const backdrop = page.getByTestId('hero-blue-backdrop');
    await expect(backdrop).toHaveCount(1);
    await expectComputedStyles(backdrop, {
      height: '342px',
      'border-bottom-left-radius': '24px',
      'border-bottom-right-radius': '24px',
      overflow: 'hidden',
    });
  });

  test('All Camps heading sits below ellipse arc bottom', async ({ page }) => {
    const screen = await expectFigmaNode(page, '16:2857');
    const ellipse = await expectFigmaNode(page, '16:2858');
    const sectionTitle = await expectFigmaNode(page, '16:2917');

    const screenBox = await getBox(screen);
    const ellipseBox = await getBox(ellipse);
    const titleBox = await getBox(sectionTitle);

    const ellipseBottom = ellipseBox.y + ellipseBox.height - screenBox.y;
    const titleTop = titleBox.y - screenBox.y;

    expect(ellipseBottom).toBeLessThanOrEqual(312 + 2);
    expect(titleTop).toBeGreaterThanOrEqual(340 - 4);
  });

  test('app header spacing', async ({ page }) => {
    const header = await expectFigmaNode(page, '16:2877');
    await expectComputedStyles(header, {
      padding: '8px 16px 16px',
    });
  });

  test('hero container geometry matches Figma specification', async ({ page }) => {
    const screen = await expectFigmaNode(page, '16:2857');
    const hero = await expectFigmaNode(page, '16:2905');

    await expectBox(hero, { width: 328, height: 152 }, 2);

    const screenBox = await getBox(screen);
    const heroBox = await getBox(hero);
    const heroTop = heroBox.y - screenBox.y;
    expect(heroTop).toBeGreaterThanOrEqual(124);
    expect(heroTop).toBeLessThanOrEqual(130);
  });

  test('hero title row spacing', async ({ page }) => {
    const titleRow = await expectFigmaNode(page, '16:2906');
    await expectComputedStyles(titleRow, {
      gap: '16px',
      height: '40px',
    });
  });

  test('hero tent icon uses inline SVG with Figma cyan color', async ({ page }) => {
    const iconSlot = await expectFigmaNode(page, '16:2907');
    const svg = iconSlot.locator('svg');
    await expect(svg).toHaveCount(1);
    await expect(iconSlot.locator('img')).toHaveCount(0);
    await expectComputedStyles(iconSlot, {
      color: 'rgb(98, 237, 255)',
    });
    await expectComputedStyles(svg.locator('path'), {
      fill: 'rgb(98, 237, 255)',
    });
  });

  test('hero and list icons match Figma layer fills', async ({ page }) => {
    const search = await expectFigmaNode(page, '16:2910');
    await expectImgSvgFill(page, search.locator('img').first(), '#5FA1FF');

    const allTime = await expectFigmaNode(page, '16:2912');
    const allTimeIcons = allTime.locator('img');
    await expect(allTimeIcons).toHaveCount(2);
    await expectImgSvgFill(page, allTimeIcons.nth(0), '#9FC7FF');
    await expectImgSvgFill(page, allTimeIcons.nth(1), '#62EDFF');

    const allTypes = await expectFigmaNode(page, '16:2913');
    const allTypesIcons = allTypes.locator('img');
    await expect(allTypesIcons).toHaveCount(2);
    await expectImgSvgFill(page, allTypesIcons.nth(0), '#9FC7FF');
    await expectImgSvgFill(page, allTypesIcons.nth(1), '#62EDFF');

    const zoneButton = await expectFigmaNode(page, '16:2901');
    await expectImgSvgFill(page, zoneButton.locator('img'), '#62EDFF');

    const createBtn = await expectFigmaNode(page, '16:2918');
    await expectImgSvgFill(page, createBtn.locator('img'), 'white');

    const cancelBtn = await expectFigmaNode(page, '16:3016');
    await expectImgSvgFill(page, cancelBtn.locator('img'), '#B72222');

    const viewBtn = await expectFigmaNode(page, '16:3017');
    await expectImgSvgFill(page, viewBtn.locator('img'), 'white');

    const campsTab = await expectFigmaNode(page, '16:3043');
    const navTent = campsTab.locator('img');
    await expectImgSvgFill(page, navTent, '#005CDF');
    await expect(navTent).toHaveAttribute('width', '24');
    await expect(navTent).toHaveAttribute('height', '24');
  });

  test('search input padding and radius', async ({ page }) => {
    const search = await expectFigmaNode(page, '16:2910');
    const input = search.locator('input');
    await expectComputedStyles(input.locator('..'), {
      padding: '10px 10px 10px 12px',
      gap: '8px',
      'border-radius': '10px',
      'box-shadow': 'none',
    });
  });

  test('hero filter chips spacing and radius', async ({ page }) => {
    const chipRow = await expectFigmaNode(page, '16:2911');
    await expectComputedStyles(chipRow, { gap: '8px' });

    const allTime = await expectFigmaNode(page, '16:2912');
    await expectBox(allTime, { width: 125, height: 36 }, 2);
    await expectComputedStyles(allTime, {
      'border-radius': '10px',
    });

    const allTypes = await expectFigmaNode(page, '16:2913');
    await expectBox(allTypes, { width: 133, height: 36 }, 2);
    await expectComputedStyles(allTypes, {
      'border-radius': '10px',
    });
    await expectComputedStyles(allTypes.locator('span'), {
      'font-weight': '500',
    });
  });

  test('create camp button height and radius', async ({ page }) => {
    const createBtn = await expectFigmaNode(page, '16:2918');
    await expectComputedStyles(createBtn, {
      height: '40px',
      'border-radius': '10px',
      gap: '2px',
    });
  });

  test('list section and status filter spacing', async ({ page }) => {
    const section = await expectFigmaNode(page, '16:2915');
    await expectComputedStyles(section, { gap: '16px' });

    const header = await expectFigmaNode(page, '16:2916');
    await expectComputedStyles(header, { 'padding-left': '8px' });

    const filterRow = await expectFigmaNode(page, '16:2919');
    await expectComputedStyles(filterRow, {
      gap: '8px',
      'flex-wrap': 'nowrap',
      'overflow-x': 'auto',
    });

    const filterRowBox = await getBox(filterRow);
    expect(filterRowBox.height).toBeLessThanOrEqual(40);

    const scheduled = await expectFigmaNode(page, '16:2920');
    await expectComputedStyles(scheduled, {
      'border-radius': '12px',
      height: '36px',
      'background-color': 'rgba(0, 0, 0, 0)',
    });

    const list = await expectFigmaNode(page, '16:2923');
    await expectComputedStyles(list, { gap: '12px' });

    const scrollContent = page.getByTestId('scroll-content');
    await expectComputedStyles(scrollContent, { 'overflow-y': 'auto' });

    const scrollMetrics = await scrollContent.evaluate((element) => ({
      scrollHeight: element.scrollHeight,
      clientHeight: element.clientHeight,
    }));
    expect(scrollMetrics.scrollHeight).toBeGreaterThan(scrollMetrics.clientHeight);

    const stickyControls = await expectFigmaNode(page, '16:2915');
    await expectComputedStyles(stickyControls, {
      position: 'sticky',
      top: '0px',
      'padding-top': '8px',
      'background-color': 'rgb(250, 250, 250)',
    });
  });

  test('camp card padding, gap and radius', async ({ page }) => {
    const card = await expectFigmaNode(page, '16:2924');
    await expectComputedStyles(card, { 'border-radius': '16px' });
  });

  test('bottom nav tab spacing and radius', async ({ page }) => {
    const campsTab = await expectFigmaNode(page, '16:3043');
    await expectComputedStyles(campsTab, {
      padding: '20px 8px',
      gap: '12px',
      'border-radius': '12px',
    });

    const indicator = await expectFigmaNode(page, '16:3047');
    await expectComputedStyles(indicator, {
      width: '40px',
      height: '4px',
      'border-bottom-left-radius': '24px',
      'border-bottom-right-radius': '24px',
    });
  });
});
