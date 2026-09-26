import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./site/tests",
  testMatch: "browser.spec.mjs",
  use: {
    baseURL: "http://127.0.0.1:4173/causal-inference-from-scratch/",
    ...(process.env.PLAYWRIGHT_CHANNEL
      ? { channel: process.env.PLAYWRIGHT_CHANNEL }
      : {}),
  },
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:4173/causal-inference-from-scratch/",
    reuseExistingServer: false,
  },
});
