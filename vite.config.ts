// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the Worker has no runtime module resolution, so
// the build fails. Never add compression (compressPublicAssets, vite-plugin-compression):
// hosting already compresses at the edge.
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { ConfigEnv } from "vite";

export default function config(env: ConfigEnv) {
  // TanStack reloads this configuration in preview mode to prerender the page.
  const githubPages = process.env.npm_lifecycle_event === "build:pages";

  return defineConfig({
    ...(githubPages && {
      vite: {
        base: "/contrutorarpramalho/",
        publicDir: false,
        build: { assetsDir: "pages-assets" },
      },
    }),
    // Only TanStack should render app routes. The root index.html is for Pages.
    nitro: githubPages ? false : { renderer: false },
    tanstackStart: {
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      // nitro/vite builds from this
      server: { entry: "server" },
      ...(githubPages && { prerender: { enabled: true, crawlLinks: false } }),
    },
  })(env);
}
