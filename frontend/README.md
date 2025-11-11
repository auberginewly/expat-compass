# Expat Compass 前端

基于 React + TypeScript + Vite，遵循 `docs/specification.md` 中的代码与设计规范，提供渐变风格的南昌市外籍人士信息聚合平台前端基线。

## 核心特性
- **设计体系**：Ant Design 5 + Tailwind CSS，自定义渐变主题、玻璃拟态组件与暗黑模式。
- **国际化**：i18next + react-i18next，支持中英文切换并持久化用户偏好。
- **状态管理**：Zustand 管理主题、语言与客服浮窗；React Query 统一数据访问。
- **基础布局**：顶级导航、频道路由、主题/语言切换、客服悬浮球、渐变 Hero 模块。
- **规范保障**：ESLint（Airbnb + TypeScript + Tailwind）、Prettier、Stylelint、Husky + lint-staged。

## 目录结构
```
frontend/
  src/
    components/      # 导航、主题、客服与反馈组件
    config/          # 导航配置等常量
    hooks/           # 主题解析等自定义 hooks
    layouts/         # RootLayout 等布局组件
    lib/             # queryClient、apiClient、i18n
    locales/         # 多语言资源
    pages/           # 首页及各个频道页
    routes/          # 路由定义
    stores/          # Zustand 状态
    styles/          # tailwind + 主题样式
```

## 脚本
- `pnpm dev`：启动本地开发。
- `pnpm build`：编译生产包。
- `pnpm lint`：运行 ESLint。
- `pnpm format` / `pnpm format:fix`：检查或修复 Prettier。
- `pnpm typecheck`：TypeScript 类型检查。

## 下一步
1. 根据 `docs/gradient-todolist.md` 进一步完善页面内容与数据对接。
2. 接入真实 API 与客服服务，填充 CMS 数据。
3. 编写单元测试与端到端测试，纳入 GitHub Actions CI。
