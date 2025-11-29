-- 数据库表结构初始化脚本
-- 注意：如果使用 JPA ddl-auto: update，此脚本仅作为参考

-- 1. 用户认证模块

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(120) NOT NULL,
    display_name VARCHAR(80),
    preferred_language VARCHAR(8) DEFAULT 'zh',
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- 角色表
CREATE TABLE IF NOT EXISTS roles (
    id SMALLSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name_i18n JSONB NOT NULL
);

-- 用户角色关联表
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id SMALLINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 刷新令牌表
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- 2. 论坛模块

-- 论坛帖子表
CREATE TABLE IF NOT EXISTS forum_posts (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'published',
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 论坛评论表
CREATE TABLE IF NOT EXISTS forum_comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id BIGINT REFERENCES forum_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 论坛互动表（点赞/收藏）
CREATE TABLE IF NOT EXISTS forum_reactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL,
    target_id BIGINT NOT NULL,
    reaction_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, target_type, target_id, reaction_type)
);

-- 论坛举报表
CREATE TABLE IF NOT EXISTS forum_reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL,
    target_id BIGINT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    handled_by BIGINT REFERENCES users(id),
    handled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. AI助手模块

-- 知识库表
CREATE TABLE IF NOT EXISTS knowledge_base (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    tags TEXT[],
    metadata JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 对话会话表
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 消息关联知识库表（记录AI回答引用的知识）
CREATE TABLE IF NOT EXISTS message_knowledge (
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    knowledge_id BIGINT NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    relevance_score DECIMAL(5,4),
    PRIMARY KEY (message_id, knowledge_id)
);

-- 4. 索引

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 论坛表索引
CREATE INDEX IF NOT EXISTS idx_posts_author ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON forum_posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON forum_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_reactions_target ON forum_reactions(target_type, target_id);

-- AI助手表索引
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_active ON knowledge_base(is_active);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);

-- 刷新令牌索引
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- 5. 初始化角色数据
INSERT INTO roles (code, name_i18n) VALUES 
    ('USER', '{"zh": "用户", "en": "User"}'),
    ('ADMIN', '{"zh": "管理员", "en": "Administrator"}'),
    ('MODERATOR', '{"zh": "版主", "en": "Moderator"}')
ON CONFLICT (code) DO NOTHING;

