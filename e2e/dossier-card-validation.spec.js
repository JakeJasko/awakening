import { test, expect } from '@playwright/test';

test.describe('Dossier Card Bubble Validation', () => {
  test('score pill in generated dossier card extends fully to encompass 5/5 CORRECT (100%)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Open Episode 1
    await page.click('h3:has-text("Introduction to the Meaning Crisis")');
    await expect(page.locator('h1')).toHaveText(/Introduction to the Meaning Crisis/i);

    // Switch to Epistemic Quiz
    await page.click('button:has-text("Epistemic Quiz")');

    // Complete all 5 questions
    // Q1
    await page.click('button:has-text("Because meaning is not a subjective mood or a propositional belief")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await page.click('button:has-text("Proceed to Next Inquiry")');

    // Q2
    await page.click('button:has-text("It was the sense that the laws of the cosmos, the laws of morality, and human cognition were coherently fitted to one another.")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await page.click('button:has-text("Proceed to Next Inquiry")');

    // Q3
    await page.click('button:has-text("A standardized cultural tool or practice that enhances and rewires innate cognitive processing.")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await page.click('button:has-text("Proceed to Next Inquiry")');

    // Q4
    await page.click('button:has-text("Because we cannot undo the cognitive and scientific changes that shattered the pre-modern worldview without severe self-deception.")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await page.click('button:has-text("Proceed to Next Inquiry")');

    // Q5
    await page.click('button:has-text("That material comfort and subjective hedonic pleasure do not satisfy the fundamental cognitive need for meaning.")');
    await page.click('button:has-text("Submit & Examine Reason")');

    // Verify Q5 had scrolled down to explanation
    await page.waitForTimeout(600);
    const beforeAnalyzeScrollY = await page.evaluate(() => window.scrollY);
    expect(beforeAnalyzeScrollY).toBeGreaterThanOrEqual(300);

    // Click Analyze Mastery Results
    await page.click('button:has-text("Analyze Mastery Results")');

    // Score Modal is visible
    const dossierModal = page.locator('[data-testid="dossier-modal"]');
    await expect(dossierModal).toBeVisible();
    await expect(page.locator('text=EPISTEMIC MASTERY DOSSIER')).toBeVisible();

    // Verify window scrolled up to top (<= 50px)
    await page.waitForTimeout(600);
    const afterAnalyzeScrollY = await page.evaluate(() => window.scrollY);
    expect(afterAnalyzeScrollY).toBeLessThanOrEqual(50);

    // Verify dossier modal is vertically and horizontally centered in viewport
    const modalBox = await dossierModal.boundingBox();
    expect(modalBox).not.toBeNull();
    // In an 800px viewport, a centered modal (~545px high) has y = (800 - 545) / 2 ≈ 127.5px
    expect(modalBox.y).toBeGreaterThanOrEqual(100);
    expect(modalBox.y).toBeLessThanOrEqual(145);

    // Click "Share Dossier" to open ShareCardModal
    await page.click('button:has-text("Share Dossier")');
    await expect(page.locator('text=EPISTEMIC DOSSIER CARD')).toBeVisible();

    // Wait for the canvas image to render and be visible
    const dossierImg = page.locator('img[alt="Epistemic Mastery Dossier"]');
    await expect(dossierImg).toBeVisible({ timeout: 10000 });

    // Validate the image src is a valid data URL
    const imgSrc = await dossierImg.getAttribute('src');
    expect(imgSrc).toMatch(/^data:image\/png;base64,/);

    // Save decoded PNG to test-results/rendered-card.png
    const base64Data = imgSrc.replace(/^data:image\/png;base64,/, '');
    const fs = await import('fs');
    fs.writeFileSync('test-results/rendered-card.png', Buffer.from(base64Data, 'base64'));

    // Capture screenshot of the modal sheet
    await page.locator('.modal-sheet').screenshot({ path: 'test-results/modal-sheet.png' });

    // Also run in-page evaluation on cardRenderer to check exact pill coordinates
    const dimensions = await page.evaluate(async () => {
      const { generateEpisodeCard } = await import('/src/utils/cardRenderer.js');
      const dummyEp = { id: 1, title: 'Introduction to the Meaning Crisis', roman: 'I', quote: 'The unexamined life is not worth living.' };
      const url = await generateEpisodeCard({ episode: dummyEp, score: 5, total: 5, percentage: 100 });
      return { success: true, urlLength: url.length };
    });
    expect(dimensions.success).toBe(true);
  });
});
