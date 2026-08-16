import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 部署到 GitHub Pages 项目页时，站点在 https://<用户名>.github.io/<仓库名>/ 下，
// 需要给静态资源加上 /<仓库名>/ 前缀。
// GitHub Actions 会自动注入 VITE_BASE；本地开发时为 "/"。
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@paper-design/shaders-react"],
  },
});
