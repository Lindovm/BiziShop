// vite.config.ts
import path from "path";
import { defineConfig } from "file:///app/node_modules/vite/dist/node/index.js";
import react from "file:///app/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { tempo } from "file:///app/node_modules/tempo-devtools/dist/vite/index.js";
var __vite_injected_original_dirname = "/app";
var conditionalPlugins = [];
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}
var vite_config_default = defineConfig({
  base: process.env.NODE_ENV === "development" ? "/" : process.env.VITE_BASE_PATH || "/",
  plugins: [
    react({
      plugins: conditionalPlugins
    }),
    tempo()
  ],
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
    force: true
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    // @ts-ignore
    allowedHosts: true
  },
  cacheDir: "node_modules/.vite",
  clearScreen: false
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgeyB0ZW1wbyB9IGZyb20gXCJ0ZW1wby1kZXZ0b29scy9kaXN0L3ZpdGVcIjtcblxuY29uc3QgY29uZGl0aW9uYWxQbHVnaW5zOiBbc3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBhbnk+XVtdID0gW107XG5cbi8vIEB0cy1pZ25vcmVcbmlmIChwcm9jZXNzLmVudi5URU1QTyA9PT0gXCJ0cnVlXCIpIHtcbiAgY29uZGl0aW9uYWxQbHVnaW5zLnB1c2goW1widGVtcG8tZGV2dG9vbHMvc3djXCIsIHt9XSk7XG59XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOlxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCJcbiAgICAgID8gXCIvXCJcbiAgICAgIDogcHJvY2Vzcy5lbnYuVklURV9CQVNFX1BBVEggfHwgXCIvXCIsXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICBwbHVnaW5zOiBjb25kaXRpb25hbFBsdWdpbnMsXG4gICAgfSksXG4gICAgdGVtcG8oKSxcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZW50cmllczogW1wic3JjL21haW4udHN4XCIsIFwic3JjL3RlbXBvYm9vay8qKi8qXCJdLFxuICAgIGZvcmNlOiB0cnVlLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgcHJlc2VydmVTeW1saW5rczogdHJ1ZSxcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFsbG93ZWRIb3N0czogdHJ1ZSxcbiAgfSxcbiAgY2FjaGVEaXI6IFwibm9kZV9tb2R1bGVzLy52aXRlXCIsXG4gIGNsZWFyU2NyZWVuOiBmYWxzZSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4TCxPQUFPLFVBQVU7QUFDL00sU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsYUFBYTtBQUh0QixJQUFNLG1DQUFtQztBQUt6QyxJQUFNLHFCQUFzRCxDQUFDO0FBRzdELElBQUksUUFBUSxJQUFJLFVBQVUsUUFBUTtBQUNoQyxxQkFBbUIsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztBQUNwRDtBQUdBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQ0UsUUFBUSxJQUFJLGFBQWEsZ0JBQ3JCLE1BQ0EsUUFBUSxJQUFJLGtCQUFrQjtBQUFBLEVBQ3BDLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLFNBQVM7QUFBQSxJQUNYLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsZ0JBQWdCLG9CQUFvQjtBQUFBLElBQzlDLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxrQkFBa0I7QUFBQSxJQUNsQixPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQSxJQUVOLGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsVUFBVTtBQUFBLEVBQ1YsYUFBYTtBQUNmLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
