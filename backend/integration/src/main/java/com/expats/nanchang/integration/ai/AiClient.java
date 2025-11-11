package com.expats.nanchang.integration.ai;

/**
 * AI 对话平台客户端抽象。
 */
public interface AiClient {

    String chat(String conversationId, String prompt);
}

