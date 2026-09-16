import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  retries: 1,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "http://localhost:4000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm run start:e2e",
    url: "http://localhost:4000/health",
    reuseExistingServer: !process.env.CI,
    timeout: 20_000,
  },
});
