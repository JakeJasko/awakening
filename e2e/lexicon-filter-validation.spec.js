import { test, expect } from '@playwright/test';

test.describe('Cognitive Lexicon Highlight, Select & Filter Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/');

    // Click on Episode 1 from HeroScreen to navigate to EpisodeHub
    const ep1Card = page.locator('text=Introduction to the Meaning Crisis').first();
    await ep1Card.click();
    await page.waitForTimeout(300);

    // Verify we are on EpisodeHub primer view
    await expect(page.locator('text=PSYCHOTECHNOLOGIES & CONCEPTS')).toBeVisible();
  });

  test('clicking individual concept pills highlights and filters the selected term', async ({ page }) => {
    // 1. Click "Nomological Order" pill
    const nomologicalPill = page.locator('button:has-text("Nomological Order")').first();
    await expect(nomologicalPill).toBeVisible();
    await nomologicalPill.click();
    await page.waitForTimeout(350);

    // Lexicon modal should be visible
    const modal = page.locator('.modal-sheet');
    await expect(modal).toBeVisible();
    await expect(modal.locator('text=COGNITIVE LEXICON & CONCEPTS')).toBeVisible();

    // Notice bar indicating filtered concept
    await expect(modal.locator('text=Filtered to concept: Nomological Order')).toBeVisible();

    // Highlighted card with badge
    const highlightedCard = modal.locator('[data-term-id="nomological-order"]');
    await expect(highlightedCard).toBeVisible();
    await expect(highlightedCard.locator('text=✦ Selected Concept')).toBeVisible();

    // Capture screenshot of highlighted concept
    await page.screenshot({ path: 'e2e/screenshots/lexicon_highlight_nomological.png' });

    // Close modal
    await modal.locator('button[aria-label="Close Lexicon"]').click();
    await page.waitForTimeout(200);
    await expect(modal).toBeHidden();

    // 2. Click "Meaning Crisis" pill
    const meaningCrisisPill = page.locator('button:has-text("Meaning Crisis")').first();
    await meaningCrisisPill.click();
    await page.waitForTimeout(350);

    await expect(modal).toBeVisible();
    const mcCard = modal.locator('[data-term-id="meaning-crisis"]');
    await expect(mcCard).toBeVisible();
    await expect(mcCard.locator('text=✦ Selected Concept')).toBeVisible();
    await expect(mcCard.locator('text=The Meaning Crisis')).toBeVisible();

    // Close modal
    await modal.locator('button[aria-label="Close Lexicon"]').click();
    await page.waitForTimeout(200);

    // 3. Click "The 4 Ways of Knowing" pill
    const fourWaysPill = page.locator('button:has-text("The 4 Ways of Knowing")').first();
    await fourWaysPill.click();
    await page.waitForTimeout(350);

    await expect(modal).toBeVisible();
    const fourWaysCard = modal.locator('[data-term-id="4-ways-of-knowing"]');
    await expect(fourWaysCard).toBeVisible();
    await expect(fourWaysCard.locator('text=✦ Selected Concept')).toBeVisible();

    // Close modal
    await modal.locator('button[aria-label="Close Lexicon"]').click();
    await page.waitForTimeout(200);
  });

  test('clicking "View in Lexicon" filters to concepts relevant to the current episode with Show All option', async ({ page }) => {
    // Click "View in Lexicon" button
    const viewInLexiconBtn = page.locator('button:has-text("View in Lexicon")').first();
    await expect(viewInLexiconBtn).toBeVisible();
    await viewInLexiconBtn.click();
    await page.waitForTimeout(350);

    const modal = page.locator('.modal-sheet');
    await expect(modal).toBeVisible();

    // Filter banner showing Episode I concepts
    const banner = modal.locator('text=Showing concepts for Episode I');
    await expect(banner).toBeVisible();

    // Verify key concepts of Episode 1 are present
    await expect(modal.locator('[data-term-id="meaning-crisis"]')).toBeVisible();
    await expect(modal.locator('[data-term-id="nomological-order"]')).toBeVisible();
    await expect(modal.locator('[data-term-id="psychotechnology"]')).toBeVisible();
    await expect(modal.locator('[data-term-id="4-ways-of-knowing"]')).toBeVisible();

    // Check that core concept badges exist
    await expect(modal.locator('text=Ep I Core Concept').first()).toBeVisible();

    // Capture screenshot of episode-filtered lexicon
    await page.screenshot({ path: 'e2e/screenshots/lexicon_episode1_filtered.png' });

    // Click "Show All Concepts"
    const showAllBtn = modal.locator('button:has-text("Show All Concepts")').first();
    await expect(showAllBtn).toBeVisible();
    await showAllBtn.click();
    await page.waitForTimeout(200);

    // Episode filter banner should now be cleared
    await expect(banner).toBeHidden();

    // Non-episode 1 concepts should now be visible (e.g. Anagoge or Dialogos)
    await expect(modal.locator('[data-term-id="anagoge"]')).toBeVisible();
    await expect(modal.locator('[data-term-id="dialogos"]')).toBeVisible();

    // Capture screenshot of full lexicon
    await page.screenshot({ path: 'e2e/screenshots/lexicon_all_terms.png' });

    // Test search clear button
    const searchInput = modal.locator('input[placeholder*="Search concepts"]');
    await searchInput.fill('parasitic');
    await page.waitForTimeout(200);
    await expect(modal.locator('[data-term-id="parasitic-processing"]')).toBeVisible();
    await expect(modal.locator('[data-term-id="meaning-crisis"]')).toBeHidden();

    // Click clear search button (X)
    const clearSearchBtn = modal.locator('button[aria-label="Clear search query"]');
    await expect(clearSearchBtn).toBeVisible();
    await clearSearchBtn.click();
    await page.waitForTimeout(200);

    await expect(modal.locator('[data-term-id="meaning-crisis"]')).toBeVisible();
  });

  test('lexicon interactive episode link navigates back to episode from term', async ({ page }) => {
    // Open lexicon via header
    const headerLexiconBtn = page.locator('header button:has-text("Lexicon")');
    await headerLexiconBtn.click();
    await page.waitForTimeout(300);

    const modal = page.locator('.modal-sheet');
    await expect(modal).toBeVisible();

    // Look for a key episode link button, e.g. Ep 2 on Flow State or Ep 1 on Meaning Crisis
    const epBtn = modal.locator('[data-term-id="meaning-crisis"] button:has-text("Ep 1")');
    await expect(epBtn).toBeVisible();
    await epBtn.click();
    await page.waitForTimeout(350);

    // Modal should close and navigate to Episode 1
    await expect(modal).toBeHidden();
    await expect(page.locator('text=Introduction to the Meaning Crisis').first()).toBeVisible();
  });

  test('lexicon highlight and filter work seamlessly in dark mode', async ({ page }) => {
    // Toggle theme to dark
    const themeBtn = page.locator('header button[title*="Switch to"]').first();
    await themeBtn.click();
    await page.waitForTimeout(200);

    // Click "The 4 Ways of Knowing" pill
    const pill = page.locator('button:has-text("The 4 Ways of Knowing")').first();
    await pill.click();
    await page.waitForTimeout(350);

    const modal = page.locator('.modal-sheet');
    await expect(modal).toBeVisible();

    const fourWaysCard = modal.locator('[data-term-id="4-ways-of-knowing"]');
    await expect(fourWaysCard).toBeVisible();
    await expect(fourWaysCard.locator('text=✦ Selected Concept')).toBeVisible();

    // Capture dark mode screenshot
    await page.screenshot({ path: 'e2e/screenshots/lexicon_dark_mode_highlight.png' });
  });
});
