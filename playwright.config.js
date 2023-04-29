const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 1.5 * 60 * 1000,
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  mode: "serial",
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: "./session.json", },
    },
  ],
});