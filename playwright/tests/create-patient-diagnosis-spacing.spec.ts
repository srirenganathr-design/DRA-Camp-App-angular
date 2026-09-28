import { test, expect } from '@playwright/test';
import { expectFigmaNode, expectComputedStyles, getBox } from '../utils/figma-parity';
import { gotoPatientWizardStep5 } from '../utils/patient-wizard';

test.describe('Figma spacing — Create Patient Diagnosis screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoPatientWizardStep5(page);
  });

  test('footer padding and button gap match Figma', async ({ page }) => {
    const footer = await expectFigmaNode(page, '126:21720');
    const footerRow = await expectFigmaNode(page, '126:21721');
    await expectComputedStyles(footer, { padding: '16px' });
    await expectComputedStyles(footerRow, { gap: '16px' });
  });

  test('footer buttons share equal width with 16px gap', async ({ page }) => {
    const previous = await expectFigmaNode(page, '206:48353');
    const createPatient = await expectFigmaNode(page, '126:21724');
    const previousBox = await getBox(previous);
    const createBox = await getBox(createPatient);
    expect(Math.abs(previousBox.width - createBox.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(createBox.x - (previousBox.x + previousBox.width + 16))).toBeLessThanOrEqual(1);
  });

  test('previous button label uses text-sub color', async ({ page }) => {
    const label = await expectFigmaNode(page, '206:48354');
    await expectComputedStyles(label, { color: 'rgb(107, 107, 107)' });
  });

  test('footer button shadows match Figma specification', async ({ page }) => {
    const previous = await expectFigmaNode(page, '206:48353');
    const createPatient = await expectFigmaNode(page, '126:21724');

    const previousShadow = await previous.evaluate((el) => getComputedStyle(el).boxShadow);
    const createPatientFilter = await createPatient.evaluate((el) => getComputedStyle(el).filter);

    expect(previousShadow).toContain('rgba(0, 106, 255, 0.25)');
    expect(previousShadow).toMatch(/11(\.077)?px/);
    expect(createPatientFilter).toContain('drop-shadow');
    expect(createPatientFilter).toContain('rgba(0, 106, 255, 0.25)');
    expect(createPatientFilter).toMatch(/5(\.538)?px/);
  });

  test('diagnosis options container uses 16px gap', async ({ page }) => {
    const container = await expectFigmaNode(page, '126:21708');
    await expectComputedStyles(container, { gap: '16px' });
  });

  test('diagnosis option group uses 8px gap', async ({ page }) => {
    const group = await expectFigmaNode(page, '126:21710');
    await expectComputedStyles(group, { gap: '8px' });
  });

  test('diagnosis option rows use 12px icon-to-label gap', async ({ page }) => {
    const option = await expectFigmaNode(page, '126:21709');
    await expectComputedStyles(option, { gap: '12px', padding: '8px' });
  });
});
