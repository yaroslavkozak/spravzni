import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    cloudflare({ 
      viteEnvironment: { name: "ssr" },
      // Use remote R2 in development so we can access images uploaded to production
      // Persist D1 database state locally (R2 will use remote by default)
      persistState: {
        path: ".wrangler/state",
      },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})
