/**
 * 拼接 public/ 目录下静态资源的路径。
 * 部署到 GitHub Pages 子路径（如 /neil-portfolio/）时，
 * Vite 会把 import.meta.env.BASE_URL 设为对应前缀，避免图片 404。
 */
export function asset(path) {
  return `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;
}

export default asset;
