# Backend - 单模块项目

## 项目结构

```
backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/expats/nanchang/
│       │       ├── api/                    # API 层（控制器）
│       │       ├── application/            # 应用服务层（业务逻辑）
│       │       ├── core/                   # 核心领域层（实体）
│       │       ├── infrastructure/        # 基础设施层（Repository、配置、外部服务）
│       │       ├── shared/                 # 共享 DTO
│       │       ├── support/                # 支持模块（异常、日志、配置）
│       │       └── GatewayApplication.java # 主应用类
│       └── resources/
│           └── application.yml
├── pom.xml
├── mvnw
└── mvnw.cmd
```

## 分层架构

### API 层 (`api/`)
- **职责**：处理 HTTP 请求和响应
- **包含**：REST Controller

### Application 层 (`application/`)
- **职责**：实现业务用例，编排领域对象
- **包含**：Service 类、事务管理

### Core 层 (`core/`)
- **职责**：领域模型，业务实体
- **包含**：Entity、Domain Service

### Infrastructure 层 (`infrastructure/`)
- **职责**：技术实现细节
- **包含**：
  - Repository 接口（JPA）
  - 外部服务客户端（AI、第三方 API）
  - 配置类（Security、Filter）

### Shared (`shared/`)
- **职责**：通用 DTO、工具类

### Support (`support/`)
- **职责**：异常、日志、通用配置

## 运行

```bash
# 编译
./mvnw clean compile

# 运行
./mvnw spring-boot:run
```

## 配置

主应用类 `GatewayApplication` 配置：
- `@SpringBootApplication(scanBasePackages = "com.expats.nanchang")` - 扫描所有包
- `@EntityScan(basePackages = "com.expats.nanchang.core")` - 扫描 Core 层的实体
- `@EnableJpaRepositories(basePackages = "com.expats.nanchang.infrastructure")` - 扫描 Infrastructure 层的 Repository

