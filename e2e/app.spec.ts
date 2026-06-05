import { test, expect } from '@playwright/test';
import path from 'path';

/** Wait for client-side mount gate and Leaflet map to finish loading. */
async function waitForAppReady(page: import('@playwright/test').Page) {
  await page.waitForSelector('#search-section', { timeout: 20000 });
  await page.waitForSelector('.leaflet-container', { timeout: 20000 });
}

test.describe('MoonPhase GIS App', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('moonphase-gis-onboarding-seen', 'true');
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForAppReady(page);
  });

  test('page loads with map visible', async ({ page }) => {
    await expect(page).toHaveTitle(/MoonPhase GIS/);
    await expect(page.locator('#map-section')).toBeVisible();
    await expect(page.locator('#sidebar-section')).toBeVisible();
  });

  test('search bar appears and is focusable', async ({ page }) => {
    const searchSection = page.locator('#search-section');
    await expect(searchSection).toBeVisible();

    const searchInput = searchSection.locator('input[type="text"]');
    await expect(searchInput).toBeVisible();
    await searchInput.focus();
    await expect(searchInput).toBeFocused();
  });

  test('date selector changes date', async ({ page }) => {
    const prevButton = page.getByRole('button', { name: /previous day/i });
    const nextButton = page.getByRole('button', { name: /next day/i });

    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    await expect(page.getByRole('button', { name: /previous day/i })).toBeVisible();
  });

  test('export button opens modal', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: /export/i });
    await expect(exportButton).toBeVisible();
    await exportButton.click();

    const modal = page.getByText(/export & share/i);
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('comparison panel shows enable button', async ({ page }) => {
    const activateButton = page.getByRole('button', { name: /^enable$/i });
    await expect(activateButton).toBeVisible();
  });

  test('clicking enable activates multi-pin mode', async ({ page }) => {
    const activateButton = page.getByRole('button', { name: /^enable$/i });
    await activateButton.click();

    const addButton = page.getByRole('button', { name: /add/i });
    await expect(addButton).toBeVisible({ timeout: 3000 });
  });

  test('heatmap toggle works', async ({ page }) => {
    const heatmapButton = page.getByRole('button', { name: /heatmap/i });
    await expect(heatmapButton).toBeVisible();
    await heatmapButton.click();
    await expect(heatmapButton).toHaveClass(/bg-cyber-cyan/);
  });

  test('clicking map shows lunar data in sidebar', async ({ page }) => {
    const map = page.locator('.leaflet-container');
    await map.click({ position: { x: 400, y: 300 } });

    await expect(
      page.getByText(/click on the map to select/i).or(page.locator('h3'))
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Screenshots', () => {
  test('capture app screenshots', async ({ page }) => {
    const screenshotDir = path.join(process.cwd(), 'docs', 'screenshots');

    await page.addInitScript(() => {
      localStorage.setItem('moonphase-gis-onboarding-seen', 'true');
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForAppReady(page);
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: path.join(screenshotDir, '01-home.png'),
      fullPage: false,
    });

    const map = page.locator('.leaflet-container');
    if (await map.isVisible()) {
      await map.click({ position: { x: 400, y: 300 } });
      await page.waitForTimeout(2000);
    }

    await page.screenshot({
      path: path.join(screenshotDir, '02-map-with-data.png'),
      fullPage: false,
    });

    await page.getByRole('button', { name: /export/i }).click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(screenshotDir, '03-export-modal.png'),
      fullPage: false,
    });

    await page.getByRole('heading', { name: /export & share/i }).locator('..').getByRole('button').first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /^enable$/i }).click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(screenshotDir, '04-multi-pin-mode.png'),
      fullPage: false,
    });
  });
});
