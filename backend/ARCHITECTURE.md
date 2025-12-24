# 后端架构说明

## 分层架构

本项目采用标准的分层架构（Layered Architecture），将代码按照职责划分为不同的层次：

```
com.expats.nanchang/
├── controller/          # 控制器层（Controller Layer）
│   └── 处理HTTP请求，参数验证，调用Service层
│
├── service/            # 服务层（Service Layer）
│   └── 业务逻辑处理，事务管理，调用Repository层
│
├── repository/         # 仓库层（Repository Layer）
│   └── 数据访问，数据库操作（JPA Repository）
│
├── domain/             # 领域实体层（Domain/Entity Layer）
│   └── JPA实体类，领域模型
│
├── dto/                # 数据传输对象层（DTO Layer）
│   ├── request/        # 请求DTO（接收前端数据）
│   └── response/       # 响应DTO（返回给前端的数据）
│
├── config/             # 配置层（Configuration Layer）
│   └── Spring配置类（Security、Web等）
│
├── infrastructure/     # 基础设施层（Infrastructure Layer）
│   ├── filter/         # 过滤器（JWT认证、TraceId等）
│   ├── util/           # 工具类（JWT工具、密码强度检查等）
│   └── integration/    # 外部集成（AI客户端等）
│
├── exception/          # 异常类（Exception Layer）
│   └── 自定义异常类
│
└── GatewayApplication.java  # 应用启动类
```

## 各层职责

### 1. Controller 层
- **职责**：处理HTTP请求和响应
- **包含**：REST API端点、参数验证、调用Service层
- **示例**：`AuthController`、`PostController`

### 2. Service 层
- **职责**：业务逻辑处理
- **包含**：业务规则、事务管理、调用Repository层
- **示例**：`AuthService`、`PostService`

### 3. Repository 层
- **职责**：数据访问
- **包含**：JPA Repository接口、数据库查询方法
- **示例**：`UserRepository`、`PostRepository`

### 4. Domain 层
- **职责**：领域实体模型
- **包含**：JPA实体类、领域对象
- **示例**：`User`、`Post`、`Comment`

### 5. DTO 层
- **职责**：数据传输对象
- **包含**：
  - `request/`：接收前端请求的数据结构
  - `response/`：返回给前端的数据结构
- **示例**：`LoginRequest`、`AuthResponse`

### 6. Config 层
- **职责**：Spring配置
- **包含**：Security配置、Web配置等
- **示例**：`SecurityConfig`、`WebConfig`

### 7. Infrastructure 层
- **职责**：基础设施和横切关注点
- **包含**：
  - `filter/`：HTTP过滤器（JWT认证、TraceId等）
  - `util/`：工具类（JWT工具、密码检查等）
  - `integration/`：外部服务集成（AI客户端等）

### 8. Exception 层
- **职责**：异常处理
- **包含**：自定义异常类
- **示例**：`BusinessException`

## 数据流向

```
前端请求
  ↓
Controller层（参数验证）
  ↓
Service层（业务逻辑）
  ↓
Repository层（数据访问）
  ↓
Database
```

## 依赖规则

- **Controller** → Service → Repository → Domain
- **Controller** → DTO（request/response）
- **Service** → Domain、DTO
- **Repository** → Domain
- **Config** → Infrastructure
- **Infrastructure** → Domain、DTO

## 命名规范

- **Controller**：`*Controller.java`
- **Service**：`*Service.java`
- **Repository**：`*Repository.java`
- **Domain**：实体类名（如 `User.java`）
- **DTO**：`*Request.java`、`*Response.java`、`*Dto.java`

