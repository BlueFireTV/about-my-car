import { test, expect } from '@playwright/test';

test('load the homepage', async ({ page }) => {
  await page.goto('/'); // Uses the baseURL defined in the configuration

    // Check if the page title is correct
    await expect(page).toHaveTitle(/AboutMyCar/);

  // Check if a specific element is visible
  await expect(
    page.getByRole('heading', { level: 2, name: 'Willkommen auf AboutMyCar' })
  ).toBeVisible();


  // Simulate a user interaction
  await page.click('button.login-button');
  await expect(page.locator('text="Nutzername:"')).toBeVisible();
});