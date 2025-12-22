# Expat Compass 前端

南昌市外籍人士一站式多语种生活服务平台前端应用。

## 📋 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **UI 库**: Ant Design 5
- **样式**: Tailwind CSS 3
- **状态管理**: Zustand
- **数据获取**: React Query (TanStack Query)
- **路由**: React Router 7
- **国际化**: i18next + react-i18next
- **HTTP 客户端**: Axios
- **代码规范**: ESLint + Prettier + Stylelint

## 🏗️ 项目结构

```
frontend/
├── src/
│   ├── main.tsx                    # 应用入口
│   ├── App.tsx                     # 根组件
│   │
│   ├── components/                 # 组件
│   │   ├── navigation/             # 导航组件
│   │   │   ├── AppHeader.tsx       # 顶部导航栏
│   │   │   ├── LanguageSwitcher.tsx # 语言切换
│   │   │   ├── ThemeSwitcher.tsx   # 主题切换
│   │   │   └── UserAvatar.tsx      # 用户头像
│   │   ├── auth/                   # 认证组件
│   │   │   ├── CaptchaImage.tsx    # 验证码图片
│   │   │   └── PasswordStrength.tsx # 密码强度
│   │   ├── common/                 # 通用组件
│   │   │   ├── AppFooter.tsx       # 页脚
│   │   │   ├── PageHeader.tsx      # 页面头部
│   │   │   ├── QuickLinks.tsx      # 快速链接
│   │   │   └── ...
│   │   ├── feedback/               # 反馈组件
│   │   │   ├── ErrorFallback.tsx   # 错误边界
│   │   │   └── PageSpinner.tsx     # 加载动画
│   │   ├── support/                # 支持组件
│   │   │   └── SupportWidget.tsx   # 客服悬浮球
│   │   ├── HeroSection.tsx         # Hero 区域
│   │   └── NewsCarousel.tsx        # 新闻轮播
│   │
│   ├── pages/                      # 页面组件
│   │   ├── HomePage.tsx            # 首页
│   │   ├── ForumPage.tsx           # 论坛页面
│   │   ├── AboutPage.tsx           # 关于我们
│   │   ├── ProfilePage.tsx         # 个人中心
│   │   ├── auth/                   # 认证页面
│   │   │   ├── LoginPage.tsx       # 登录
│   │   │   └── SignupPage.tsx      # 注册
│   │   ├── partition/              # 分区页面
│   │   │   ├── MedicalPage.tsx     # 医疗
│   │   │   ├── EducationPage.tsx   # 教育
│   │   │   ├── TransportPage.tsx    # 交通
│   │   │   ├── PaymentPage.tsx      # 支付
│   │   │   └── CulturePage.tsx     # 文化
│   │   └── legal/                  # 法律页面
│   │       ├── PrivacyPage.tsx     # 隐私政策
│   │       └── ServicePage.tsx     # 服务条款
│   │
│   ├── routes/                     # 路由配置
│   │   └── AppRoutes.tsx           # 路由定义
│   │
│   ├── stores/                     # 状态管理
│   │   ├── appStore.ts             # 应用状态（主题、语言）
│   │   └── authStore.ts            # 认证状态
│   │
│   ├── services/                   # 服务层
│   │   └── authService.ts          # 认证服务
│   │
│   ├── lib/                        # 工具库
│   │   ├── apiClient.ts            # API 客户端
│   │   ├── queryClient.ts          # React Query 配置
│   │   ├── i18n.ts                 # 国际化配置
│   │   └── jwt.ts                  # JWT 工具
│   │
│   ├── hooks/                      # 自定义 Hooks
│   │   └── useResolvedTheme.ts     # 主题解析
│   │
│   ├── config/                     # 配置文件
│   │   └── navigation.ts           # 导航配置
│   │
│   ├── locales/                    # 多语言资源
│   │   ├── zh/                     # 中文
│   │   │   ├── common.json
│   │   │   ├── nav.json
│   │   │   ├── home.json
│   │   │   ├── forum.json
│   │   │   └── ...
│   │   └── en/                     # 英文
│   │       └── ...
│   │
│   ├── styles/                     # 样式文件
│   │   ├── index.css               # 全局样式
│   │   └── theme.ts                # 主题配置
│   │
│   └── types/                      # TypeScript 类型
│       └── vite-client.d.ts        # Vite 类型声明
│
├── public/                         # 静态资源
├── index.html                      # HTML 模板
├── package.json                    # 依赖配置
├── tsconfig.json                   # TypeScript 配置
├── vite.config.ts                  # Vite 配置
├── tailwind.config.cjs             # Tailwind 配置
└── eslint.config.js                # ESLint 配置
```

## 🎯 核心特性

### 设计系统
- **渐变主题**: 自定义渐变色彩系统
- **玻璃拟态**: Glassmorphism 风格组件
- **暗黑模式**: 支持明暗主题切换
- **响应式设计**: 适配移动端和桌面端

### 国际化 (i18n)
- **多语言支持**: 中文、英文
- **持久化**: 用户语言偏好保存到 localStorage
- **命名空间**: 按功能模块组织语言资源

### 状态管理
- **Zustand**: 轻量级状态管理（主题、语言、认证）
- **React Query**: 服务端状态管理和缓存

### 用户体验
- **加载状态**: 统一的加载动画和骨架屏
- **错误处理**: 全局错误边界和友好错误提示
- **表单验证**: 实时验证和密码强度检测
- **客服支持**: 悬浮客服组件

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+ (推荐) 或 npm/yarn

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:5173
```

### 构建生产版本

```bash
# 构建
pnpm build

# 构建产物在 dist/ 目录
```

### 预览生产构建

```bash
pnpm preview
```

## 📜 可用脚本

```bash
# 开发
pnpm dev              # 启动开发服务器

# 构建
pnpm build            # 构建生产版本

# 代码质量
pnpm lint             # 运行 ESLint
pnpm format           # 检查 Prettier 格式
pnpm format:fix       # 自动修复 Prettier 格式
pnpm typecheck        # TypeScript 类型检查

# 预览
pnpm preview          # 预览生产构建
```

## ⚙️ 环境变量

创建 `.env.local` 文件：

```bash
# API 基础地址
VITE_API_BASE_URL=http://localhost:8080/api

# 生产环境
# VITE_API_BASE_URL=https://expat-compass.auberginewly.site/api
```

### 环境变量说明

- `VITE_API_BASE_URL`: 后端 API 基础地址（必需）

## 🎨 主题配置

主题配置在 `src/styles/theme.ts`：

```typescript
export const themes = {
  light: {
    primary: '...',
    gradient: '...',
  },
  dark: {
    primary: '...',
    gradient: '...',
  },
};
```

## 🌐 国际化配置

### 添加新语言

1. 在 `src/locales/` 下创建新的语言目录（如 `ja/`）
2. 复制现有语言文件并翻译
3. 在 `src/lib/i18n.ts` 中注册新语言：

```typescript
i18n.use(LanguageDetector).init({
  supportedLngs: ['zh', 'en', 'ja'],
  // ...
});
```

### 添加新的命名空间

1. 在 `src/locales/{lang}/` 下创建新的 JSON 文件
2. 在 `src/lib/i18n.ts` 中注册命名空间：

```typescript
i18n.addResourceBundle('zh', 'newNamespace', {
  // ...
});
```

## 📱 路由配置

路由定义在 `src/routes/AppRoutes.tsx`：

```typescript
const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/forum', element: <ForumPage /> },
  // ...
];
```

## 🔐 认证流程

1. **登录**: `LoginPage` → `authService.login()` → 保存 Token
2. **Token 管理**: 存储在 `authStore` 和 localStorage
3. **API 请求**: `apiClient` 自动在请求头添加 Token
4. **Token 刷新**: 自动处理 Token 过期和刷新

## 🚢 部署

### 使用部署脚本

```bash
# 一键部署（推荐）
./scripts/deploy.sh

# 单独部署前端
./scripts/deploy-frontend.sh
```

### 手动部署

1. **构建**
```bash
pnpm build
```

2. **上传到服务器**
```bash
scp -r dist/* user@server:/path/to/nginx/html/
```

3. **配置 Nginx**
```nginx
server {
    listen 8082;
    root /www/wwwroot/expat-compass/frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
    }
}
```

## 📝 代码规范

### ESLint

使用 Airbnb 配置 + TypeScript：

```bash
pnpm lint              # 检查
pnpm lint --fix        # 自动修复
```

### Prettier

```bash
pnpm format            # 检查格式
pnpm format:fix        # 自动格式化
```

### Stylelint

```bash
pnpm stylelint "src/**/*.css"  # 检查 CSS
```

### Git Hooks

使用 Husky + lint-staged，提交前自动：
- 运行 ESLint
- 格式化代码（Prettier）

## 🐛 故障排查

### 常见问题

1. **API 请求失败**
   - 检查 `VITE_API_BASE_URL` 配置
   - 验证后端服务是否运行
   - 查看浏览器控制台网络请求

2. **国际化不生效**
   - 检查语言资源文件是否存在
   - 验证命名空间是否正确注册
   - 查看浏览器 localStorage 中的语言设置

3. **主题切换不生效**
   - 检查 `appStore` 中的主题状态
   - 验证 Tailwind 配置中的主题类
   - 查看浏览器控制台错误

4. **构建失败**
   - 清除缓存：`rm -rf node_modules .vite dist`
   - 重新安装依赖：`pnpm install`
   - 检查 TypeScript 类型错误：`pnpm typecheck`

## 📚 相关文档

- [后端 README](../backend/README.md)
- [部署文档](../../docs/deployment.md)
- [脚本使用指南](../../scripts/README.md)

## 📄 许可证

本项目采用 MIT 许可证。
