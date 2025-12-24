# 后端代码重构指南

## 重构目标

将代码从**功能模块组织方式**重构为**标准分层架构**，使代码结构更清晰、更易维护。

## 当前结构 vs 目标结构

### 当前结构（按功能模块组织）
```
com.expats.nanchang/
├── api/controller/          # 控制器
├── application/             # 服务（按模块）
├── core/                   # 实体（按模块）
├── common/                  # 通用类
└── infrastructure/          # 基础设施（按模块）
```

### 目标结构（标准分层架构）
```
com.expats.nanchang/
├── controller/             # 控制器层
├── service/                # 服务层
├── repository/             # 仓库层
├── domain/                 # 领域实体层
├── dto/                    # 数据传输对象层
│   ├── request/            # 请求DTO
│   └── response/           # 响应DTO
├── config/                 # 配置层
├── infrastructure/         # 基础设施层
│   ├── filter/            # 过滤器
│   ├── util/              # 工具类
│   └── integration/       # 外部集成
├── exception/             # 异常类
└── GatewayApplication.java
```

## 包名映射表

| 旧包名 | 新包名 |
|--------|--------|
| `com.expats.nanchang.api.controller` | `com.expats.nanchang.controller` |
| `com.expats.nanchang.application.*` | `com.expats.nanchang.service` |
| `com.expats.nanchang.infrastructure.*.repository` | `com.expats.nanchang.repository` |
| `com.expats.nanchang.core.*.domain` | `com.expats.nanchang.domain` |
| `com.expats.nanchang.common.dto.*` | `com.expats.nanchang.dto.request` 或 `dto/response` |
| `com.expats.nanchang.common.dto` | `com.expats.nanchang.dto` |
| `com.expats.nanchang.infrastructure.config` | `com.expats.nanchang.config` |
| `com.expats.nanchang.common.exception` | `com.expats.nanchang.exception` |
| `com.expats.nanchang.common.logging` | `com.expats.nanchang.infrastructure.util` |
| `com.expats.nanchang.infrastructure.identity.util` | `com.expats.nanchang.infrastructure.util` |
| `com.expats.nanchang.infrastructure.identity.service` | `com.expats.nanchang.infrastructure.util` |

## DTO 分类规则

### Request DTO（放在 `dto/request/`）
- `*Request.java`（如 `LoginRequest`, `SignupRequest`, `CreatePostRequest`）
- `ChatRequest.java`

### Response DTO（放在 `dto/response/`）
- `*Response.java`（如 `AuthResponse`, `CaptchaResponse`）
- `*Dto.java`（如 `PostDto`, `CommentDto`, `ConversationDto`, `MessageDto`）

### 通用 DTO（放在 `dto/`）
- `ResponseEnvelope.java`

## 重构步骤

### 1. 创建新目录结构
```bash
mkdir -p backend/src/main/java/com/expats/nanchang/{controller,service,repository,domain,dto/{request,response},config,infrastructure/{filter,util,integration/ai},exception}
```

### 2. 移动文件
- Controller: `api/controller/*.java` → `controller/`
- Service: `application/**/*.java` → `service/`
- Repository: `infrastructure/**/repository/*.java` → `repository/`
- Domain: `core/**/domain/*.java` → `domain/`
- DTO: `common/dto/**/*.java` → `dto/request/` 或 `dto/response/`
- Config: `infrastructure/config/*.java` → `config/`
- Infrastructure: 保持原有结构，但更新包名
- Exception: `common/exception/*.java` → `exception/`

### 3. 更新包声明和导入
使用提供的 Python 脚本自动更新：
```bash
python3 scripts/refactor-backend-packages.py
```

### 4. 更新 GatewayApplication
```java
@EntityScan(basePackages = "com.expats.nanchang.domain")
@EnableJpaRepositories(basePackages = "com.expats.nanchang.repository")
```

### 5. 清理旧目录
删除空的旧目录结构

## 注意事项

1. **备份代码**：重构前请先提交或备份代码
2. **测试**：重构后需要运行所有测试确保功能正常
3. **IDE 刷新**：重构后需要刷新 IDE 项目结构
4. **编译检查**：确保所有文件能正常编译

## 验证清单

- [ ] 所有 Controller 文件在 `controller/` 包
- [ ] 所有 Service 文件在 `service/` 包
- [ ] 所有 Repository 文件在 `repository/` 包
- [ ] 所有 Domain 文件在 `domain/` 包
- [ ] 所有 DTO 文件在正确的 `dto/` 子包
- [ ] 所有 Config 文件在 `config/` 包
- [ ] 所有包声明已更新
- [ ] 所有导入语句已更新
- [ ] GatewayApplication 配置已更新
- [ ] 项目能正常编译
- [ ] 所有测试通过

