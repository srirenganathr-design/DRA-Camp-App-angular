import { expect, Locator, Page } from '@playwright/test';

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type StyleExpectation = Record<string, string | number>;

export async function getBox(locator: Locator): Promise<Box> {
  return locator.boundingBox().then((box) => {
    if (!box) throw new Error('Element has no bounding box.');
    return {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    };
  });
}

export async function getComputedStyles(
  locator: Locator,
  properties: string[],
): Promise<Record<string, string>> {
  return locator.evaluate((element, props) => {
    const styles = getComputedStyle(element);
    return Object.fromEntries(
      props.map((property) => [property, styles.getPropertyValue(property)]),
    );
  }, properties);
}

export async function expectComputedStyles(
  locator: Locator,
  expected: StyleExpectation,
): Promise<void> {
  const actual = await getComputedStyles(locator, Object.keys(expected));

  for (const [property, expectedValue] of Object.entries(expected)) {
    await expect
      .poll(() => actual[property])
      .toBe(String(expectedValue));
  }
}

export async function expectBox(
  locator: Locator,
  expected: Partial<Box>,
  tolerance = 0.5,
): Promise<void> {
  const actual = await getBox(locator);

  for (const [key, value] of Object.entries(expected)) {
    const actualValue = actual[key as keyof Box];
    expect(
      Math.abs(actualValue - Number(value)),
      `${key}: expected ${value}, received ${actualValue}`,
    ).toBeLessThanOrEqual(tolerance);
  }
}

export function figmaNode(page: Page, nodeId: string): Locator {
  return page.locator(`[data-figma-node-id="${nodeId}"]`);
}

export async function expectFigmaNode(
  page: Page,
  nodeId: string,
): Promise<Locator> {
  const locator = figmaNode(page, nodeId);
  await expect(locator).toHaveCount(1);
  await expect(locator).toBeVisible();
  return locator;
}

function readSvgFromSrc(src: string, pageUrl: string): Promise<string | null> {
  if (src.startsWith('data:')) {
    const commaIndex = src.indexOf(',');
    if (commaIndex === -1) return Promise.resolve(null);

    const payload = src.slice(commaIndex + 1);
    const text = src.includes(';base64,')
      ? Buffer.from(payload, 'base64').toString('utf-8')
      : decodeURIComponent(payload);

    return Promise.resolve(text);
  }

  const url = new URL(src, pageUrl).toString();
  return fetch(url).then(async (response) => {
    if (!response.ok) return null;
    return response.text();
  });
}

export async function getImgSvgFill(
  page: Page,
  imgLocator: Locator,
): Promise<string | null> {
  const src = await imgLocator.getAttribute('src');
  if (!src) return null;

  const text = await readSvgFromSrc(src, page.url());
  if (!text) return null;

  const fills = [...text.matchAll(/fill=['"]([^'"]+)['"]/g)]
    .map((match) => match[1])
    .filter((fill) => fill !== 'none');

  return fills[0] ?? null;
}

export async function expectImgSvgFill(
  page: Page,
  imgLocator: Locator,
  expectedFill: string,
): Promise<void> {
  await expect
    .poll(async () => getImgSvgFill(page, imgLocator))
    .toBe(expectedFill);
}

export async function getImgSvgStroke(
  page: Page,
  imgLocator: Locator,
): Promise<string | null> {
  const src = await imgLocator.getAttribute('src');
  if (!src) return null;

  const text = await readSvgFromSrc(src, page.url());
  if (!text) return null;

  const strokes = [...text.matchAll(/stroke=['"]([^'"]+)['"]/g)]
    .map((match) => match[1])
    .filter((stroke) => stroke !== 'none');

  return strokes[0] ?? null;
}

export async function expectImgSvgStroke(
  page: Page,
  imgLocator: Locator,
  expectedStroke: string,
): Promise<void> {
  await expect
    .poll(async () => getImgSvgStroke(page, imgLocator))
    .toBe(expectedStroke);
}
