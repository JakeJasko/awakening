import { test, expect } from '@playwright/test';

test.describe('Awakening Quiz App - Headless Validation', () => {
  test('Landing screen renders correctly with milestone quizzes and theme toggle', async ({ page }) => {
    await page.goto('/');

    // Check heading
    await expect(page.locator('h1')).toHaveText(/Awakening from the Meaning Crisis/i);

    // Verify milestone episodes present (20 milestone episodes including complete Arc 1)
    const episodeCards = page.locator('text=Interactive Quiz & Companion');
    await expect(episodeCards).toHaveCount(20);

    // Test Theme Toggle
    const themeBtn = page.locator('button[title*="Mode"]');
    await themeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await themeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('Cognitive Lexicon and Syllabus modals work as expected', async ({ page }) => {
    await page.goto('/');

    // Open Lexicon
    await page.click('button:has-text("Lexicon")');
    await expect(page.locator('text=COGNITIVE LEXICON & CONCEPTS')).toBeVisible();

    // Search for 4 Ways of Knowing
    await page.fill('input[placeholder*="Search concepts"]', '4 Ways');
    await expect(page.locator('h4:has-text("The 4 Ways of Knowing (4P/3R)")')).toBeVisible();

    // Close Lexicon
    await page.locator('.modal-header button').first().click();
    await expect(page.locator('text=COGNITIVE LEXICON & CONCEPTS')).not.toBeVisible();

    // Open Syllabus
    await page.click('button:has-text("Syllabus")');
    await expect(page.locator('text=50-EPISODE MASTER SYLLABUS')).toBeVisible();
    await expect(page.getByRole('button', { name: 'ARC I', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ARC V', exact: true })).toBeVisible();

    // Close Syllabus
    await page.locator('.modal-header button').first().click();
    await expect(page.locator('text=50-EPISODE MASTER SYLLABUS')).not.toBeVisible();
  });

  test('Arc filters correctly restrict displayed episodes', async ({ page }) => {
    await page.goto('/');

    // Click ARC IV filter
    await page.click('button:has-text("ARC IV")');
    // Arc IV has episodes 31 and 36
    await expect(page.locator('text=EPISODE XXXI')).toBeVisible();
    await expect(page.locator('text=EPISODE XXXVI')).toBeVisible();
    await expect(page.locator('h3:has-text("Introduction to the Meaning Crisis")')).not.toBeVisible();

    // Reset to ALL ARCS
    await page.click('button:has-text("ALL ARCS")');
    await expect(page.locator('h3:has-text("Introduction to the Meaning Crisis")')).toBeVisible();
  });

  test('Complete Episode I quiz flow with feedback and score dossier', async ({ page }) => {
    await page.goto('/');

    // Select Episode I
    await page.click('h3:has-text("Introduction to the Meaning Crisis")');

    // Verify Episode Hub loaded
    await expect(page.locator('h1')).toHaveText(/Introduction to the Meaning Crisis/i);
    await expect(page.locator('text=THE CORE VERVAEKEAN THESIS')).toBeVisible();

    // Navigate to Epistemic Quiz
    await page.click('button:has-text("Epistemic Quiz")');
    await expect(page.locator('text=QUESTION I OF V')).toBeVisible();

    // Answer Q1 (Option II is correct: index 1)
    await page.click('button:has-text("Because meaning is not a subjective mood or a propositional belief")');
    await page.click('button:has-text("Submit & Examine Reason")');

    // Verify Didactic Feedback
    await expect(page.locator('text=COGNITIVE CONTACT ACHIEVED • CORRECT UNDERSTANDING')).toBeVisible();
    await expect(page.locator('text=WHY THIS IS TRUE TO THE COGNITIVE SCIENCE')).toBeVisible();
    await expect(page.locator('text=14:20 – What is Meaning?')).toBeVisible();

    // Proceed to Q2
    await page.click('button:has-text("Proceed to Next Inquiry")');
    await expect(page.locator('text=QUESTION II OF V')).toBeVisible();

    // Answer Q2 (Option III is correct: index 2)
    await page.click('button:has-text("It was the sense that the laws of the cosmos, the laws of morality, and human cognition were coherently fitted to one another.")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await expect(page.locator('text=COGNITIVE CONTACT ACHIEVED • CORRECT UNDERSTANDING')).toBeVisible();
    await page.click('button:has-text("Proceed to Next Inquiry")');

    // Answer Q3 (Option I is correct: index 0)
    await expect(page.locator('text=QUESTION III OF V')).toBeVisible();
    await page.click('button:has-text("A standardized cultural tool or practice that enhances and rewires innate cognitive processing.")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await expect(page.locator('text=COGNITIVE CONTACT ACHIEVED • CORRECT UNDERSTANDING')).toBeVisible();
    await page.click('button:has-text("Proceed to Next Inquiry")');

    // Answer Q4 (Option IV is correct: index 3)
    await expect(page.locator('text=QUESTION IV OF V')).toBeVisible();
    await page.click('button:has-text("Because we cannot undo the cognitive and scientific changes that shattered the pre-modern worldview without severe self-deception.")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await expect(page.locator('text=COGNITIVE CONTACT ACHIEVED • CORRECT UNDERSTANDING')).toBeVisible();
    await page.click('button:has-text("Proceed to Next Inquiry")');

    // Answer Q5 (Option I is correct: index 0)
    await expect(page.locator('text=QUESTION V OF V')).toBeVisible();
    await page.click('button:has-text("That material comfort and subjective hedonic pleasure do not satisfy the fundamental cognitive need for meaning.")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await expect(page.locator('text=COGNITIVE CONTACT ACHIEVED • CORRECT UNDERSTANDING')).toBeVisible();

    // Finish Quiz & View Results
    await page.click('button:has-text("Analyze Mastery Results")');

    // Verify Score Modal
    await expect(page.locator('text=EPISTEMIC MASTERY DOSSIER')).toBeVisible();
    await expect(page.locator('text=Axial Sage')).toBeVisible();
    await expect(page.locator('text=5 / 5')).toBeVisible();
    await expect(page.locator('text=100% Score')).toBeVisible();
  });
});
