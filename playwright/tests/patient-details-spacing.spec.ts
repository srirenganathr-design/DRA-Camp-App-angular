import { test, expect } from '@playwright/test';
import {
  expectFigmaNode,
  expectComputedStyles,
  expectBox,
  getBox,
  expectImgSvgStroke,
} from '../utils/figma-parity';

test.describe('Figma spacing — Patient Details profile card (16:3829)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/patients/23');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('profile card container matches Figma specification', async ({ page }) => {
    const card = await expectFigmaNode(page, '16:3829');
    await expectComputedStyles(card, {
      'background-color': 'rgb(250, 250, 250)',
      'border-radius': '16px',
    });
    const cardBox = await getBox(card);
    expect(cardBox.width).toBeCloseTo(328, 0);
    expect(cardBox.height).toBeCloseTo(234, 0);
  });

  test('profile header gradient fold matches Figma specification', async ({ page }) => {
    const header = await expectFigmaNode(page, '16:3830');
    await expectComputedStyles(header, {
      height: '202px',
      'padding-top': '16px',
      'background-image': 'linear-gradient(rgb(97, 202, 255) 0%, rgb(0, 97, 235) 50.675%)',
    });
    const curve = page.locator('[data-figma-node-id="16:3831"]');
    await expect(curve).toBeVisible();
    const curveSize = await curve.evaluate((el) => ({
      width: getComputedStyle(el).width,
      height: getComputedStyle(el).height,
      top: getComputedStyle(el).top,
    }));
    expect(curveSize.width).toBe('624px');
    expect(curveSize.height).toBe('320px');
    expect(parseFloat(curveSize.top)).toBeCloseTo(43.5, 0);
  });

  test('avatar and name typography match Figma specification', async ({ page }) => {
    const avatar = await expectFigmaNode(page, '16:3833');
    await expectBox(avatar, { width: 56, height: 56 });

    const name = await expectFigmaNode(page, '16:3838');
    await expectComputedStyles(name, {
      'font-size': '18px',
      'font-weight': '600',
    });

    const number = await expectFigmaNode(page, '16:3843');
    await expectComputedStyles(number, {
      'font-size': '12px',
      'font-weight': '400',
    });
  });

  test('profile body spacing matches Figma specification', async ({ page }) => {
    const body = await expectFigmaNode(page, '16:3832');
    await expectComputedStyles(body, { gap: '12px' });

    const nameBlock = await expectFigmaNode(page, '16:3836');
    await expectComputedStyles(nameBlock, { gap: '16px' });

    const nameWrap = await expectFigmaNode(page, '16:3837');
    await expectComputedStyles(nameWrap, { gap: '8px' });
  });

  test('meta row spacing and typography match Figma specification', async ({ page }) => {
    const metaRow = await expectFigmaNode(page, '16:3847');
    await expectComputedStyles(metaRow, { gap: '12px' });

    const age = await expectFigmaNode(page, '16:3851');
    await expectComputedStyles(age, {
      'font-size': '12px',
      'font-weight': '400',
    });
  });

  test('camp footer row matches Figma specification', async ({ page }) => {
    const campRow = await expectFigmaNode(page, '16:3863');
    await expectComputedStyles(campRow, { padding: '8px 0px' });

    const campName = await expectFigmaNode(page, '16:3865');
    await expectComputedStyles(campName, {
      'font-size': '12px',
      'font-weight': '500',
    });
  });

  test('hash and meta icons match Figma stroke color', async ({ page }) => {
    const hashIconWrap = await expectFigmaNode(page, '16:3841');
    await expectComputedStyles(hashIconWrap, { width: '12px', height: '12px' });
    await expectImgSvgStroke(page, hashIconWrap.locator('img'), '#1F7CFF');

    const calendarIcon = page.locator('[data-figma-node-id="16:3847"] img').first();
    await expectImgSvgStroke(page, calendarIcon, '#1F7CFF');
  });

  test('avatar sits above name block with 12px gap', async ({ page }) => {
    const avatar = await getBox(await expectFigmaNode(page, '16:3833'));
    const nameBlock = await getBox(await expectFigmaNode(page, '16:3836'));
    expect(nameBlock.y - (avatar.y + avatar.height)).toBeCloseTo(12, 1);
  });
});
