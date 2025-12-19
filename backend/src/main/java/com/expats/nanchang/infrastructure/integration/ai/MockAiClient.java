package com.expats.nanchang.infrastructure.integration.ai;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Mock AI客户端（仅用于开发测试）
 * 当配置 ai.client.type=mock 时才会启用
 */
@Component
@ConditionalOnProperty(name = "ai.client.type", havingValue = "mock", matchIfMissing = false)
public class MockAiClient implements AiClient {
    @Override
    public String chat(String conversationId, String prompt) {
        return "暂未接入真实模型：" + prompt;
    }
}

