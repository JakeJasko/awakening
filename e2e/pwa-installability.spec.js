import { test, expect } from '@playwright/test';

test.describe('PWA Installability for Chrome', () => {
  test('Manifest and PWA meta tags are properly configured in HTML', async ({ page }) => {
    await page.goto('/');

    // 1. Verify manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveCount(1);
    const manifestHref = await manifestLink.getAttribute('href');
    expect(manifestHref).toMatch(/manifest\.webmanifest$/);

    // 2. Verify Theme Color meta tags
    const themeColorDark = page.locator('meta[name="theme-color"][media*="dark"]');
    await expect(themeColorDark).toHaveAttribute('content', '#151413');

    // 3. Verify Apple touch icon
    const appleIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleIcon).toHaveCount(1);

    // 4. Verify mobile-web-app-capable
    const mobileCapable = page.locator('meta[name="mobile-web-app-capable"]');
    await expect(mobileCapable).toHaveAttribute('content', 'yes');
  });

  test('Web App Manifest satisfies Chrome PWA install criteria', async ({ page, request }) => {
    await page.goto('/');
    
    // Fetch manifest file
    const manifestResponse = await request.get('/manifest.webmanifest');
    expect(manifestResponse.status()).toBe(200);

    const manifest = await manifestResponse.json();
    console.log('Manifest Name:', manifest.name);
    console.log('Manifest Display:', manifest.display);

    // Check mandatory Chrome install criteria
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    expect(['standalone', 'fullscreen', 'minimal-ui']).toContain(manifest.display);
    expect(manifest.icons).toBeInstanceOf(Array);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);

    // Check 192x192 and 512x512 icons
    const icon192 = manifest.icons.find(i => i.sizes === '192x192');
    const icon512 = manifest.icons.find(i => i.sizes === '512x512');
    expect(icon192).toBeDefined();
    expect(icon512).toBeDefined();

    // Verify icons exist and return HTTP 200
    const res192 = await request.get(icon192.src.startsWith('./') ? icon192.src.slice(1) : icon192.src);
    expect(res192.status()).toBe(200);
    expect(res192.headers()['content-type']).toContain('image/png');

    const res512 = await request.get(icon512.src.startsWith('./') ? icon512.src.slice(1) : icon512.src);
    expect(res512.status()).toBe(200);
    expect(res512.headers()['content-type']).toContain('image/png');
  });

  test('Service worker is served and accessible', async ({ request }) => {
    const swResponse = await request.get('/sw.js');
    expect(swResponse.status()).toBe(200);
    const swContent = await swResponse.text();
    expect(swContent).toContain("addEventListener('install'");
    expect(swContent).toContain("addEventListener('fetch'");
    expect(swContent).toContain("CACHE_NAME");
  });

  test('In-app PWA install button responds to beforeinstallprompt event', async ({ page }) => {
    await page.goto('/');

    // Initially, without beforeinstallprompt, install button is not shown
    const installBtn = page.locator('button.pwa-install-btn');
    await expect(installBtn).not.toBeVisible();

    // Simulate Chrome firing the beforeinstallprompt event
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt', { bubbles: true, cancelable: true });
      event.prompt = () => {
        window.__installPromptCalled = true;
      };
      event.userChoice = Promise.resolve({ outcome: 'accepted' });
      window.dispatchEvent(event);
    });

    // Verify Install App button becomes visible in Header
    await expect(installBtn).toBeVisible();
    await expect(installBtn).toContainText('Install App');

    // Click the install button and verify prompt was called
    await installBtn.click();
    const promptCalled = await page.evaluate(() => window.__installPromptCalled);
    expect(promptCalled).toBe(true);
  });
});
