package com.expats.nanchang.common.dto.ai;

import java.time.OffsetDateTime;

/**
 * 消息DTO
 * 用于API响应，避免实体序列化问题
 */
public record MessageDto(
        Long id,
        String role,
        String content,
        OffsetDateTime createdAt
) {
    public static MessageDto from(com.expats.nanchang.core.ai.domain.Message message) {
        return new MessageDto(
                message.getId(),
                message.getRole(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}

