import { test, expect } from '@playwright/test';
import {
  expectFigmaNode,
  expectComputedStyles,
  expectBox,
  getBox,
  expectImgSvgFill,
} from '../utils/figma-parity';

test.describe('Figma spacing, padding & radius — Patients screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/patients');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('hero ellipse geometry matches Figma specification', async ({ page }) => {
    const screen = await expectFigmaNode(page, '16:3054');
    const ellipse = await expectFigmaNode(page, '16:3056');

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

  test('hero container geometry matches Figma specification', async ({ page }) => {
    const hero = await expectFigmaNode(page, '16:3102');
    await expectBox(hero, { width: 328, height: 152 }, 2);
  });

  test('hero user icon uses inline SVG with Figma cyan color', async ({ page }) => {
    const iconSlot = await expectFigmaNode(page, '16:3104');
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
    const search = await expectFigmaNode(page, '16:3107');
    await expectImgSvgFill(page, search.locator('img').first(), '#5FA1FF');

    const allTime = await expectFigmaNode(page, '16:3109');
    const allTimeIcons = allTime.locator('img');
    await expect(allTimeIcons).toHaveCount(2);
    await expectImgSvgFill(page, allTimeIcons.nth(0), '#9FC7FF');
    await expectImgSvgFill(page, allTimeIcons.nth(1), '#62EDFF');

    const allCamps = await expectFigmaNode(page, '16:3110');
    const allCampsIcons = allCamps.locator('img');
    await expect(allCampsIcons).toHaveCount(2);
    await expectImgSvgFill(page, allCampsIcons.nth(0), '#9FC7FF');
    await expectImgSvgFill(page, allCampsIcons.nth(1), '#62EDFF');

    const zoneButton = await expectFigmaNode(page, '16:3098');
    await expectImgSvgFill(page, zoneButton.locator('img'), '#62EDFF');

    const createBtn = await expectFigmaNode(page, '16:3115');
    await expectImgSvgFill(page, createBtn.locator('img'), 'white');

    const calendarBtn = await expectFigmaNode(page, '20:22346');
    await expectImgSvgFill(page, calendarBtn.locator('img'), '#005CDF');

    const arrowBtn = await expectFigmaNode(page, '20:22347');
    await expectImgSvgFill(page, arrowBtn.locator('img'), 'white');

    const patientsTab = await expectFigmaNode(page, '16:3275');
    const navUser = patientsTab.locator('img');
    await expectImgSvgFill(page, navUser, '#005CDF');
    await expect(navUser).toHaveAttribute('width', '24');
    await expect(navUser).toHaveAttribute('height', '24');
  });

  test('hero filter chips spacing and radius', async ({ page }) => {
    const chipRow = await expectFigmaNode(page, '16:3108');
    await expectComputedStyles(chipRow, { gap: '8px' });

    const allTime = await expectFigmaNode(page, '16:3109');
    await expectBox(allTime, { width: 125, height: 36 }, 2);
    await expectComputedStyles(allTime, {
      'border-radius': '10px',
    });

    const allCamps = await expectFigmaNode(page, '16:3110');
    await expectBox(allCamps, { width: 138, height: 36 }, 2);
    await expectComputedStyles(allCamps, {
      'border-radius': '10px',
    });
  });

  test('create patient button height and radius', async ({ page }) => {
    const createBtn = await expectFigmaNode(page, '16:3115');
    await expectComputedStyles(createBtn, {
      height: '40px',
      'border-radius': '10px',
      gap: '2px',
    });
  });

  test('list section and status filter spacing', async ({ page }) => {
    const section = await expectFigmaNode(page, '16:3112');
    await expectComputedStyles(section, { gap: '16px' });

    const filterRow = await expectFigmaNode(page, '16:3116');
    await expectComputedStyles(filterRow, {
      gap: '8px',
      'flex-wrap': 'nowrap',
      'overflow-x': 'auto',
    });

    const list = await expectFigmaNode(page, '20:22317');
    await expectComputedStyles(list, { gap: '12px' });
  });

  test('bottom nav tab spacing and radius', async ({ page }) => {
    const patientsTab = await expectFigmaNode(page, '16:3275');
    await expectComputedStyles(patientsTab, {
      padding: '20px 8px',
      gap: '12px',
      'border-radius': '12px',
    });

    const indicator = await expectFigmaNode(page, '16:3277');
    await expectComputedStyles(indicator, {
      width: '40px',
      height: '4px',
      'border-bottom-left-radius': '24px',
      'border-bottom-right-radius': '24px',
    });
  });
});
