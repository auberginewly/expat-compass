package com.expats.nanchang.dto;

import java.time.OffsetDateTime;

/**
 * 统一响应包装类
 */
public record ResponseEnvelope<T>(
        String traceId,
        OffsetDateTime timestamp,
        boolean success,
        T data,
        String message,
        String errorCode
) {
    public static <T> ResponseEnvelope<T> success(String traceId, T data) {
        return new ResponseEnvelope<>(
                traceId,
                OffsetDateTime.now(),
                true,
                data,
                null,
                null
        );
    }

    public static <T> ResponseEnvelope<T> error(String traceId, String errorCode, String message) {
        return new ResponseEnvelope<>(
                traceId,
                OffsetDateTime.now(),
                false,
                null,
                message,
                errorCode
        );
    }
}


