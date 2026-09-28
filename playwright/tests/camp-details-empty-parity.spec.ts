import { test, expect } from '@playwright/test';
import { expectFigmaNode } from '../utils/figma-parity';

const REQUIRED_NODES = [
  '16:4828',
  '16:4831',
  '16:4832',
  '16:4833',
  '16:4834',
  '16:4835',
  '16:4836',
  '16:4844',
  '16:4867',
  '16:4876',
  '16:4905',
  '16:4915',
  '16:4916',
  '16:4917',
  '16:4920',
  '16:4921',
  '16:4923',
  '16:4925',
  '16:4927',
];

test.describe('Figma parity — Camp Details w/o patients screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/camps/new');
    await page.setViewportSize({ width: 360, height: 800 });
  });

  test('required Figma nodes exist in the DOM', async ({ page }) => {
    for (const nodeId of REQUIRED_NODES) {
      await expectFigmaNode(page, nodeId);
    }
  });

  test('empty patient state and Start Camp footer render correctly', async ({ page }) => {
    await expect(page.locator('[data-figma-node-id="16:4920"]')).toHaveText('No Patients Created');
    await expect(page.locator('[data-figma-node-id="16:4921"]')).toHaveText(
      'The created Patients would appear here.',
    );
    await expect(page.getByRole('button', { name: 'Start Camp' })).toBeVisible();
  });
});
