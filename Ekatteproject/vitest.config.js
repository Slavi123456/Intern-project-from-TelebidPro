// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ['src/**/*'],
      exclude: ["tests/**", "src/data/*"],
    },
  },
});
