import { test, expect } from '@playwright/test';

test('Figma-backed DOM contains no duplicate node IDs', async ({ page }) => {
  await page.goto('/patients');

  const ids = await page.locator('[data-figma-node-id]').evaluateAll((nodes) =>
    nodes
      .map((node) => node.getAttribute('data-figma-node-id'))
      .filter(Boolean),
  );

  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  expect(duplicates, 'Duplicate Figma node IDs in DOM').toEqual([]);
});
