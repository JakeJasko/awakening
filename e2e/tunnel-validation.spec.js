import { test, expect } from '@playwright/test';

test('Verify Cloudflare Tunnel public URL', async ({ page }) => {
  const tunnelUrl = 'https://ran-correlation-foam-focal.trycloudflare.com';
  console.log(`Navigating to tunnel: ${tunnelUrl}`);

  const response = await page.goto(tunnelUrl, { timeout: 30000 });
  expect(response.status()).toBe(200);

  // Verify core UI elements load over the tunnel
  const title = await page.title();
  console.log('Page Title over tunnel:', title);
  expect(title).toContain('Awakening from the Meaning Crisis');

  const h1 = await page.textContent('h1');
  console.log('Heading 1 over tunnel:', h1);
  expect(h1).toContain('Awakening from the Meaning Crisis');

  // Verify milestone cards are rendered
  const episodeCards = await page.locator('h3:has-text("Introduction to the Meaning Crisis")').count();
  console.log('Episode I Card count:', episodeCards);
  expect(episodeCards).toBeGreaterThan(0);
});
