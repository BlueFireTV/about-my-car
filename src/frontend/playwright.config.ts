import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    

    testDir: './tests/e2e',
    projects: [
        {
            name: 'Desktop Chrome',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'Desktop Firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'Desktop Safari',
            use: { ...devices['Desktop Safari'] },
        },
    ],
    use: {
        baseURL: 'http://localhost:5173',
    },
});
