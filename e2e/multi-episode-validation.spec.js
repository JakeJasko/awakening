import { test, expect } from '@playwright/test';

test.describe('Headless Multi-Episode & Error State Validation', () => {
  test('Episode XXXI: 4 Ways of Knowing handles incorrect answer feedback properly', async ({ page }) => {
    await page.goto('/');

    // Filter to Arc IV
    await page.click('button:has-text("ARC IV")');
    await page.click('h3:has-text("The 4 Ways of Knowing")');

    // Go to Quiz
    await page.click('button:has-text("Epistemic Quiz")');
    await expect(page.locator('text=QUESTION I OF V')).toBeVisible();

    // Select deliberately wrong answer (Option 0: Participatory without propositional)
    await page.click('button:has-text("They possessed participatory knowing, but lacked propositional knowing.")');
    await page.click('button:has-text("Submit & Examine Reason")');

    // Verify Error Banner and Didactic Explanation
    await expect(page.locator('text=EPISTEMIC ILLUSION DETECTED • REVIEW THE VERVAEKEAN ARGUMENT')).toBeVisible();
    await expect(page.locator('text=THE COMMON COGNITIVE TRAP / COUNTERFEIT')).toBeVisible();
    await expect(page.locator('text=14:15 – Propositional vs Procedural Knowing')).toBeVisible();
  });

  test('Episode IV: Socrates handles full completion and Answer Review accordion', async ({ page }) => {
    await page.goto('/');

    // Select Socrates
    await page.click('h3:has-text("Socrates and the Quest for Wisdom")');
    await page.click('button:has-text("Epistemic Quiz")');

    // Question 1: Aporia (Index 1)
    await page.click('button:has-text("Aporia: a state of fertile confusion and realized ignorance")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await page.click('button:has-text("Proceed to Next Inquiry")');

    // Question 2: Socrates vs Sophists (Index 0)
    await page.click('button:has-text("The Sophists were focused on winning and persuasion")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await page.click('button:has-text("Proceed to Next Inquiry")');

    // Question 3: Oracle at Delphi (Index 2)
    await page.click('button:has-text("He realized his wisdom lay solely in knowing that he did not know")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await page.click('button:has-text("Proceed to Next Inquiry")');

    // Question 4: Ta Erotika (Index 3)
    await page.click('button:has-text("That he understood how to rightly direct attention and love toward what is genuinely good")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await page.click('button:has-text("Proceed to Next Inquiry")');

    // Question 5: Debater bullshitting oneself (Index 1)
    await page.click('button:has-text("Because they are strengthening their own capacity for self-deception")');
    await page.click('button:has-text("Submit & Examine Reason")');
    await page.click('button:has-text("Analyze Mastery Results")');

    // Verify Score Modal
    await expect(page.locator('text=EPISTEMIC MASTERY DOSSIER')).toBeVisible();
    await expect(page.locator('text=Axial Sage')).toBeVisible();
    await expect(page.locator('text=5 / 5')).toBeVisible();

    // Test Answer Review Accordion
    await page.click('button:has-text("Review All 5 Questions")');
    await expect(page.locator('text=Vervaeke’s Insight:').first()).toBeVisible();

    // Test Share Dossier Modal
    await page.click('button:has-text("Share Dossier")');
    await expect(page.locator('text=EPISTEMIC DOSSIER CARD')).toBeVisible();
    await expect(page.locator('button:has-text("Download Card")')).toBeVisible();
  });
});
