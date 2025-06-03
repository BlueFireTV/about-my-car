import { test, expect } from '@playwright/test';

test('simulate login', async ({ page }) => {
     await page.goto('/'); // Uses the baseURL defined in the configuration

    // Simulate a user interaction
    await page.click('button.login-button');
    await expect(page.locator('text="Nutzername:"')).toBeVisible();

    // Fill in the login form
    await page.getByLabel('Nutzername:').fill('admin');
    await page.getByLabel('Passwort:').fill('admin');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="Auto"')).toBeVisible();

    // Check if the user is logged in by checking for a profile button
    const profilButton = page.locator('button.user-header-status-button');
    await expect(profilButton).toBeVisible();

});