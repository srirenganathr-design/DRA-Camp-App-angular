import { test, expect } from '@playwright/test';
import {
  expectFigmaNode,
  expectComputedStyles,
  expectBox,
  expectImgSvgStroke,
} from '../utils/figma-parity';

test.describe('Figma spacing, padding & radius — Camp Details screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camps/1');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('hero camp card and meta row spacing', async ({ page }) => {
    const campCard = await expectFigmaNode(page, '16:4950');
    await expectBox(campCard, { width: 328 }, 2);
    await expectComputedStyles(campCard, {
      'background-color': 'rgb(244, 248, 255)',
      'border-color': 'rgb(191, 217, 255)',
    });

    const campHeader = await expectFigmaNode(page, '16:4951');
    await expectComputedStyles(campHeader, {
      'background-image':
        'linear-gradient(rgb(0, 106, 255) 0%, rgb(0, 21, 178) 50.675%)',
    });

    const metaRow = await expectFigmaNode(page, '16:4967');
    await expectComputedStyles(metaRow, {
      gap: '12px',
    });
  });

  test('schedule block text and icon colors match Figma', async ({ page }) => {
    const time = await expectFigmaNode(page, '16:4981');
    await expectComputedStyles(time, { color: 'rgb(0, 53, 127)' });

    const city = await expectFigmaNode(page, '16:4986');
    await expectComputedStyles(city, { color: 'rgb(0, 53, 127)' });

    const address = await expectFigmaNode(page, '16:4987');
    await expectComputedStyles(address, { color: 'rgb(0, 92, 223)' });

    const clock = await expectFigmaNode(page, '16:4979');
    await expectImgSvgStroke(page, clock, '#1F7CFF');

    const hospital = await expectFigmaNode(page, '16:4983');
    await expectImgSvgStroke(page, hospital, '#1F7CFF');
  });

  test('hash and user-shield icons match Figma stroke color', async ({ page }) => {
    const hashIcon = await expectFigmaNode(page, '16:4961');
    await expectComputedStyles(hashIcon, {
      width: '12px',
      height: '12px',
    });
    await expectImgSvgStroke(page, hashIcon, '#1F7CFF');

    const shieldIcon = await expectFigmaNode(page, '16:4972');
    await expectComputedStyles(shieldIcon, {
      width: '12px',
      height: '12px',
    });
    await expectImgSvgStroke(page, shieldIcon, '#1F7CFF');
  });

  test('camp stats grid layout matches Figma geometry', async ({ page }) => {
    const statsSection = await expectFigmaNode(page, '16:4988');
    await expectComputedStyles(statsSection, {
      gap: '16px',
    });

    const row1 = await expectFigmaNode(page, '16:4992');
    await expectComputedStyles(row1, {
      gap: '12px',
    });

    const tile1 = await expectFigmaNode(page, '16:4993');
    await expectBox(tile1, { width: 157, height: 83 }, 4);
    await expectComputedStyles(tile1, {
      padding: '16px',
      'border-radius': '12px',
    });
  });

  test('stats tile values use Figma typography', async ({ page }) => {
    const screenedValue = await expectFigmaNode(page, '16:4998');
    await expectComputedStyles(screenedValue, {
      'font-size': '18px',
      'font-weight': '700',
    });
  });

  test('full-width search field on with-patients variant', async ({ page }) => {
    const search = await expectFigmaNode(page, '16:5022');
    await expectBox(search, { width: 328, height: 40 }, 4);
  });

  test('search section uses surface styling from Figma 16:5020', async ({ page }) => {
    const search = await expectFigmaNode(page, '16:5022');
    const input = search.locator('input').locator('..');
    await expectComputedStyles(input, {
      'background-color': 'rgb(255, 255, 255)',
      'border-color': 'rgb(227, 227, 227)',
      'border-radius': '10px',
      padding: '10px 10px 10px 12px',
      gap: '8px',
    });
    await expectComputedStyles(search.locator('input'), {
      color: 'rgb(9, 9, 9)',
    });

    const chipRow = await expectFigmaNode(page, '16:5023');
    await expectComputedStyles(chipRow, { gap: '8px' });

    const allTime = await expectFigmaNode(page, '16:5024');
    await expectComputedStyles(allTime, {
      'background-color': 'rgb(255, 255, 255)',
      'border-color': 'rgb(227, 227, 227)',
      'border-radius': '10px',
    });
    await expectComputedStyles(allTime.locator('span'), {
      color: 'rgb(125, 125, 125)',
      'font-weight': '500',
    });

    const allTypes = await expectFigmaNode(page, '16:5025');
    await expectComputedStyles(allTypes, {
      'background-color': 'rgb(255, 255, 255)',
      'border-color': 'rgb(227, 227, 227)',
    });
  });
});

test.describe('Figma spacing — Camp Details empty variant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camps/new');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('Start Camp footer geometry', async ({ page }) => {
    const footer = await expectFigmaNode(page, '16:4923');
    await expect(footer).toBeVisible();

    const button = await expectFigmaNode(page, '16:4925');
    await expectBox(button, { width: 326, height: 45 }, 4);
  });

  test('empty state copy layout', async ({ page }) => {
    const emptyState = await expectFigmaNode(page, '16:4917');
    await expectComputedStyles(emptyState, {
      'flex-direction': 'column',
      gap: '16px',
    });
  });
});
