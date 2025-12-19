package com.expats.nanchang.common.dto.ai;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * 会话DTO
 * 用于API响应，避免实体序列化问题
 */
public record ConversationDto(
        UUID id,
        String title,
        String status,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    public static ConversationDto from(com.expats.nanchang.core.ai.domain.Conversation conversation) {
        return new ConversationDto(
                conversation.getId(),
                conversation.getTitle(),
                conversation.getStatus(),
                conversation.getCreatedAt(),
                conversation.getUpdatedAt()
        );
    }
}

