import { expect, test } from '@playwright/test';

test('home screen lists categories and the manifest is valid', async ({ page, request }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1, name: 'Fuel Talks' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Romantikk & dating/ })).toBeVisible();

  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(href).toBeTruthy();
  const manifestRes = await request.get(new URL(href ?? '', page.url()).toString());
  expect(manifestRes.ok()).toBe(true);
  const manifest = (await manifestRes.json()) as { name: string; lang: string; display: string; icons: { src: string }[] };
  expect(manifest.name).toBe('Fuel Talks');
  expect(manifest.lang).toBe('nb');
  expect(manifest.display).toBe('standalone');
  for (const icon of manifest.icons) {
    const res = await request.get(new URL(icon.src, manifestRes.url()).toString());
    expect(res.ok(), icon.src).toBe(true);
    expect(res.headers()['content-type']).toContain('image/png');
  }
});

test('swiping a card right saves it as a favourite', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: /Jobb & karriere/ }).click();
  const question = page.getByTestId('question');
  const text = await question.innerText();

  const box = await page.getByTestId('swipe-card').boundingBox();
  if (!box) throw new Error('card not visible');
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 80, y, { steps: 5 });
  await page.mouse.move(box.x + box.width / 2 + 200, y, { steps: 5 });
  await page.mouse.up();

  await expect(page.getByTestId('progress')).toHaveText(/^2 \//);
  await page.getByRole('button', { name: 'Tilbake' }).click();
  await page.getByRole('button', { name: /Favoritter/ }).click();
  await expect(page.getByText(text)).toBeVisible();

  // Favourites survive a reload
  await page.reload();
  await expect(page.getByText(text)).toBeVisible();
});

test('works offline after the first visit', async ({ page, context }) => {
  await page.goto('./');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  // Make sure the page is controlled by the service worker
  await page.reload();
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Fuel Talks' })).toBeVisible();
  await page.getByRole('button', { name: /Moro & isbrytere/ }).click();
  await expect(page.getByTestId('question')).toBeVisible();
  await page.getByRole('button', { name: 'Tommel opp' }).click();
  await expect(page.getByTestId('progress')).toHaveText(/^2 \//);
  await context.setOffline(false);
});
