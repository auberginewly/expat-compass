package com.expats.nanchang.shared.dto;

import java.time.OffsetDateTime;

/**
 * 基础响应包装，方便前后端约定统一格式。
 */
public record ResponseEnvelope<T>(
        String traceId,
        OffsetDateTime timestamp,
        T data
) {
    public static <T> ResponseEnvelope<T> success(String traceId, T data) {
        return new ResponseEnvelope<>(traceId, OffsetDateTime.now(), data);
    }
}

