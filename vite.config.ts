import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig({
  plugins: [uni()],
  server: {
    port: 8090,
    host: "0.0.0.0",
    // 强制刷新静态资源
    force: true,
  },
  // 禁用缓存
  optimizeDeps: {
    force: true,
  },
  // 静态资源处理
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg"],
});
