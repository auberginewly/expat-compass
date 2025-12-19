package com.expats.nanchang.common.logging;

import java.util.UUID;

/**
 * 追踪ID持有者（用于请求追踪）
 */
public class TraceIdHolder {
    private static final ThreadLocal<String> TRACE_ID = new ThreadLocal<>();

    public static String get() {
        String traceId = TRACE_ID.get();
        if (traceId == null) {
            traceId = UUID.randomUUID().toString();
            TRACE_ID.set(traceId);
        }
        return traceId;
    }

    public static void set(String traceId) {
        TRACE_ID.set(traceId);
    }

    public static void clear() {
        TRACE_ID.remove();
    }
}


