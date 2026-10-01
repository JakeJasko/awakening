import { test, expect } from '@playwright/test';

test.describe('Quiz Answer Scroll-Down Validation', () => {
  test('automatically scrolls down to reveal didactic explanation and proceed navigation upon answering', async ({ page }) => {
    // Set a realistic laptop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    // Launch Episode 1 Companion
    await page.click('h3:has-text("Introduction to the Meaning Crisis")');
    await expect(page.locator('h1')).toHaveText(/Introduction to the Meaning Crisis/i);

    // Switch to Epistemic Quiz
    await page.click('button:has-text("Epistemic Quiz")');
    await expect(page.locator('text=QUESTION I OF V')).toBeVisible();

    // Check initial scroll position near top
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBeLessThanOrEqual(150);

    // Select an option (Option II is correct)
    await page.click('button:has-text("Because meaning is not a subjective mood or a propositional belief")');

    // Submit answer
    await page.click('button:has-text("Submit & Examine Reason")');

    // Wait for explanation box to be visible
    const explanationBox = page.locator('[data-testid="quiz-explanation-box"]');
    await expect(explanationBox).toBeVisible();
    await expect(page.locator('text=COGNITIVE CONTACT ACHIEVED • CORRECT UNDERSTANDING')).toBeVisible();

    // Allow smooth scroll to settle
    await page.waitForTimeout(600);

    // Verify window.scrollY increased (scrolled down)
    const scrolledY = await page.evaluate(() => window.scrollY);
    expect(scrolledY).toBeGreaterThan(initialScrollY + 100);

    // Verify explanation box is comfortably positioned in viewport below header
    const boxRect = await explanationBox.boundingBox();
    expect(boxRect).not.toBeNull();
    // Header is ~60px, so rect.y should be >= 50 and <= 200 (well within view)
    expect(boxRect.y).toBeGreaterThanOrEqual(50);
    expect(boxRect.y).toBeLessThanOrEqual(200);

    // Verify the proceed button is visible and active
    const proceedBtn = page.locator('button:has-text("Proceed to Next Inquiry")');
    await expect(proceedBtn).toBeVisible();

    // Advance to Question II
    await proceedBtn.click();
    const progressHeaderQ2 = page.locator('[data-testid="quiz-progress-header"]');
    await expect(progressHeaderQ2).toBeVisible();
    await expect(progressHeaderQ2).toContainText('QUESTION II OF V');

    // Smooth scroll down to QUESTION II OF V progress bar bubble
    await page.waitForTimeout(600);
    const q2TopScrollY = await page.evaluate(() => window.scrollY);
    expect(q2TopScrollY).toBeGreaterThanOrEqual(300);

    // Verify progress bar bubble is comfortably aligned below sticky header
    const progressRect = await progressHeaderQ2.boundingBox();
    expect(progressRect).not.toBeNull();
    expect(progressRect.y).toBeGreaterThanOrEqual(50);
    expect(progressRect.y).toBeLessThanOrEqual(100);

    // Verify Question 2 options are immediately visible in view without scrolling
    const q2Option = page.locator('button:has-text("It was the sense that the laws of the cosmos, the laws of morality, and human cognition were coherently fitted to one another.")');
    await expect(q2Option).toBeVisible();

    // Answer Q2
    await q2Option.click();
    await page.click('button:has-text("Submit & Examine Reason")');
    await expect(page.locator('[data-testid="quiz-explanation-box"]')).toBeVisible();

    // Advance to Question III
    const proceedBtn2 = page.locator('button:has-text("Proceed to Next Inquiry")');
    await expect(proceedBtn2).toBeVisible();
    await proceedBtn2.click();

    // Verify QUESTION III OF V progress bubble
    const progressHeaderQ3 = page.locator('[data-testid="quiz-progress-header"]');
    await expect(progressHeaderQ3).toBeVisible();
    await expect(progressHeaderQ3).toContainText('QUESTION III OF V');

    // Smooth scroll down to QUESTION III OF V progress bar bubble
    await page.waitForTimeout(600);
    const q3TopScrollY = await page.evaluate(() => window.scrollY);
    expect(q3TopScrollY).toBeGreaterThanOrEqual(300);

    const progressRectQ3 = await progressHeaderQ3.boundingBox();
    expect(progressRectQ3).not.toBeNull();
    expect(progressRectQ3.y).toBeGreaterThanOrEqual(50);
    expect(progressRectQ3.y).toBeLessThanOrEqual(100);
  });
});
