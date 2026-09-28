import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles, expectBox, getBox } from '../utils/figma-parity';
import { gotoPatientWizardStep3 } from '../utils/patient-wizard';

test.describe('Figma spacing — Create Patient Dry Auto-Refraction screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoPatientWizardStep3(page);
  });

  test('header uses compact vertical padding', async ({ page }) => {
    const header = await expectFigmaNode(page, '126:21326');
    await expectComputedStyles(header, { padding: '4px 16px' });
  });

  test('step section padding and gap match Figma', async ({ page }) => {
    const stepSection = await expectFigmaNode(page, '126:21331');
    await expectComputedStyles(stepSection, {
      padding: '24px 16px',
      gap: '16px',
    });
  });

  test('step badge uses muted background', async ({ page }) => {
    const badge = await expectFigmaNode(page, '126:21333');
    await expectComputedStyles(badge, {
      padding: '4px 8px',
      'background-color': 'rgb(250, 250, 250)',
    });
  });

  test('refraction content uses horizontal padding and section gap', async ({ page }) => {
    const content = await expectFigmaNode(page, '126:21339');
    await expectComputedStyles(content, { padding: '0px 16px', gap: '16px' });
  });

  test('eye section title padding matches Figma', async ({ page }) => {
    for (const nodeId of ['126:21344', '126:21407']) {
      const title = await expectFigmaNode(page, nodeId);
      await expectComputedStyles(title, { padding: '8px 12px' });
    }
  });

  test('eye section blocks use 8px vertical gap', async ({ page }) => {
    for (const nodeId of ['126:21341', '126:21404']) {
      const block = await expectFigmaNode(page, nodeId);
      await expectComputedStyles(block, {
        gap: '8px',
        'flex-direction': 'column',
      });
    }
  });

  test('title to readings gap is 8px for right eye', async ({ page }) => {
    const titleWrap = await expectFigmaNode(page, '126:21342');
    const readings = await expectFigmaNode(page, '126:21347');
    const titleWrapBox = await getBox(titleWrap);
    const readingsBox = await getBox(readings);
    const gap = readingsBox.y - (titleWrapBox.y + titleWrapBox.height);
    expect(gap).toBeCloseTo(8, 0);
  });

  test('left eye title, same-as row, and readings have 8px gaps', async ({ page }) => {
    const titleWrap = await expectFigmaNode(page, '126:21405');
    const sameAs = await expectFigmaNode(page, '126:22778');
    const readings = await expectFigmaNode(page, '126:21410');

    const titleWrapBox = await getBox(titleWrap);
    const sameAsBox = await getBox(sameAs);
    const readingsBox = await getBox(readings);

    const gapAfterTitle = sameAsBox.y - (titleWrapBox.y + titleWrapBox.height);
    const gapAfterSameAs = readingsBox.y - (sameAsBox.y + sameAsBox.height);

    expect(gapAfterTitle).toBeCloseTo(8, 0);
    expect(gapAfterSameAs).toBeCloseTo(8, 0);
  });

  test('reading cards list uses 8px gap', async ({ page }) => {
    const list = await expectFigmaNode(page, '126:21347');
    await expectComputedStyles(list, { gap: '8px' });
  });

  test('right and left eye sections have 16px gap between them', async ({ page }) => {
    const rightSection = await expectFigmaNode(page, '126:21340');
    const leftSection = await expectFigmaNode(page, '126:21403');
    const rightBox = await getBox(rightSection);
    const leftBox = await getBox(leftSection);
    const gap = leftBox.y - (rightBox.y + rightBox.height);
    expect(gap).toBeCloseTo(16, 0);
  });

  test('left eye section has bottom padding', async ({ page }) => {
    const leftSection = await expectFigmaNode(page, '126:21403');
    await expectComputedStyles(leftSection, { 'padding-bottom': '16px' });
  });

  test('same-as row dimensions match Figma', async ({ page }) => {
    const row = await expectFigmaNode(page, '126:22778');
    await expectBox(row, { width: 328, height: 49 }, 1);
    await expectComputedStyles(row, {
      padding: '4px 12px',
      'border-radius': '16px',
    });
  });

  test('add comment button dimensions match Figma', async ({ page }) => {
    const btn = await expectFigmaNode(page, '126:21402');
    await expectBox(btn, { width: 328, height: 42 }, 1);
    await expectComputedStyles(btn, {
      gap: '4px',
      padding: '0px 8px',
    });
  });

  test('footer padding and button gap match Figma', async ({ page }) => {
    const footer = await expectFigmaNode(page, '126:21466');
    const footerRow = await expectFigmaNode(page, '126:21467');
    await expectComputedStyles(footer, { padding: '16px' });
    await expectComputedStyles(footerRow, { gap: '16px' });
  });

  test('reading card internal spacing matches Figma', async ({ page }) => {
    const card = await expectFigmaNode(page, '126:21348');
    await expectComputedStyles(card, {
      padding: '12px',
      gap: '16px',
    });

    const row = page.locator('[data-figma-node-id="126:21348"] [data-figma-node-id="126:21350"]');
    await expect(row).toHaveCount(1);
    await expectComputedStyles(row, { gap: '8px' });
  });

  test('field value boxes match Figma height and padding', async ({ page }) => {
    const value = await expectFigmaNode(page, '126:21355');
    await expectBox(value, { height: 36 }, 1);
    await expectComputedStyles(value, { padding: '8px' });
  });
});
