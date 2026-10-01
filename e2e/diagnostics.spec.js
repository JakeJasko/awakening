import { test, expect } from '@playwright/test';

test('Diagnose themes, styles, and stacking', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/');

  // Initial state check
  const lightRootTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const lightBodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const lightAppBg = await page.evaluate(() => getComputedStyle(document.querySelector('.app-container')).backgroundColor);
  const lightH1Color = await page.evaluate(() => getComputedStyle(document.querySelector('h1')).color);

  console.log('--- LIGHT MODE INITIAL ---');
  console.log({ lightRootTheme, lightBodyBg, lightAppBg, lightH1Color });

  // Toggle to dark mode
  await page.click('button[title*="Mode"]');
  // Wait a moment for any transition
  await page.waitForTimeout(400);

  const darkRootTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const darkBodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const darkAppBg = await page.evaluate(() => getComputedStyle(document.querySelector('.app-container')).backgroundColor);
  const darkH1Color = await page.evaluate(() => getComputedStyle(document.querySelector('h1')).color);

  console.log('--- DARK MODE AFTER TOGGLE ---');
  console.log({ darkRootTheme, darkBodyBg, darkAppBg, darkH1Color });

  await page.screenshot({ path: 'e2e/screenshots/diag_dark_desktop.png' });

  // Check Lexicon modal stacking
  await page.click('button:has-text("Lexicon")');
  await page.waitForTimeout(300);

  const modalBackdropZ = await page.evaluate(() => {
    const el = document.querySelector('.modal-backdrop');
    return el ? getComputedStyle(el).zIndex : null;
  });
  const modalSheetBg = await page.evaluate(() => {
    const el = document.querySelector('.modal-sheet');
    return el ? getComputedStyle(el).backgroundColor : null;
  });

  console.log('--- LEXICON MODAL ---');
  console.log({ modalBackdropZ, modalSheetBg });

  await page.screenshot({ path: 'e2e/screenshots/diag_modal.png' });
});
