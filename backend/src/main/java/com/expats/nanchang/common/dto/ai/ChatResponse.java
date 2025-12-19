package com.expats.nanchang.common.dto.ai;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * AI对话响应
 */
public record ChatResponse(
        UUID conversationId,
        String message,
        OffsetDateTime timestamp
) {
}

