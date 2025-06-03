import { test, expect } from '@playwright/test';

test('load carpage', async ({ page }) => {
     await page.goto('/'); // Uses the baseURL defined in the configuration

    // Simulate a user interaction
    await page.click('button.login-button');
    await expect(page.locator('text="Nutzername:"')).toBeVisible();

    // Fill in the login form
    await page.getByLabel('Nutzername:').fill('admin');
    await page.getByLabel('Passwort:').fill('admin');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="Auto"')).toBeVisible();

    // Navigate to the car page
    await page.click('a[href="/car"]'); // Assuming the link to cars is an anchor tag with href="/cars"

    await expect(page).toHaveURL(/.*\/car/); // Check if the URL is correct
    await expect(page.locator('text="Identifikation"')).toBeVisible(); // Check if the car details header is visible
    // Check if the RSI Edit button is visible
    const rsiEditButton = page.locator('button.actionRSIBtn');
    await expect(rsiEditButton).toBeVisible();

    // Click the RSI Edit button
    await rsiEditButton.click();

    // Check if the RSI Edit form is visible
    const rsiEditForm = page.locator('dialog.change-rsi-dialog');
    await expect(rsiEditForm).toBeVisible();
});