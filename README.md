# Neil Shi 个人简历网站

史云浩（Neil Shi）的个人作品集 / 在线简历，单页滚动式布局，纯前端静态站点。

**定位**：B 端产品 · 工业设计 · 聚焦 AI 赋能智能制造

## 技术栈

| 项 | 说明 |
| --- | --- |
| 框架 | React 19 |
| 构建 | Vite 8 |
| 路由 | react-router-dom 7（HashRouter） |
| 样式 | 原生 CSS + CSS 变量，无 UI 框架 |
| 代码检查 | ESLint 10 |

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm install     # 安装依赖
npm run dev     # 启动开发服务器，默认 http://localhost:5173
```

其他命令：

```bash
npm run build     # 构建生产版本到 dist/
npm run preview   # 本地预览构建产物
npm run lint      # 代码检查
```

## 目录结构

```
├── index.html              入口 HTML
├── vite.config.js          Vite 配置（含 GitHub Pages base 路径）
├── public/                 静态资源，构建时原样复制
│   ├── images/             头像、签名、Logo
│   ├── files/              简历 PDF 存放处
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx            应用入口
    ├── App.jsx             路由 + 页面组装
    ├── data/               ← 内容都在这里，改站点内容只需要动这个目录
    │   ├── profile.js      姓名、标语、联系方式
    │   ├── education.js    教育经历
    │   ├── experience.js   工作经历
    │   ├── projects.js     项目作品
    │   └── skills.js       技能标签
    ├── sections/           页面板块：Hero / Education / Experience / Projects / Skills / Contact
    ├── components/         可复用组件：Header、Footer、各类卡片
    ├── styles/             variables / global / experience / responsive
    └── utils/asset.js      静态资源路径拼接（兼容子路径部署）
```

## 修改内容

日常更新简历内容**不需要碰组件代码**，只改 `src/data/` 下对应的文件即可：

- 改姓名、标语、邮箱、微信、LinkedIn → `profile.js`
- 增删学历 → `education.js`
- 增删工作经历 → `experience.js`
- 增删项目 → `projects.js`
- 调整技能分组 → `skills.js`

替换图片：把文件放进 `public/images/`，然后在代码中用 `asset("images/文件名")` 引用。
简历 PDF 请放到 `public/files/Neil-Shi-Resume.pdf`，导航栏的「下载简历」按钮指向该路径。

## 部署到 GitHub Pages

仓库已配好自动部署（`.github/workflows/deploy.yml`），推送到 `main` 分支即自动构建上线。

首次使用需要在 GitHub 仓库里开启一次：

1. 进入仓库 **Settings → Pages**
2. 将 **Source** 设为 **GitHub Actions**
3. `git push` 到 `main`，等待 Actions 跑完

站点地址：`https://<你的用户名>.github.io/<仓库名>/`

工作流会自动把仓库名注入为 Vite 的 `base` 路径，换仓库名也不需要改配置。路由使用 HashRouter，因此刷新任意页面都不会 404。

## 说明

本项目为纯静态站点，不含任何后端服务与 API 密钥。
