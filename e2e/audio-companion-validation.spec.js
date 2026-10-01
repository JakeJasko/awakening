import { test, expect } from '@playwright/test';

test.describe('Header-Integrated Audio Companion Validation', () => {
  test('Audio companion opens in header, has valid playlist link, and controls work', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/');

    // 1. Select Episode I
    await page.click('h3:has-text("Introduction to the Meaning Crisis")');
    await page.waitForTimeout(300);

    // 2. Click "Audio Companion" button
    const audioCompanionBtn = page.locator('button:has-text("Audio Companion")');
    await expect(audioCompanionBtn).toBeVisible();
    await audioCompanionBtn.click();
    await page.waitForTimeout(400);

    // 3. Verify audio companion is in the header bar
    const header = page.locator('header');
    await expect(header.locator('text=EP I')).toBeVisible();
    await expect(header.locator('text=Introduction to the Meaning Crisis')).toBeVisible();

    // 4. Verify YouTube link contains the verified video ID and playlist URL
    const ytLink = header.locator('a[title*="YouTube"]');
    await expect(ytLink).toBeVisible();
    const href = await ytLink.getAttribute('href');
    console.log('Verified YouTube Playlist link:', href);
    expect(href).toContain('54l8_ewcOlY');
    expect(href).toContain('PLND1JCRq8Vuh3f0P5qjrSdb5eC1ZfZwWJ');
    expect(href).toContain('index=1');

    // 5. Verify the iframe is loaded with the verified YouTube embed
    const iframe = page.locator('iframe[src*="54l8_ewcOlY"]');
    await expect(iframe).toBeAttached();

    // 6. Capture screenshot of minimal header audio bar
    await page.screenshot({ path: 'e2e/screenshots/audio_header_minimal.png' });

    // 7. Toggle "Watch Video"
    await header.locator('button:has-text("Watch Video")').click();
    await page.waitForTimeout(300);
    await expect(header.locator('button:has-text("Hide Video")')).toBeVisible();
    await page.screenshot({ path: 'e2e/screenshots/audio_header_video_expanded.png' });

    // 8. Collapse video back to audio only
    await header.locator('button:has-text("Hide Video")').click();
    await page.waitForTimeout(200);

    // 9. Navigate back to "All Episodes" - audio bar should persist in header!
    await page.click('button:has-text("All Episodes")');
    await page.waitForTimeout(300);
    await expect(header.locator('text=Introduction to the Meaning Crisis')).toBeVisible();
    await page.screenshot({ path: 'e2e/screenshots/audio_header_on_home.png' });

    // 10. Close audio companion
    await header.locator('button[aria-label="Close audio companion"]').click();
    await page.waitForTimeout(200);
    await expect(header.locator('text=Introduction to the Meaning Crisis')).not.toBeVisible();
  });
});
