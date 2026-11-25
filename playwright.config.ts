import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests',
  forbidOnly: !!process.env.CI,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-first-failure',
  },
  projects: [
    {
      name: 'setup db',
      testMatch: /db\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup db'],
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      name: 'Frontend',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run backend:test',
      url: 'http://localhost:3000/api/posts',
      name: 'Backend',
      reuseExistingServer: false,
    }
  ],
});
