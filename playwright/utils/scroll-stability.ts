import { expect, type Page } from '@playwright/test';

export async function expectScrollStable(
  page: Page,
  selector: string,
  sampleMs = 500,
  maxDelta = 2,
) {
  await expect.poll(async () => {
    const samples: number[] = [];
    const intervalMs = 50;
    const iterations = Math.ceil(sampleMs / intervalMs);

    for (let index = 0; index < iterations; index += 1) {
      const scrollTop = await page.locator(selector).evaluate((element) => element.scrollTop);
      samples.push(scrollTop);
      if (index < iterations - 1) {
        await page.waitForTimeout(intervalMs);
      }
    }

    const min = Math.min(...samples);
    const max = Math.max(...samples);
    return max - min;
  }).toBeLessThanOrEqual(maxDelta);
}
