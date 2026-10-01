import { test, expect } from '@playwright/test';

test.describe('Syllabus Modal Arc Buttons Validation', () => {
  test('ARC buttons in syllabus modal render at full height without compression across all Arcs', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/');

    // Open Syllabus Modal
    await page.click('button[title*="Syllabus"]');
    await page.waitForTimeout(300);

    const syllabusModal = page.locator('.modal-sheet');
    await expect(syllabusModal).toBeVisible();

    // Verify all 5 Arc buttons are visible and have >= 44px height
    const arcButtons = syllabusModal.locator('[data-arc-tab]');
    const count = await arcButtons.count();
    expect(count).toBe(5);

    for (let i = 0; i < count; i++) {
      const btn = arcButtons.nth(i);
      await expect(btn).toBeVisible();
      const box = await btn.boundingBox();
      console.log(`Arc Button ${i+1} height:`, box?.height);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }

    // Capture screenshot of Arc I (default)
    await page.screenshot({ path: 'e2e/screenshots/syllabus_arc1_fixed.png' });

    // Click Arc II
    await arcButtons.nth(1).click();
    await page.waitForTimeout(200);
    const box2 = await arcButtons.nth(1).boundingBox();
    expect(box2?.height).toBeGreaterThanOrEqual(44);

    // Switch back to Arc I and test on mobile viewport
    await arcButtons.nth(0).click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    const mobileArc1Btn = syllabusModal.locator('[data-arc-tab="1"]');
    const mobileBox = await mobileArc1Btn.boundingBox();
    console.log('Mobile Arc 1 height:', mobileBox?.height);
    expect(mobileBox?.height).toBeGreaterThanOrEqual(44);

    await page.screenshot({ path: 'e2e/screenshots/syllabus_arc1_mobile_fixed.png' });
  });
});
