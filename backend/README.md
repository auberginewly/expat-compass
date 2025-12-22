# Expat Compass 后端服务

南昌市外籍人士一站式多语种生活服务平台后端 API 服务。

## 📋 技术栈

- **框架**: Spring Boot 3.3.1
- **语言**: Java 17
- **数据库**: PostgreSQL
- **ORM**: Spring Data JPA / Hibernate
- **安全**: Spring Security + JWT
- **构建工具**: Maven
- **AI 集成**: 硅基流动 (SiliconFlow)

## 🏗️ 项目结构

```
backend/
├── src/main/java/com/expats/nanchang/
│   ├── GatewayApplication.java          # 主应用入口
│   │
│   ├── api/                              # API 层（控制器）
│   │   └── controller/
│   │       ├── AuthController.java       # 认证（登录/注册）
│   │       ├── PostController.java       # 论坛帖子
│   │       ├── CommentController.java    # 论坛评论
│   │       ├── FileUploadController.java # 文件上传
│   │       ├── AiController.java         # AI 对话
│   │       └── HealthController.java     # 健康检查
│   │
│   ├── application/                      # 应用服务层（业务逻辑）
│   │   ├── identity/
│   │   │   └── AuthService.java          # 认证服务
│   │   ├── forum/
│   │   │   ├── PostService.java          # 帖子服务
│   │   │   └── CommentService.java       # 评论服务
│   │   ├── content/
│   │   │   └── GuideService.java         # 指南服务
│   │   └── ai/
│   │       └── AiService.java           # AI 服务
│   │
│   ├── core/                             # 核心领域层（实体）
│   │   ├── identity/domain/              # 用户、角色
│   │   ├── forum/domain/                 # 帖子、评论
│   │   ├── content/domain/               # 指南内容
│   │   └── ai/domain/                    # AI 对话、知识库
│   │
│   ├── infrastructure/                   # 基础设施层
│   │   ├── identity/
│   │   │   ├── repository/               # 用户、角色 Repository
│   │   │   ├── service/                  # 验证码服务
│   │   │   └── util/                     # JWT、密码工具
│   │   ├── forum/repository/             # 论坛 Repository
│   │   ├── content/repository/           # 内容 Repository
│   │   ├── ai/
│   │   │   ├── repository/               # AI Repository
│   │   │   └── integration/              # AI 客户端集成
│   │   ├── config/                       # 配置类（Security、Web）
│   │   └── filter/                       # 过滤器（JWT、TraceId）
│   │
│   ├── common/                           # 共享模块
│   │   ├── dto/                          # DTO 类
│   │   ├── exception/                    # 业务异常
│   │   └── logging/                      # 日志追踪
│   │
│   └── support/                          # 支持模块（已整合到 common）
│
└── src/main/resources/
    ├── application.yml                   # 主配置文件
    └── db/                               # 数据库脚本
```

## 🎯 分层架构

### API 层 (`api/`)
- **职责**: 处理 HTTP 请求和响应
- **包含**: REST Controller，参数验证，异常处理

### Application 层 (`application/`)
- **职责**: 实现业务用例，编排领域对象
- **包含**: Service 类，事务管理，业务逻辑

### Core 层 (`core/`)
- **职责**: 领域模型，业务实体
- **包含**: Entity 类，Domain Service，业务规则

### Infrastructure 层 (`infrastructure/`)
- **职责**: 技术实现细节
- **包含**:
  - Repository 接口（JPA）
  - 外部服务客户端（AI、第三方 API）
  - 配置类（Security、Filter、Web）
  - 工具类（JWT、密码强度）

### Common 层 (`common/`)
- **职责**: 通用 DTO、异常、日志追踪
- **包含**: Request/Response DTO，业务异常，TraceId

## 🚀 快速开始

### 环境要求

- JDK 17+
- Maven 3.6+
- PostgreSQL 12+

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/auberginewly/expat-compass.git
cd expat-compass/backend
```

2. **配置数据库**
```bash
# 创建数据库
createdb expat_compass_db

# 或使用 PostgreSQL 客户端
psql -U postgres
CREATE DATABASE expat_compass_db;
```

3. **配置应用**
编辑 `src/main/resources/application.yml`，修改数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/expat_compass_db
    username: your_username
    password: your_password
```

4. **运行应用**
```bash
# 使用 Maven Wrapper
./mvnw spring-boot:run

# 或使用 Maven
mvn spring-boot:run
```

5. **验证运行**
访问 `http://localhost:8080/api/health`，应返回健康状态。

### 构建打包

```bash
# 编译
./mvnw clean compile

# 打包（生成可执行 JAR）
./mvnw clean package

# 运行 JAR
java -jar target/backend-0.1.0-SNAPSHOT.jar
```

## ⚙️ 配置说明

### 数据库配置

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/expat_compass_db
    username: auberginewly
    password: 1234
  jpa:
    hibernate:
      ddl-auto: update  # 开发环境：update | 生产环境：validate
    show-sql: true      # 开发环境显示 SQL
```

### JWT 配置

```yaml
jwt:
  secret: your-secret-key-min-256-bits  # 生产环境必须修改
  access-token-validity: 604800000      # 7天（毫秒）
  refresh-token-validity: 604800000     # 7天（毫秒）
```

### 文件上传配置

```yaml
app:
  upload:
    dir: uploads  # 上传文件存储目录（相对路径或绝对路径）
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 50MB
```

### AI 服务配置

```yaml
ai:
  siliconflow:
    api-key: your-api-key
    model: Qwen/Qwen2.5-72B-Instruct
  client:
    type: siliconflow  # mock | siliconflow
```

## 📡 API 端点

### 认证相关
- `POST /api/auth/signup` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新 Token
- `POST /api/auth/captcha` - 获取验证码

### 论坛相关
- `GET /api/posts` - 获取帖子列表
- `POST /api/posts` - 创建帖子
- `GET /api/posts/{id}` - 获取帖子详情
- `DELETE /api/posts/{id}` - 删除帖子（管理员）
- `GET /api/posts/{id}/comments` - 获取评论列表
- `POST /api/posts/{id}/comments` - 创建评论

### 管理员相关
- `DELETE /api/admin/posts/{id}` - 删除帖子
- `DELETE /api/admin/comments/{id}` - 删除评论

### 文件上传
- `POST /api/upload` - 上传文件（图片）

### AI 对话
- `POST /api/ai/chat` - AI 对话

### 健康检查
- `GET /api/health` - 健康检查

## 🔐 安全配置

- **JWT 认证**: 所有需要认证的接口都需要在请求头中携带 `Authorization: Bearer <token>`
- **角色权限**: 使用 `@PreAuthorize("hasRole('ADMIN')")` 进行角色验证
- **公开接口**: `/api/auth/**`, `/api/health`, `/uploads/**` 无需认证

## 🗄️ 数据库

### 主要表结构

- `users` - 用户表
- `roles` - 角色表
- `user_roles` - 用户角色关联表
- `forum_posts` - 论坛帖子表
- `forum_comments` - 论坛评论表
- `conversations` - AI 对话表
- `messages` - AI 消息表
- `guides` - 指南内容表

### 初始化管理员

使用脚本创建管理员账号：
```bash
./scripts/setup-admin-user.sh
```

默认管理员：
- 邮箱: `admin@qq.com`
- 密码: `admin`

## 🚢 部署

### 使用部署脚本

```bash
# 一键部署（推荐）
./scripts/deploy.sh

# 单独部署后端
./scripts/deploy-backend.sh
```

### 手动部署

1. **构建 JAR**
```bash
./mvnw clean package
```

2. **上传到服务器**
```bash
scp target/backend-0.1.0-SNAPSHOT.jar user@server:/path/to/app/
```

3. **运行服务**
```bash
java -jar backend-0.1.0-SNAPSHOT.jar
```

### 生产环境配置

创建 `application-prod.yml`：
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/expat_compass_db
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

jwt:
  secret: ${JWT_SECRET}

app:
  upload:
    dir: /www/wwwroot/expat-compass/uploads

logging:
  level:
    root: INFO
```

使用环境变量运行：
```bash
java -jar backend-0.1.0-SNAPSHOT.jar --spring.profiles.active=prod
```

## 📝 开发规范

### 代码风格
- 遵循 Java 命名规范
- 使用 4 空格缩进
- 类和方法添加 JavaDoc 注释

### 提交规范
- 使用有意义的提交信息
- 遵循 Conventional Commits 规范

## 🐛 故障排查

### 常见问题

1. **数据库连接失败**
   - 检查 PostgreSQL 是否运行
   - 验证数据库连接信息
   - 检查防火墙设置

2. **JWT 认证失败**
   - 检查 Token 是否过期
   - 验证 JWT Secret 配置
   - 查看日志中的认证错误

3. **文件上传失败**
   - 检查上传目录权限
   - 验证文件大小限制
   - 查看 Nginx 配置（生产环境）

## 📚 相关文档

- [部署文档](../../docs/deployment.md)
- [管理员指南](../../docs/admin-guide.md)
- [SSL 配置](../../docs/ssl-setup.md)

## 📄 许可证

本项目采用 MIT 许可证。
