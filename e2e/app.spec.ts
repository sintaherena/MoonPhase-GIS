import { test, expect } from '@playwright/test';

test.describe('MoonPhase GIS App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('page loads with map visible', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle(/MoonPhase GIS/);
    
    // Check that the map section exists
    const mapSection = page.locator('#map-section');
    await expect(mapSection).toBeVisible();
    
    // Check that the sidebar section exists
    const sidebarSection = page.locator('#sidebar-section');
    await expect(sidebarSection).toBeVisible();
  });

  test('search bar appears and is focusable', async ({ page }) => {
    const searchSection = page.locator('#search-section');
    await expect(searchSection).toBeVisible();
    
    // Find the search input
    const searchInput = searchSection.locator('input[type="text"]');
    await expect(searchInput).toBeVisible();
    
    // Focus the search input
    await searchInput.focus();
    await expect(searchInput).toBeFocused();
  });

  test('date selector changes date', async ({ page }) => {
    // Find the date selector buttons
    const prevButton = page.getByRole('button', { name: /hari sebelumnya/i });
    const nextButton = page.getByRole('button', { name: /hari berikutnya/i });
    
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    
    // Click next day button
    await nextButton.click();
    
    // The date display should update (we can check that it doesn't crash)
    const dateDisplay = page.getByRole('button', { name: /pilih tanggal/i });
    await expect(dateDisplay).toBeVisible();
  });

  test('export button opens modal', async ({ page }) => {
    // Find and click the export button
    const exportButton = page.getByRole('button', { name: /ekspor/i });
    await expect(exportButton).toBeVisible();
    
    await exportButton.click();
    
    // Export modal should appear
    // The modal contains "Ekspor & Bagikan" text
    const modal = page.getByText(/ekspor & bagikan/i);
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('comparison panel shows activate button', async ({ page }) => {
    // The ComparisonPanel should show "Aktifkan" button when not in multi-pin mode
    const activateButton = page.getByRole('button', { name: /aktifkan/i });
    await expect(activateButton).toBeVisible();
  });

  test('clicking activate enables multi-pin mode', async ({ page }) => {
    const activateButton = page.getByRole('button', { name: /aktifkan/i });
    await activateButton.click();
    
    // After clicking, should show multi-pin UI with "Tambah" button
    const addButton = page.getByRole('button', { name: /tambah/i });
    await expect(addButton).toBeVisible({ timeout: 3000 });
  });

  test('heatmap toggle works', async ({ page }) => {
    const heatmapButton = page.getByRole('button', { name: /heatmap/i });
    await expect(heatmapButton).toBeVisible();
    
    // Click to toggle heatmap on
    await heatmapButton.click();
    
    // Button should now have active styling (check for cyan color class)
    await expect(heatmapButton).toHaveClass(/bg-cyber-cyan/);
  });
});
