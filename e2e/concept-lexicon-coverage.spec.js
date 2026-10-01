import { test, expect } from '@playwright/test';

test.describe('Psychotechnologies & Concepts Lexicon Coverage Validation', () => {
  test('all episode concept pills successfully open and display in the Cognitive Lexicon modal without empty search states', async ({ page }) => {
    await page.goto('/');

    // 1. Test Episode 4 Concepts: Aporia & Ta Erotika
    await page.click('h3:has-text("Socrates and the Quest for Wisdom")');
    await expect(page.locator('h1')).toHaveText(/Socrates and the Quest for Wisdom/i);

    // Click "Aporia" concept pill
    await page.click('button:has-text("Aporia")');
    await expect(page.locator('text=COGNITIVE LEXICON & CONCEPTS')).toBeVisible();
    await expect(page.locator('text=No concepts matching your search.')).not.toBeVisible();
    await expect(page.locator('[data-term-id="aporia"]')).toBeVisible();

    // Close modal
    await page.click('button[aria-label="Close Lexicon"]');

    // Click "Ta Erotika" concept pill
    await page.click('button:has-text("Ta Erotika")');
    await expect(page.locator('text=COGNITIVE LEXICON & CONCEPTS')).toBeVisible();
    await expect(page.locator('text=No concepts matching your search.')).not.toBeVisible();
    await expect(page.locator('[data-term-id="ta-erotika"]')).toBeVisible();

    // Close modal & return home
    await page.click('button[aria-label="Close Lexicon"]');
    await page.click('button[title*="Return to all episodes"]');

    // 2. Test Episode 12 Concepts: Stoicism, Prosochê, Dichotomy of Control
    await page.click('h3:has-text("Marcus Aurelius and Stoicism")');
    await expect(page.locator('h1')).toHaveText(/Marcus Aurelius and Stoicism/i);

    // Click "Dichotomy of Control"
    await page.click('button:has-text("Dichotomy of Control")');
    await expect(page.locator('text=COGNITIVE LEXICON & CONCEPTS')).toBeVisible();
    await expect(page.locator('text=No concepts matching your search.')).not.toBeVisible();
    await expect(page.locator('[data-term-id="dichotomy-of-control"]')).toBeVisible();

    // Close modal & return home
    await page.click('button[aria-label="Close Lexicon"]');
    await page.click('button[title*="Return to all episodes"]');

    // 3. Test Episode 13 Concepts: Aponia, Cynicism, Skepticism
    await page.click('h3:has-text("Epicureans, Cynics, and Skeptics")');
    await expect(page.locator('h1')).toHaveText(/Epicureans, Cynics, and Skeptics/i);

    // Click "Aponia"
    await page.click('button:has-text("Aponia")');
    await expect(page.locator('text=COGNITIVE LEXICON & CONCEPTS')).toBeVisible();
    await expect(page.locator('text=No concepts matching your search.')).not.toBeVisible();
    await expect(page.locator('[data-term-id="aponia"]')).toBeVisible();

    // Close modal & return home
    await page.click('button[aria-label="Close Lexicon"]');
    await page.click('button[title*="Return to all episodes"]');

    // 4. Test Episode 50 Concepts: Religion That Is Not a Religion & Awakening
    await page.click('h3:has-text("The Religion That Is Not a Religion")');
    await expect(page.locator('h1')).toHaveText(/The Religion That Is Not a Religion/i);

    // Click "Religion That Is Not a Religion"
    await page.click('button:has-text("Religion That Is Not a Religion")');
    await expect(page.locator('text=COGNITIVE LEXICON & CONCEPTS')).toBeVisible();
    await expect(page.locator('text=No concepts matching your search.')).not.toBeVisible();
    await expect(page.locator('[data-term-id="religion-that-is-not-a-religion"]')).toBeVisible();

    // Close modal
    await page.click('button[aria-label="Close Lexicon"]');

    // Click "Awakening" concept pill
    await page.click('button[title*=\'Inspect "Awakening"\']');
    await expect(page.locator('text=COGNITIVE LEXICON & CONCEPTS')).toBeVisible();
    await expect(page.locator('text=No concepts matching your search.')).not.toBeVisible();
    await expect(page.locator('[data-term-id="awakening"]')).toBeVisible();
  });
});
