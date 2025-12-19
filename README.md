# 情暖豫章，昌外"e"家：南昌外籍人士一站式多语种生活服务平台

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0+-6db33f.svg)](https://spring.io/projects/spring-boot)

## 项目简介

**情暖豫章，昌外"e"家** 是面向南昌市外籍居民与国际访客的一站式多语种生活服务平台。项目以国家政策为基石，以在昌外籍人士为服务对象，以网站为主要载体，旨在提升在昌外籍人士获取社会公共服务的效率与质量，促进其安居乐业，增强国际友好往来。

## 核心功能

### 🌐 多语言支持
- 支持中英文双语切换
- 完整的国际化内容覆盖
- 用户语言偏好持久化

### 🏥 生活服务指南
- **医疗就诊**：医院信息、医保办理、预约挂号指南
- **校内外交通**：地铁、公交、网约车、导航等交通信息
- **支付与银行卡**：开户、移动支付、外汇等金融服务
- **学习与教务**：学校信息、入学申请、语言学习指南
- **文化与活动**：景点信息、文化活动、美食推荐

### 💬 社区论坛
- 公共交流论坛，支持发帖、评论、回复
- 图片上传与预览
- 标签系统与热门标签推荐
- 我的帖子管理

### 🤖 AI 智能客服
- 多轮对话支持
- 对话历史保存
- 基于 SiliconFlow API 的智能问答

### 👤 用户中心
- 用户注册与登录（JWT 认证）
- 个人资料管理（头像、昵称）
- 密码修改
- 账号注销

## 技术栈

### 前端
- **框架**：React 18 + TypeScript + Vite
- **UI 组件库**：Ant Design 5
- **样式**：Tailwind CSS + 自定义渐变主题
- **状态管理**：Zustand
- **数据获取**：React Query (TanStack Query)
- **路由**：React Router v6
- **国际化**：i18next + react-i18next
- **HTTP 客户端**：Axios
- **表单处理**：Ant Design Form
- **时间处理**：dayjs

### 后端
- **框架**：Spring Boot 3.x
- **数据库**：PostgreSQL
- **ORM**：Spring Data JPA
- **安全**：Spring Security + JWT
- **验证码**：EasyCaptcha
- **AI 集成**：SiliconFlow API (OpenAI 兼容)
- **文件上传**：Spring MultipartFile

### 开发工具
- **代码规范**：ESLint + Prettier + Stylelint
- **Git 钩子**：Husky + lint-staged
- **构建工具**：Vite (前端) + Maven (后端)

## 项目结构

```
expat-compass/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面
│   │   ├── routes/       # 路由配置
│   │   ├── stores/       # 状态管理
│   │   ├── lib/          # 工具库
│   │   ├── locales/      # 国际化资源
│   │   └── styles/       # 样式文件
│   └── package.json
├── backend/              # 后端项目
│   ├── src/main/java/
│   │   └── com/expats/nanchang/
│   │       ├── api/      # REST 控制器
│   │       ├── application/ # 应用服务层
│   │       ├── core/      # 领域模型
│   │       ├── infrastructure/ # 基础设施层
│   │       └── common/    # 公共组件
│   └── pom.xml
└── docs/                # 项目文档
```

## 快速开始

### 环境要求
- Node.js 18+
- Java 17+
- PostgreSQL 14+
- pnpm (推荐) 或 npm

### 前端启动

```bash
cd frontend
pnpm install
pnpm dev
```

访问 http://localhost:5173

### 后端启动

```bash
cd backend
./mvnw spring-boot:run
```

API 服务运行在 http://localhost:8080

### 数据库初始化

数据库表结构定义在 `backend/src/main/resources/db/schema.sql`，首次运行前请先创建数据库并执行该脚本。

## 项目特色

### 1. 从"信息发布"到"服务导航"的模式创新
超越简单的政策文件罗列，构建"查询-理解-行动"全链条服务导航系统，将复杂政务信息拆解为清晰步骤，通过多语种图文指南直观演示。

### 2. "平台+社区+志愿者"三位一体创新
整合公共交流论坛与多语种在线志愿者服务，将单向信息传递升级为双向互动服务生态，让服务更"有温度"。

## 社会价值

1. **服务国家对外开放战略**：搭建多语种综合信息平台，优化国际营商环境，增强城市对外籍人才的吸引力。
2. **促进公共服务均等化与跨文化融合**：多语种呈现医疗、教育等领域权威便民信息，降低获取门槛，搭建中外文化交流窗口。
3. **赋能城市治理现代化**：打造"互联网+政务"服务模式，实现公共服务多语种全覆盖，提升服务效率与精准度。
4. **激发社会创新活力**：由大学生团队践行"双创"政策，探索"公益+创业"可持续模式，培养具备国际视野与数字能力的复合型人才。

## 许可证

本项目采用 MIT 许可证。

## 相关链接

- [GitHub 项目地址](https://github.com/auberginewly/expat-compass)
- [项目申报书](./docs/项目申报书.pdf)

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**Made with ❤️ by Expat Compass Team**
