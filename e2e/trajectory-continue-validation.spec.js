import { test, expect } from '@playwright/test';

test.describe('Study Trajectory Next Episode Navigation Validation', () => {
  test('displays Continue with Next Episode and navigates to the next incomplete episode when episodes are completed', async ({ page }) => {
    await page.goto('/');

    // 1. Initially 0 completed: says Begin Episode I
    const trajectoryBtn = page.locator('[data-testid="study-trajectory-action-btn"]');
    await expect(trajectoryBtn).toBeVisible();
    await expect(trajectoryBtn).toHaveText(/Begin Episode I/i);

    // 2. Set progress in localStorage: Episode 1 completed
    await page.evaluate(() => {
      const mockProgress = {
        completedEpisodes: {
          1: { score: 5, total: 5, percentage: 100, completedAt: new Date().toISOString() }
        },
        reflections: {},
        streak: 1,
        lastActive: new Date().toISOString()
      };
      localStorage.setItem('awakening_meaning_crisis_progress_v1', JSON.stringify(mockProgress));
    });

    // Reload page to re-render with new progress
    await page.reload();

    // 3. Trajectory card updates: 1 of 20 Milestone Quizzes Completed
    await expect(page.locator('text=1 of 20 Milestone Quizzes Completed')).toBeVisible();

    // 4. Button now says "Continue with Next Episode (Ep. II)"
    await expect(trajectoryBtn).toHaveText(/Continue with Next Episode \(Ep\. II\)/i);

    // 5. Click the button: it must navigate to Episode II, NOT the completed Episode I
    await trajectoryBtn.click();
    await expect(page.locator('h1')).toHaveText(/Flow, Metaphor, and the Axial Revolution/i);
    await expect(page.locator('text=EPISODE II')).toBeVisible();

    // 6. Return Home
    await page.click('button[title*="Return to all episodes"]');

    // 7. Complete Episode 2 as well in storage
    await page.evaluate(() => {
      const stored = JSON.parse(localStorage.getItem('awakening_meaning_crisis_progress_v1') || '{}');
      stored.completedEpisodes['2'] = { score: 5, total: 5, percentage: 100, completedAt: new Date().toISOString() };
      localStorage.setItem('awakening_meaning_crisis_progress_v1', JSON.stringify(stored));
    });

    await page.reload();

    // 8. Trajectory card updates: 2 of 20 Milestone Quizzes Completed
    await expect(page.locator('text=2 of 20 Milestone Quizzes Completed')).toBeVisible();

    // 9. Button now says "Continue with Next Episode (Ep. III)"
    await expect(trajectoryBtn).toHaveText(/Continue with Next Episode \(Ep\. III\)/i);

    // 10. Click the button: navigates to Episode III
    await trajectoryBtn.click();
    await expect(page.locator('h1')).toHaveText(/Continuous Cosmos and the Axial Revolution/i);
    await expect(page.locator('text=EPISODE III')).toBeVisible();
  });
});
