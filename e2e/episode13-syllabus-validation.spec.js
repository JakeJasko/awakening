import { test, expect } from '@playwright/test';

test.describe('Episode 13 Syllabus & Companion Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/');
  });

  test('EP 13 has Launch Companion & Quiz button in Syllabus and launches full companion & quiz', async ({ page }) => {
    // 1. Open Master Syllabus Modal
    const syllabusBtn = page.locator('header button:has-text("Syllabus")').first();
    await syllabusBtn.click();
    await page.waitForTimeout(300);

    const modal = page.locator('.modal-sheet');
    await expect(modal).toBeVisible();

    // 2. Locate EP 13 entry
    const ep13Card = modal.locator('[data-episode-number="13"]');
    await expect(ep13Card).toBeVisible();

    // Verify EP 13 has the active "Launch Companion & Quiz" button instead of plain text
    const ep13LaunchBtn = ep13Card.locator('button:has-text("Launch Companion & Quiz")');
    await ep13LaunchBtn.scrollIntoViewIfNeeded();
    await expect(ep13LaunchBtn).toBeVisible();

    // Capture screenshot of Syllabus with EP 13 button
    await page.screenshot({ path: 'e2e/screenshots/syllabus_ep13_launch_button.png' });

    // 3. Click the Launch Companion & Quiz button for EP 13
    await ep13LaunchBtn.click();
    await page.waitForTimeout(350);

    // Modal should close
    await expect(modal).toBeHidden();

    // 4. Verify EpisodeHub is displaying Episode 13
    await expect(page.locator('text=Epicureans, Cynics, and Skeptics').first()).toBeVisible();
    await expect(page.locator('text=Hellenistic Psychotechnologies for Ataraxia & Empire Collapse')).toBeVisible();

    // Verify key concepts are present
    await expect(page.locator('button:has-text("Ataraxia")')).toBeVisible();
    await expect(page.locator('button:has-text("Cynicism")')).toBeVisible();

    // Verify quiz launch button
    const beginQuizBtn = page.locator('button:has-text("Begin Epistemic Quiz (5 Questions)")');
    await expect(beginQuizBtn).toBeVisible();

    // Capture screenshot of Episode 13 Hub
    await page.screenshot({ path: 'e2e/screenshots/episode13_hub_view.png' });

    // 5. Test clicking Ataraxia pill opens lexicon with Ataraxia highlighted
    const ataraxiaPill = page.locator('button:has-text("Ataraxia")').first();
    await ataraxiaPill.click();
    await page.waitForTimeout(350);

    const lexiconModal = page.locator('.modal-sheet');
    await expect(lexiconModal).toBeVisible();
    await expect(lexiconModal.locator('[data-term-id="ataraxia"]')).toBeVisible();
    await expect(lexiconModal.locator('text=✦ Selected Concept')).toBeVisible();

    // Close lexicon modal
    await lexiconModal.locator('button[aria-label="Close Lexicon"]').click();
    await page.waitForTimeout(200);

    // 6. Launch Quiz and verify Q1 renders
    await beginQuizBtn.click();
    await page.waitForTimeout(300);

    await expect(page.locator('text=QUESTION I OF V')).toBeVisible();
    await expect(page.locator('text=Hellenistic Crisis of Agency').or(page.locator('text=Following Alexander the Great’s conquests'))).toBeVisible();
  });
});
