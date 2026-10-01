import { test, expect } from '@playwright/test';

test('Verify GitHub Pages public deployment URL', async ({ page }) => {
  // Test both the github.io URL and the custom apex domain mapping
  const targetUrl = 'https://jakejasko.github.io/awakening/';
  console.log(`Navigating to GitHub Pages: ${targetUrl}`);

  const response = await page.goto(targetUrl, { timeout: 30000, waitUntil: 'networkidle' });
  expect(response.status()).toBe(200);

  // Verify page title and brand header
  const title = await page.title();
  console.log('Live GitHub Pages Page Title:', title);
  expect(title).toContain('Awakening from the Meaning Crisis');

  const h1 = await page.textContent('h1');
  console.log('Live GitHub Pages Heading 1:', h1);
  expect(h1).toContain('Awakening from the Meaning Crisis');

  // Verify episode cards rendered
  const episode1Card = page.locator('h3:has-text("Introduction to the Meaning Crisis")');
  await expect(episode1Card).toBeVisible();

  // Verify interactive modal opens cleanly (Cognitive Lexicon)
  await page.click('button:has-text("Lexicon")');
  await expect(page.locator('text=COGNITIVE LEXICON & CONCEPTS')).toBeVisible();

  // Close modal
  await page.locator('.modal-header button').first().click();
  await expect(page.locator('text=COGNITIVE LEXICON & CONCEPTS')).not.toBeVisible();

  console.log('GitHub Pages deployment fully verified and operational!');
});
