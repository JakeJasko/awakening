import { test, expect } from '@playwright/test';

test.describe('Dr. John Vervaeke Official Website Links', () => {
  const TARGET_URL = 'https://johnvervaeke.com/series/awakening-from-the-meaning-crisis/';

  test('HeroScreen odyssey bubble and footer link to official series page', async ({ page }) => {
    await page.goto('/');

    // 1. Odyssey Badge Bubble
    const odysseyBubble = page.locator('a.hero-odyssey-bubble');
    await expect(odysseyBubble).toBeVisible();
    await expect(odysseyBubble).toContainText('DR. JOHN VERVAEKE’S 50-PART ODYSSEY');
    await expect(odysseyBubble).toHaveAttribute('href', TARGET_URL);
    await expect(odysseyBubble).toHaveAttribute('target', '_blank');
    await expect(odysseyBubble).toHaveAttribute('rel', 'noopener noreferrer');

    // 2. Footer link in HeroScreen
    const footerLink = page.locator(`a[href="${TARGET_URL}"]:has-text("Official Series on johnvervaeke.com")`);
    await expect(footerLink).toBeVisible();
    await expect(footerLink).toHaveAttribute('target', '_blank');
  });

  test('Syllabus modal has clean headers without external website links', async ({ page }) => {
    await page.goto('/');

    // Open Syllabus
    await page.click('button:has-text("Syllabus")');
    await expect(page.locator('text=50-EPISODE MASTER SYLLABUS')).toBeVisible();

    // Verify no external link in header
    const syllabusLink = page.locator(`.modal-sheet a[href*="johnvervaeke.com"]`);
    await expect(syllabusLink).toHaveCount(0);

    // Close modal
    await page.locator('.modal-header button').first().click();
  });

  test('Cognitive Lexicon modal has clean headers without external website links', async ({ page }) => {
    await page.goto('/');

    // Open Lexicon
    await page.click('button:has-text("Lexicon")');
    await expect(page.locator('text=COGNITIVE LEXICON & CONCEPTS')).toBeVisible();

    // Verify no external link in header
    const lexiconLink = page.locator(`.modal-sheet a[href*="johnvervaeke.com"]`);
    await expect(lexiconLink).toHaveCount(0);

    // Close modal
    await page.locator('.modal-header button').first().click();
  });

  test('EpisodeHub references official website', async ({ page }) => {
    await page.goto('/');

    // Click on Episode 1 card
    await page.click('h3:has-text("Introduction to the Meaning Crisis")');
    await expect(page.locator('h1:has-text("Introduction to the Meaning Crisis")')).toBeVisible();

    // Verify official series link in top controls
    const hubLink = page.locator(`a[href="${TARGET_URL}"]:has-text("Official Series Site")`);
    await expect(hubLink).toBeVisible();
    await expect(hubLink).toHaveAttribute('target', '_blank');

    // Verify thesis citation link
    const thesisCitation = page.locator(`a[href="${TARGET_URL}"]:has-text("Dr. John Vervaeke’s Series Archive")`);
    await expect(thesisCitation).toBeVisible();
  });
});
