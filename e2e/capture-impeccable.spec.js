import { test } from '@playwright/test';

test.describe('Impeccable Visual Quality & Capture', () => {
  test('Capture key views across viewports and themes for Impeccable review', async ({ page }) => {
    // 1. Desktop Light Mode
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'e2e/screenshots/01_desktop_home_light.png', fullPage: false });

    // 2. Desktop Dark Mode
    await page.click('button[title*="Mode"]');
    await page.waitForTimeout(400); // Allow theme transition to finish
    await page.screenshot({ path: 'e2e/screenshots/02_desktop_home_dark.png', fullPage: false });

    // Switch back to light mode
    await page.click('button[title*="Mode"]');
    await page.waitForTimeout(400);

    // 3. Mobile View (iPhone 14)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'e2e/screenshots/03_mobile_home_light.png', fullPage: false });

    // 4. Episode Hub & Primer View
    await page.click('h3:has-text("Introduction to the Meaning Crisis")');
    await page.waitForTimeout(400); // Allow fade-in animation to finish
    await page.screenshot({ path: 'e2e/screenshots/04_mobile_episode_primer.png', fullPage: false });

    // 5. Episode Quiz View
    await page.click('button:has-text("Epistemic Quiz")');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'e2e/screenshots/05_mobile_quiz_question.png', fullPage: false });

    // 6. Didactic Feedback View
    await page.click('button:has-text("Because meaning is not a subjective mood or a propositional belief")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'e2e/screenshots/06_mobile_quiz_feedback.png', fullPage: false });

    // 7. Lexicon Modal on Mobile
    await page.click('button[title*="Lexicon"]');
    await page.waitForTimeout(400); // Allow modal animation to finish
    await page.screenshot({ path: 'e2e/screenshots/07_mobile_lexicon_modal.png', fullPage: false });
  });
});
