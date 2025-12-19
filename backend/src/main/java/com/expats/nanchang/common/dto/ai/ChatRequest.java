package com.expats.nanchang.common.dto.ai;

import jakarta.validation.constraints.NotBlank;

/**
 * AI对话请求
 */
public record ChatRequest(
        @NotBlank(message = "消息内容不能为空")
        String message,
        String conversationId  // 可选，如果为空则创建新会话
) {
}

