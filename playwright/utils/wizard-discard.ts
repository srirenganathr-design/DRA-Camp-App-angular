import { expect, type Page } from '@playwright/test';

export async function confirmDiscardDraft(page: Page) {
  await expect(page.getByRole('dialog', { name: 'Discard unsaved changes?' })).toBeVisible();
  await page.getByRole('button', { name: 'Discard changes' }).click();
}
