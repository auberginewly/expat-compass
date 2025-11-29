package com.expats.nanchang.infrastructure.integration.ai;

import org.springframework.stereotype.Component;

@Component
public class MockAiClient implements AiClient {
    @Override
    public String chat(String conversationId, String prompt) {
        return "暂未接入真实模型：" + prompt;
    }
}

