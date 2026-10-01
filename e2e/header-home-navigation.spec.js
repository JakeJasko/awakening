import { test, expect } from '@playwright/test';

test.describe('Header Logo Home & All Episodes Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/');
  });

  test('clicking brand emblem from inside an episode returns home to all episodes', async ({ page }) => {
    // Navigate into Episode 1
    const ep1Card = page.locator('text=Introduction to the Meaning Crisis').first();
    await expect(ep1Card).toBeVisible();
    await ep1Card.click();
    await page.waitForTimeout(300);

    // Verify inside Episode view
    await expect(page.locator('text=PSYCHOTECHNOLOGIES & CONCEPTS')).toBeVisible();

    // Click Brand Emblem / Home button in Header
    const brandHomeBtn = page.locator('header button[aria-label*="Return to all episodes"]').first();
    await expect(brandHomeBtn).toBeVisible();
    await brandHomeBtn.click();
    await page.waitForTimeout(300);

    // Verify we have returned to HeroScreen / All Episodes view
    await expect(page.locator('text=DR. JOHN VERVAEKE’S 50-PART ODYSSEY')).toBeVisible();
    await expect(page.locator('text=Introduction to the Meaning Crisis').first()).toBeVisible();

    // Take screenshot of home after clicking brand emblem
    await page.screenshot({ path: 'e2e/screenshots/header_home_navigation_success.png' });
  });

  test('clicking brand emblem resets any active search or arc filter to show all episodes', async ({ page }) => {
    // Filter to ARC II
    const arc2Btn = page.locator('button:has-text("ARC II")').first();
    await arc2Btn.click();
    await page.waitForTimeout(200);

    // Type a search query into ArcFilterBar search input
    const searchInput = page.locator('input[placeholder*="Search by topic"]');
    await searchInput.fill('Aristotle');
    await page.waitForTimeout(200);

    // Click Brand Emblem / Home button
    const brandHomeBtn = page.locator('header button[aria-label*="Return to all episodes"]').first();
    await brandHomeBtn.click();
    await page.waitForTimeout(300);

    // Search query should be cleared
    await expect(searchInput).toHaveValue('');

    // All arcs should be selected (Episode 1 from Arc I should be visible)
    await expect(page.locator('text=Introduction to the Meaning Crisis').first()).toBeVisible();
  });

  test('keyboard activation of brand emblem with Enter key returns home', async ({ page }) => {
    // Navigate into Episode 4 (Socrates)
    const ep4Card = page.locator('text=Socrates and the Quest for Wisdom').first();
    await ep4Card.click();
    await page.waitForTimeout(300);

    // Verify inside Episode 4 view
    await expect(page.locator('text=PSYCHOTECHNOLOGIES & CONCEPTS')).toBeVisible();

    // Focus and press Enter on Brand Emblem
    const brandHomeBtn = page.locator('header button[aria-label*="Return to all episodes"]').first();
    await brandHomeBtn.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // Verify returned to home
    await expect(page.locator('text=DR. JOHN VERVAEKE’S 50-PART ODYSSEY')).toBeVisible();
    await expect(page.locator('text=Introduction to the Meaning Crisis').first()).toBeVisible();
  });
});
